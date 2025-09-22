const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers
} = require('../Actions/UsersCtrl')

// get users
const GetUsers = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const users = await getUsers(null)
  if (users) {
    response.status = 200
    response.send = users
  }
  return response
}

// get groups
const PostUsers = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = req.body
  const users = await postUsers(data)
  if (users.result === false || users.result === null) {
    response.status = 400
    response.send = users
  } else {
    response.status = 201
    response.send = users
  }
  return response
}
// get groups
const PutUsers = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = req.body
  const users = await putUsers({ id: data.id }, data)
  if (users) {
    response.status = 200
    response.send = users
  }
  return response
}
// get groups
const DeleteUsers = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = parseInt(req.params.id)

  const users = await deleteUsers({ id: data })
  if (users) {
    response.status = 200
    response.send = users
  }
  return response
}

module.exports = { GetUsers, PostUsers, PutUsers, DeleteUsers }
