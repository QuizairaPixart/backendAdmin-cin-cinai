const { AppError } = require('./AppError')

const handleErrors = (err, req, res, next) => {
  console.log({ err })

  if (err.name === 'SyntaxError') {
    return res.status(400).json({
      errorCode: 400,
      errorMessage: 'SyntaxError'
    })
  } else if (err.name === 'RangeError') {
    return res.status(400).json({
      errorCode: 400,
      errorMessage: 'RangeError'
    })
  } else if (err.errorCode === 'SequelizeDatabaseError') {
    console.log('entro', err)
    return res.status(500).json({
      errorCode: err.errorCode,
      errorMessage: err.message,
      errorSql: err.stack.replace(/"+/g, '')
    })
  } else if (err instanceof AppError) {
    const trace = err.stack ? err.stack.replace('  ', '').split('\n') : []
    return res.status(err.statusCode).json({
      errorCode: err.errorCode,
      errorMessage: err.message,
      errorTrace: trace
    })
  } else {
    return res
      .status(err.status)
      .json({ errorCode: 500, errorMessage: 'Error interno del servidor' })
  }
}

module.exports = { handleErrors }
