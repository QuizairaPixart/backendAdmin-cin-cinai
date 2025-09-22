const fs = require('fs')
const { App } = require('../../../config')

const receiveFiles = async (req, res) => {
  let response = { status: 500, send: { result: false } }
  const file = req.file
  const { path } = req.params

  if (file) {
    let folder
    let newPath = ''

    if (path === 'wallpaper') folder = `${App.dirwallpaper}`
    else if (path === 'install') folder = `${App.dirinstall}`
    else if (path === 'denunciations') folder = `${App.dirdenunciations}`
    else folder = `${App.dircontent}`

    newPath = path === 'denunciations' ? `${folder}/${file.originalname}` : `${folder}/${file.filename}`

    fs.renameSync(
      `${App.dirstorage}/${file.filename}`,
      `${App.dirstorage}${newPath}`
    )

    const getUrl = (req) =>
      `${App.httpHostBackendFile}:${App.httpPortBackendFile}/download`

    response = {
      status: 200,
      send: { url: `${getUrl(req)}${newPath.replace('.', '/')}` }
      // ? URL: download/endpoint-dinamico/nombre-del-archivo/extension
    }
  }
  return response
}

module.exports = { receiveFiles }
