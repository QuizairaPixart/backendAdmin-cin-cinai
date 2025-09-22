const { readEstablishments } = require('../../Databases/CRUD-Establishments')
const { putDevice } = require('../Actions/DevicesCtrl')

// get establishments
const GetEstablishments = async (req, res = { status: 500, send: { auth: false } }) => {
  const establishments = await readEstablishments()
  if (establishments) {
    res.status = 200
    res.send = establishments
  }
  return res
}

// get establishments
const PutEstablishment = async (req, res = { status: 500, send: { auth: false } }) => {
  const { establishmentId, deviceId } = req?.body

  const device = await putDevice({ id: deviceId }, { establishmentId })

  if (device[0] !== 0) {
    res.status = 200
    res.send = { result: true }
  }
  return res
}

module.exports = { GetEstablishments, PutEstablishment }
