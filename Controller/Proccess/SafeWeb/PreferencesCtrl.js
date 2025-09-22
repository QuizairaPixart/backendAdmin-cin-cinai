const {
  readPreference,
  updatePreference
} = require('../../Databases/CRUD-SafeWeb')

const getSfwbPreferences = async (req, res) => {
  const { id } = req.params
  const response = { status: 500, send: { auth: false } }
  const preferences = await readPreference({ id })
  if (preferences) {
    response.status = 200
    response.send = preferences
  }
  return response
}

const putSfwbPreferences = async (req, res) => {
  let flag = false
  const response = { status: 500, send: { auth: false } }
  const { id } = req?.body
  const { responseDefault } = await readPreference({ id })

  if (req.responseDefault !== responseDefault) flag = true
  const preferences = await updatePreference({ id }, req.body)

  if (preferences) {
    response.status = 201
    response.send = { result: preferences?.state }
    response.flag = flag
    req.locals = { sfwbPreference: preferences?.preference?.toJSON() }
  }

  return response
}

module.exports = { getSfwbPreferences, putSfwbPreferences }
