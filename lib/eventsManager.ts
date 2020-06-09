import { eventEmitter, producer } from '.'
import logger from './logger'
import { Message } from './handlers'

declare global {
  interface KafkaEvents {
    'test.saved': string
  }
}

export const onEvent = <T extends keyof KafkaEvents>(
  command: keyof KafkaEvents,
  callback: (payload: KafkaEvents[T]) => Promise<void>
) => {
  eventEmitter.on(command, async (payload: Message<KafkaEvents[T]>) => {
    await callback(payload.message)
    eventEmitter.emit(payload.trackId)
  })
}

export const emitEvent = async <T extends keyof KafkaEvents>(
  command: keyof KafkaEvents,
  payload: KafkaEvents[T]
) => {
  await producer.send({
    topic: `event.${command}`,
    messages: [{ value: JSON.stringify(payload) }]
  })
}
