const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args))

const ipServer = async (ip) => {
  try {
    const request = await fetch('http://checkip.amazonaws.com', { method: 'GET' })
    ip = await request.text()
    return await ip
  } catch (error) {
    return 'No Disponible'
  }
}
const ipWan = ipServer()

const getWan = async (ip) => {
  if (
    typeof ip === 'string' &&
    (ip.includes('192.168') || ip.includes('127.0.0') || ip.includes('::1'))
  ) {
    ip = await ipWan
  }
  if (!ip) {
    return 'No Disponible'
  }
  // sanitizado de ip wan
  try {
    const expresion = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g
    const formatIp = ip?.match(expresion)
    if (!formatIp) {
      return 'No Disponible'
    }

    return formatIp[0]
  } catch (e) {
    console.log('error ipWan : ', e)
  }
}

module.exports = { getWan }
