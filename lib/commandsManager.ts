import { eventEmitter, producer } from '.'
import { Message } from './handlers'

declare global {
  interface KafkaCommands {}
}

export const onCommand = <T extends keyof KafkaCommands>(
  command: keyof KafkaCommands,
  callback: (payload: KafkaCommands[T]) => Promise<void>
) => {
  eventEmitter.on(command, async (payload: Message<KafkaCommands[T]>) => {
    await callback(payload.message)
    eventEmitter.emit(payload.trackId)
  })
}

export const emitCommand = async <T extends keyof KafkaCommands>(
  command: keyof KafkaCommands,
  payload: KafkaCommands[T]
) => {
  await producer.send({
    topic: `command.${command}`,
    messages: [{ value: JSON.stringify(payload) }]
  })
}
