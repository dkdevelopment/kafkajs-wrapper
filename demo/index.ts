import { emitCommand, onCommand } from '../lib/commandsManager'
import logger from '../lib/logger'
import { initKafka } from '../lib'

Promise.resolve().then(async () => {
  await initKafka()
  const startTime = +new Date()
  await onCommand('test.save', (payload) => {
    logger.info('time from start %os message %o', (+new Date() - startTime) / 1000, payload.message)
  })
  for (let i = 0; i <= 1e4; i++) {
    emitCommand('test.save', { message: `command ${i}` })
  }
  logger.info('time to run %oms', +new Date() - startTime)
})
