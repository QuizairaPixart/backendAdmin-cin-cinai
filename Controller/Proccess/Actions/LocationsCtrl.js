const { readMap } = require('../../Databases/CRUD-Locations')

const getMapsAll = async () => {
  const locations = await readMap()
  // console.log(locations)
  const map = locations.map((location) => {
    return {
      device: { id: location.deviceId },
      coordinates: [location.lat, location.lon, location.acc, location.place]
    }
  })
  return map
}

const getMapsDevice = async (device) => {
  // const response = {}
  const map = []
  for (const location of device.locations) {
    if (location.type !== 'IP') {
      let coordinate = []

      if (location) {
        coordinate = [
          location.lat ? location.lat : null,
          location.lon ? location.lon : null,
          location.acc ? location.acc : null,
          location.place ? location.place : null
        ]
      } else {
        coordinate = [null, null, null, null]
      }
      map.push({ coordinates: coordinate })
    }
  }
  return {
    device: {
      name: device.name,
      identity: device.identity
    },
    map
  }
}

module.exports = {
  getMapsAll,
  getMapsDevice
}
