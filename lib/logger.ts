import * as log4js from 'log4js'

const logger = log4js.getLogger(`kafka-${process.pid}`)

logger.level = 'trace'

export default logger