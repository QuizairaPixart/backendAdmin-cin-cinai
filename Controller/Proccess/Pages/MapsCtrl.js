const {
  getLocationsDevices,
  getMapsDevice
} = require('../Actions/LocationsCtrl')
const getHistoryMaps = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const devices = await getLocationsDevices(
    { id: req.params.id },
    { association: 'locations' }
  )

  const send = {
    map: await getMapsDevice(devices) // get maps
  }
  response.status = 200
  response.send = send
  return response
}

module.exports = { getHistoryMaps }
