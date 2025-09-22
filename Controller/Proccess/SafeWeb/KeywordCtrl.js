const {
  createKeywords,
  readKeywords,
  updateKeyWords,
  deleteKeyWord
} = require('../../Databases/CRUD-SafeWeb')

const getKeyWords = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const keyWords = await readKeywords(null)
  response.status = 200
  response.send = keyWords
  return response
}

const postKeyWords = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  req.create = new Date()
  const keyWords = await createKeywords(req)
  if (keyWords) {
    response.status = 201
    response.send = keyWords
  }
  return response
}

const putKeyWords = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const keyWords = await updateKeyWords({ id: req.id }, req)
  if (keyWords) {
    response.status = 201
    response.send = keyWords
  }
  return response
}

const deleteKeyWords = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const keyWords = await deleteKeyWord({ id: req.id })
  if (keyWords) {
    // (response.status = 201), (response.send = keyWords);
    response.status = 201
    response.send = keyWords
  }
  return response
}
module.exports = { getKeyWords, postKeyWords, putKeyWords, deleteKeyWords }
