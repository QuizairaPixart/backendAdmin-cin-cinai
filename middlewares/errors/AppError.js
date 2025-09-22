class AppError extends Error {
  constructor (errorCode, message, statusCode, stack) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.stack = stack
  }
}
class SequelizeError extends Error {
  constructor (errorCode, message, statusCode, sql) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.sql = sql
  }
}
class RedisError extends Error {
  constructor (errorCode, message, statusCode, trace) {
    super(message)
    this.errorCode = errorCode
    this.statusCode = statusCode
    this.trace = trace
  }
}

const throwAppError = (e, errorMess) => {
  throw new AppError(e.errorCode ?? errorMess, e.message, 500, e.stack)
}

module.exports = { throwAppError, AppError, SequelizeError, RedisError }
