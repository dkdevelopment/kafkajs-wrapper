import { initKafka } from '../../lib'
import { emitCommand } from '../../lib/commandsManager'
import logger from '../../lib/logger'

const chatSimulator = async () => {
  await initKafka()

  for (let i = 0; i <= 1e4; i++) {
    logger.trace('sending command')
    await emitCommand('test.save', { message: `Hello world - ${i}` })
  }
}

chatSimulator()
