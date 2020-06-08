import { eventEmitter, producer } from '.'
import logger from './logger'

declare global {
  interface Commands {
    'test.save': {
      message: string
    }
  }
}

export const onCommand = <T extends keyof Commands>(
  command: keyof Commands, 
  callback: (payload: Commands[T]) => void
) => {
  eventEmitter.on(command, callback)
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