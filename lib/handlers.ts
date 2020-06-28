import { EachMessagePayload } from 'kafkajs'
import { eventEmitter } from '.'
import { v4 as uuid } from 'uuid'
import logger from './logger'

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
  await Promise.all(eventEmitter.listeners(topic).map(async listener => {
    const trackId = uuid()
    listener({ message, trackId })
    await waitForAck(trackId)
  }))
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
