import { eventEmitter, producer } from '.'
import logger from './logger'
import { Message } from './handlers'

declare global {
  interface Commands {
    'test.save': {
      message: string
    }
  }
}

export const onCommand = <T extends keyof Commands>(
  command: keyof Commands,
  callback: (payload: Commands[T]) => Promise<void>
) => {
  eventEmitter.on(command, async (payload: Message<Commands[T]>) => {
    await callback(payload.message)
    eventEmitter.emit(payload.trackId)
  })
}

export const emitCommand = async <T extends keyof Commands>(
  command: keyof Commands,
  payload: Commands[T]
) => {
  await producer.send({
    topic: `command.${command}`,
    messages: [{ value: JSON.stringify(payload) }]
  })
}
