const {
  createWhite,
  readWhite,
  updateWhite,
  deleteWhite,
  readHistoryWhite
} = require('../../Databases/CRUD-SafeWeb')

const getWhiteList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const white = await readWhite(null)
  response.status = 200
  response.send = white
  return response
}

const postWhiteList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const white = await createWhite(req?.body)

  if (white) {
    response.status = 201
    response.send = white
    req.locals = { white: white?.toJSON() }
  }
  return response
}

const putWhiteList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const { body } = req
  const id = +body?.id
  const white = await updateWhite({ id }, body)

  if (white) {
    response.status = 201
    response.send = white
    req.locals = { white: white?.toJSON() }
  }
  return response
}

const deleteWhiteList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const white = await deleteWhite({ id: req.id })
  if (white) {
    response.status = 200
    response.send = white
  }
  return response
}
const getHistoryWhite = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const white = await readHistoryWhite()
  if (white) {
    response.status = 200
    response.send = white
  }
  return response
}
module.exports = {
  getWhiteList,
  postWhiteList,
  putWhiteList,
  deleteWhiteList,
  getHistoryWhite
}
