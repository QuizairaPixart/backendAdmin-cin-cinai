const { readApp } = require('../../Databases/CRUD-Applications')
const {
  getGroups,
  postGroups,
  putGroups,
  deleteGroups
} = require('../Actions/GroupsCtrl')

// get groups
const GetGroups = async (req, res) => {
  const response = { status: 500, send: { auth: false } }

  const groups = await getGroups(null, req)
  if (groups) {
    response.status = 200
    response.send = groups
  }
  return response
}

const GetGroup = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const group = await getGroups({ id: parseInt(req.params.id) }, req)
  if (group) {
    response.status = 200
    response.send = group
  }
  return response
}

const GetGroupApplications = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const apps = await readApp(null)
  if (apps) {
    response.status = 200
    response.send = { apps }
  }
  return response
}

// post groups
const PostGroups = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const newGroup = await postGroups(req?.body)

  if (newGroup.result === true) {
    response.status = 201
    response.send = { result: newGroup.result }
    req.locals = { groups: newGroup?.groups?.toJSON() }
  } else if (newGroup.result === false) {
    response.status = 200
    response.send = { result: newGroup.result }
  }

  return response
}

// put groups
const PutGroups = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const { body } = req
  const id = +body?.id

  const groups = await putGroups({ id }, body)

  if (groups) {
    response.status = 201
    response.send = { result: groups.result }
    req.locals = { groups: groups.groupWithDevices?.toJSON() }
  }

  return response
}

// delete groups
const DeleteGroups = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = parseInt(req.params.id)

  const groups = await deleteGroups({ id: data })
  if (groups) {
    response.status = 201
    response.send = groups
  }
  return response
}
module.exports = { GetGroups, GetGroup, PostGroups, PutGroups, DeleteGroups, GetGroupApplications }
