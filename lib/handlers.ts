import { EachMessagePayload } from 'kafkajs'
import { eventEmitter } from '.'
import { v4 } from 'uuid'

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
  const message = JSON.parse(Buffer.from(payload.message.value).toString('utf-8'))

  const data: Message<any> = { 
    trackId: v4(),
    message
  }

  eventEmitter.emit(topic, data)
  await waitForAck(data.trackId)
}

const waitForAck = (trackId: string, timeout: number = 5000) => new Promise((resolve, reject) => {
  const clock = setTimeout(() => reject(`Did not find ack in ${timeout}ms aborting...`), timeout)
  eventEmitter.once(trackId, () => {
    clearTimeout(clock)
    resolve()
  })
})