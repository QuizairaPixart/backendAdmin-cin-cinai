const { getImages } = require('../Actions/ThiefImage')

const thiefImage = async (req, res) => {
  let response = { status: 500, send: { auth: false } }
  const images = await getImages(+req.params.id)

  if (images) response = { status: images.status, send: images.send }

  return response
}

module.exports = { thiefImage }
