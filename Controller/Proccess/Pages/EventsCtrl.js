const { readEvents } = require('../../Databases/CRUD-Events')

const GetEvents = async (req, res = { status: 500, send: { auth: false } }) => {
  let events = []
  if (req.path.includes('softwareEvents')) {
    const res = await readEvents([11707, 11724], 'softwareEvents', 'device')
    if (res) events = res
  } else if (req.path.includes('devicesEvents')) {
    const res = await readEvents([11707, 11724], 'devicesEvents', 'device')
    if (res) events = res
  }

  if (events) {
    res.status = 200
    res.send = events
  }

  return res
}

module.exports = {
  GetEvents
}
