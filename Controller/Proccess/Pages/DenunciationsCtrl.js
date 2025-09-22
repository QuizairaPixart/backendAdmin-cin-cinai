const { getDenunciations, postDenunciation, getDenunciation, putDenunciation } = require('../Actions/DenunciationsCtrl')

const GetDenunciations = async (req, res = { status: 500, send: { auth: false } }) => {
  let denunciationsDB
  if (req?.path?.includes('denunciation')) {
    const id = JSON.parse(req?.params?.id)

    denunciationsDB = await getDenunciation({ id })
  } else {
    const { statusFilter } = JSON.parse(req?.params?.statusFilter)

    denunciationsDB = statusFilter === 'all' ? await getDenunciations(null) : await getDenunciations({ denunciationStatus: statusFilter })
  }

  if (denunciationsDB) {
    res.status = 200
    res.send = denunciationsDB
  }

  return res
}

const PostDenunciations = async (req, res = { status: 500, send: { auth: false } }) => {
  const denunciation = await postDenunciation(req?.body)

  if (denunciation.result === false) {
    res.status = 200
    res.send = 'el número de denuncia ya se encuentra registrado'
  } else {
    res.status = 201
    res.send = denunciation
  }
  return res
}

const PutDenunciations = async (req, res = { status: 500, send: { auth: false } }) => {
  const { body } = req
  const { id } = body
  delete body.id

  const existingDenunciation = await getDenunciation({ id })

  if (!existingDenunciation) {
    res.status = 400
    res.send = { result: false }
    return res
  }

  const denunciation = await putDenunciation({ id }, body)

  if (denunciation) {
    res.status = 200
    res.send = denunciation
  }

  return res
}

// const DeleteCommand = async (req, res) => {
//   const response = { status: 500, send: { auth: false } }
//   const id = +req?.params?.id
//   const command = await deleteCommands({ id })
//   if (command) {
//     response.status = 201
//     response.send = command
//   }
//   return response
// }

module.exports = {
  GetDenunciations,
  PostDenunciations,
  PutDenunciations
}
