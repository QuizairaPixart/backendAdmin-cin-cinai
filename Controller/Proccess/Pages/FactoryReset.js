const { Restore } = require('../../../helpers/RestoreDB')

const factoryReset = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = req.body
  // console.log(data, 'linea 6')
  const restore = await Restore(data)
  if (restore.send === true) {
    response.status = 200
    response.send = restore
  } else if (restore.send === false) {
    response.status = 403
    response.send = restore
  }
  return response
}

module.exports = { factoryReset }
