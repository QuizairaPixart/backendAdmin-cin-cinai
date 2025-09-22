const {
  createBlack,
  readBlack,
  updateBlack,
  deleteBlack,
  readHistoryBlack
} = require('../../Databases/CRUD-SafeWeb')

const getBlackList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }

  const black = await readBlack(null)
  response.status = 200
  response.send = black
  return response
}
const postBlackList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const black = await createBlack(req?.body)

  if (black) {
    response.status = 201
    response.send = black
    req.locals = { black: black?.toJSON() }
  }
  return response
}

const putBlackList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const { body } = req
  const id = +body?.id
  const black = await updateBlack({ id }, body)

  if (black) {
    response.status = 201
    response.send = black
    req.locals = { black: black?.toJSON() }
  }
  return response
}

const deleteBlackList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const black = await deleteBlack({ id: req.id })
  if (black) {
    response.status = 200
    response.send = black
  }
  return response
}
const getHistoryBlack = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const black = await readHistoryBlack()
  if (black) {
    response.status = 200
    response.send = black
  }
  return response
}
module.exports = {
  getBlackList,
  postBlackList,
  putBlackList,
  deleteBlackList,
  getHistoryBlack
}
