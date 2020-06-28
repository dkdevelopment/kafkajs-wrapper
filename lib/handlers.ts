import { EachMessagePayload } from 'kafkajs'
import { eventEmitter } from '.'
import { v4 as uuid } from 'uuid'
import logger from './logger'
import { KafkaError, KafkaErrorCodes } from './errors'

export interface Message<T> {
  trackId: string
  message: T
}

export const handleMessage = async (payload: EachMessagePayload) => {
  const topic = payload.topic.replace(/(command.)|(event.)/, '')
  const listeners = eventEmitter.listenerCount(topic)
  if (!listeners) {
    return
  }

  const message = JSON.parse(payload.message.value.toString('utf-8'))

  // on many listeners it may have problems with threads
  const errors = await ackAll(
    eventEmitter.listeners(topic).map(async (listener) => {
      const trackId = uuid()
      listener({ message, trackId })
      await waitForAck(trackId)
    })
  )

  if (errors.length) {
    throw new KafkaError(
      `${errors.length} messages not acked in time`,
      KafkaErrorCodes.NOT_ACKED
    )
  }
}

const ackAll = async (
  list: Array<Promise<void>>
): Promise<any[]> /* errors */ => {
  const result = await Promise.allSettled(list)

  const errors = result.filter((res) => res.status === 'rejected')

  return errors
}

const waitForAck = (trackId: string, timeout: number = 5000) =>
  new Promise((resolve, reject) => {
    const clock = setTimeout(
      () => reject(`Did not find ack in ${timeout}ms aborting...`),
      timeout
    )
    eventEmitter.once(trackId, () => {
      clearTimeout(clock)
      resolve()
    })
  })
