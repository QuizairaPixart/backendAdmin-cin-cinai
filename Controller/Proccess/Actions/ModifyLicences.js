const { serverPreferences } = require('../../../models/Psql/PreferenceModel')

const ModyfyLicenses = async (req) => {
  // console.log(req)
  const newLicenses = req.body.newLicenses
  const pref = await serverPreferences.findByPk(1)
  pref.max_licences = parseInt(newLicenses)
  pref.save()
  return true
}
module.exports = {
  ModyfyLicenses
}
