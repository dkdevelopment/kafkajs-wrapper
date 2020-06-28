import { initKafka } from '../../lib'
import { onCommand } from '../../lib/commandsManager'
import logger from '../../lib/logger'

declare global {
  interface KafkaCommands {
    'test.save': { message: string }
  }
}

const messageReceiver = async () => {
  await initKafka()

  onCommand('test.save', async ({ message }) => {
    logger.info('Received message on consumer-1 %o', message)
  })
}

messageReceiver()
