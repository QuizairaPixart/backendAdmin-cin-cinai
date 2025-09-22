const { createRoles, readRoles, updateRoles, deleteRoles } = require('../../Databases/CRUD-Roles')

const GetRoles = async (req) => {
  const response = { status: 500, send: { auth: false } }

  const id = parseInt(req?.params?.id)
  const role = await readRoles(id)

  response.status = 200
  response.send = role
  return response
}
const PostRoles = async (req) => {
  const response = { status: 500, send: { auth: false } }

  const role = await createRoles(req.body)
  response.status = 200
  response.send = role
  return response
}
const PutRoles = async (req) => {
  const response = { status: 500, send: { auth: false } }
  const role = await updateRoles({ id: req.body.id }, req.body)
  if (role) {
    response.status = 201
    response.send = role
  }
  return response
}
const DeleteRoles = async (req) => {
  console.log({ params: req.params, query: req.query })
  const response = { status: 500, send: { auth: false } }
  const role = await deleteRoles({ id: req.params.id })
  if (role) {
    response.status = 200
    response.send = role
  }
  return response
}

module.exports = {
  GetRoles,
  PostRoles,
  PutRoles,
  DeleteRoles
}
