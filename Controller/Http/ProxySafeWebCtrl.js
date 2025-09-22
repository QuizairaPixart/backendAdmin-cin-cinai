const { throwAppError } = require('../../middlewares/errors/AppError')
const { BlackList, WhiteList, KeyWords, Preferences } = require('../Proccess/Actions/ProxySafeWebAPICtrl')
const { readServerPreference } = require('../Databases/CRUD-Preferences')

const PostProxySafeWeb = async (req, res) => {
  try {
    let response = { status: 500, send: { empty: true } }
    let proxyUrl = await readServerPreference(1)

    if (proxyUrl?.Proxy_SafeWeb_url && proxyUrl?.Proxy_SafeWeb_url[1] !== '') {
      proxyUrl = proxyUrl?.Proxy_SafeWeb_url[1]
      //   console.log(req.query, req.body, proxyUrl)

      if (req.query.endpoint === 'blackList') response = await BlackList(req.body, proxyUrl)
      if (req.query.endpoint === 'whiteList')response = await WhiteList(req.body, proxyUrl)
      if (req.query.endpoint === 'keyWords')response = await KeyWords(req.body, proxyUrl)
      if (req.query.endpoint === 'preferences') response = await Preferences(req.body, proxyUrl)
    }
    if (response.send?.error) response.status = 403
    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_POST_PROXY_SAFEWEB')
  }
}

module.exports = { PostProxySafeWeb }
