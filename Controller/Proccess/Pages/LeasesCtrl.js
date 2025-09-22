const { readLease, createLease, updateLease } = require('../../Databases/CRUD-Leases')
const clientPSQL = require('../../Databases/CRUD-Client')

const GetLeases = async (req, res = { status: 500, send: { auth: false } }) => {
  let leasesDB = []

  if (req?.path?.includes('lease')) {
    let id = JSON.parse(req?.params?.id)
    id = parseInt(id)

    const res = await readLease({ groupId: id })
    if (res) leasesDB = res
  }

  if (leasesDB) {
    res.status = 200
    res.send = leasesDB
  }

  return res
}

const PostLeases = async (req, res = { status: 500, send: { auth: false } }) => {
  const id = req?.body?.groupId

  const leasesDB = await readLease({ groupId: id })

  if (leasesDB) {
    res.status = 200
    res.send = 'el grupo ya tiene un arrendamiento'
  } else {
    const lease = await createLease(req?.body)

    if (lease) {
      const group = await clientPSQL.updateTypeGroup({ id }, { type: 'lease' })

      console.log(`grupo ${group[0]} actualizado con éxito`)

      res.status = 201
      res.send = lease
    }
  }

  return res
}

const PutLeases = async (req, res = { status: 500, send: { auth: false } }) => {
  const { body } = req
  const { groupId } = body

  const leasesDB = await readLease({ groupId })

  if (!leasesDB) {
    res.status = 400
    res.send = { result: false }
    return res
  }

  const lease = await updateLease({ groupId }, body)

  if (lease) {
    res.status = 201
    res.send = lease
  }

  return res
}

module.exports = {
  GetLeases,
  PostLeases,
  PutLeases
}
