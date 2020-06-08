import { initKafka } from '../../lib'
import { onCommand } from '../../lib/commandsManager'
import logger from '../../lib/logger'

const messageReceiver = async () => {
  await initKafka()

  onCommand('test.save', async ({ message }) => {
    logger.info('Received message %o', message)
  })
}

messageReceiver()