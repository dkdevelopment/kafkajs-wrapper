import { initKafka } from '../../lib'
import { onCommand } from '../../lib/commandsManager'
import logger from '../../lib/logger'

const messageReceiver = async () => {
  await initKafka()

  onCommand('test.save', async ({ message }) => {
    logger.info('Received message on consumer-2 %o', message)
  })
}

messageReceiver()
