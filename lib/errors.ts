import logger from './logger'

export class KafkaError extends Error {
  message: string
  code: string

  constructor(message: string, code: string) {
    logger.error(message)
    super(message)
    this.code = code
  }
}

export const KafkaErrorCodes = {
  ALREADY_INSTANTIATED: 'KAF-1',
  NOT_ACKED: 'KAF-2'
}
