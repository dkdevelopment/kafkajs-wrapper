import { initKafka } from '../../lib'
import { onCommand } from '../../lib/commandsManager'
import logger from '../../lib/logger'

const messageReceiver = async () => {
  await initKafka({ groupName: 'consumer-1' })

  onCommand('test.save', async ({ message }) => {
    logger.info('Received message on consumer-1 %o', message)
  })
}

messageReceiver()
