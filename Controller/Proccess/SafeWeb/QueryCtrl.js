const {
  createQuery,
  readQuery,
  updateQuery,
  deleteQuery,
  readHistoryQuery
} = require('../../Databases/CRUD-SafeWeb')

const getQueryList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }

  const query = await readQuery(null)
  response.status = 200
  response.send = query
  return response
}
const postQueryList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const query = await createQuery(req)
  if (query) {
    response.status = 201
    response.send = query
  }
  return response
}

const putQueryList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const query = await updateQuery({ id: req.id }, req)
  if (query) {
    response.status = 201
    response.send = query
  }
  return response
}

const deleteQueryList = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const query = await deleteQuery({ id: req.id })
  if (query) {
    response.status = 200
    response.send = query
  }
  return response
}
const getHistoryQuery = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const query = await readHistoryQuery()
  if (query) {
    response.status = 200
    response.send = query
  }
  return response
}
module.exports = {
  getQueryList,
  postQueryList,
  putQueryList,
  deleteQueryList,
  getHistoryQuery
}
