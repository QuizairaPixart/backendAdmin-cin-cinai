const fs = require('fs')
const { App } = require('../config')

// ? Crea los directorios si no existen, antes de seguir con el proximo controlador
const publicDir = async (req, res, next) => {
  const baseDir = App.dirstorage
  const folders = [
    App.dircontent,
    App.dirinstall,
    App.dirphotos,
    App.dirwallpaper,
    App.dirdenunciations,
    App.dirpdf
  ]

  for (const folder of folders) {
    const dir = `${baseDir}${folder}`
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true })
      } catch (err) {
        console.error('Error al crear carpeta', err)
        throw err
      }
    }
  }
  next()
}

// Crea los directorios al interactuar con WSS
const publicDirWS = async () => {
  const baseDir = App.dirstorage
  const folders = [
    App.dircontent,
    App.dirinstall,
    App.dirphotos,
    App.dirwallpaper
  ]

  for (const folder of folders) {
    const dir = `${baseDir}${folder}`
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true })
      } catch (err) {
        console.error('Error al crear carpeta', err)
        throw err
      }
    }
  }
}

module.exports = { publicDir, publicDirWS }
