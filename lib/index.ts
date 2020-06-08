import { Kafka, KafkaConfig, Producer, Consumer, logLevel } from 'kafkajs'
import { KafkaError, KafkaErrorCodes } from './errors'
import { EventEmitter } from 'eventemitter3'
import logger from './logger'
import * as cryptoRandomString from 'crypto-random-string'
import { handleMessage } from './handlers'

let kafka: Kafka
export let producer: Producer
export let consumer: Consumer

export const eventEmitter = new EventEmitter()

export const getRandomString = (length: number = 5) =>
  cryptoRandomString({ length, type: 'hex' })

export const initKafka = async (config?: KafkaConfig) => {
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

  consumer = kafka.consumer({ groupId: `kafka-lib-${getRandomString()}` })

  await consumer.connect()

  await consumer.subscribe({ topic: /(command.).*/ })
  await consumer.subscribe({ topic: /(event.).*/ })

  await consumer.run({
    eachMessage: handleMessage
  })

  producer = kafka.producer()

  await producer.connect()
}
