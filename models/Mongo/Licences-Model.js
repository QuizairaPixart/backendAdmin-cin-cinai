const mongoose = require('mongoose')

const licencesSchema = new mongoose.Schema({ identity: String, licence: String })
const licenceModel = mongoose.model('Licences', licencesSchema)

module.exports = { licenceModel }
