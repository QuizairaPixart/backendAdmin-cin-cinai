const { App } = require('../config')
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, App.dirstorage)
  },
  filename: (req, file, cb) => {
    const extName = path.extname(file.originalname)
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extName}`

    cb(null, uniqueSuffix)
  }
})

const upload = multer({ storage }).single('files')

module.exports = { upload }
