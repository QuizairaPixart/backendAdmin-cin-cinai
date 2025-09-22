const { clientRegister } = require('../../../helpers/UserValidations')

const putLogin = async (req, res) => {
  const response = { status: 200, send: { auth: false } }
  const user = req.body.user
  const pass = req.body.password
  const result = await clientRegister(user, pass)
  if (result.auth === true) {
    response.status = 200
    response.send = result
  }
  return response
}

module.exports = { putLogin }
