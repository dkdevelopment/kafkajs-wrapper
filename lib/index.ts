import { Kafka, KafkaConfig, Producer, Consumer, logLevel } from 'kafkajs'
import { KafkaError, KafkaErrorCodes } from './errors'
import { EventEmitter } from 'eventemitter3'
import logger from './logger'
import cryptoRandomString from 'crypto-random-string'
import { handleMessage } from './handlers'
import packageJson from '../package.json'

let kafka: Kafka
export let producer: Producer
export let consumer: Consumer

export const eventEmitter = new EventEmitter()

export const getRandomString = (length: number = 5) =>
  cryptoRandomString({ length, type: 'hex' })

type Config = Partial<KafkaConfig> & {
  groupName?: string
}

export const initKafka = async (config: Config = {}) => {
  if (kafka) {
    throw new KafkaError(
      'You need to disconnect before creating new instance of Kafka',
      KafkaErrorCodes.ALREADY_INSTANTIATED
    )
  }

  kafka = new Kafka({
    brokers: ['localhost:9092'],
    logLevel: logLevel.ERROR,
    ...(config || {})
  })

  const groupName = config.groupName || packageJson.name

  consumer = kafka.consumer({ groupId: `service-${groupName}` })

  await consumer.connect()

  await consumer.subscribe({ topic: /(command.).*/ })
  await consumer.subscribe({ topic: /(event.).*/ })

  await consumer.run({
    eachMessage: handleMessage
  })

  producer = kafka.producer()

  await producer.connect()
}

const handleClose = async () => {
  try {
    logger.info('Closing producer connection')
    await producer.disconnect()
    logger.info('Successfully closed producer')
  } catch(e) {
    logger.error('Could not disconnect producer. Error message received %o', e)
  }

  try {
    logger.info('Closing consumer connection')
    await consumer.disconnect()
    logger.info('Successfully closed consumer')
  } catch(e) {
    logger.error('Could not disconnect consumer. Error message received %o', e)
  }
}

process.on('SIGINT', handleClose)
// process.on('SIGTERM', handleClose)
// process.on('SIGKILL', handleClose)