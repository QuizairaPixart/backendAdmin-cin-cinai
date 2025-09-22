const { AppError } = require('../../middlewares/errors/AppError')
const {
  getBlackList,
  postBlackList,
  putBlackList,
  deleteBlackList
} = require('../Proccess/SafeWeb/BlackCtrl')
const { getHome } = require('../Proccess/SafeWeb/HomeCtrl')
const {
  getKeyWords,
  postKeyWords,
  putKeyWords,
  deleteKeyWords
} = require('../Proccess/SafeWeb/KeywordCtrl')
const {
  getSfwbPreferences,
  putSfwbPreferences
} = require('../Proccess/SafeWeb/PreferencesCtrl')
const {
  getQueryList,
  postQueryList,
  putQueryList,
  deleteQueryList
} = require('../Proccess/SafeWeb/QueryCtrl')
const {
  getWhiteList,
  postWhiteList,
  putWhiteList,
  deleteWhiteList
} = require('../Proccess/SafeWeb/WhiteCtrl')

const SfwbHomeBlackList = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  try {
    console.log('http sfwbhome-blackList')

    const date = req?.params?.date
    if (!date) return res

    const response = await getHome(date, 'black')

    res.status(response.status).send(response.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_HOME_BLACK_LIST',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbHomeWhiteList = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  try {
    console.log('http sfwbhome-whiteList')

    const date = req?.params?.date
    if (!date) return res

    const response = await getHome(date, 'white')

    res.status(response.status).send(response.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_HOME_WHITE_LIST',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbHomeQueryList = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  try {
    console.log('http sfwbhome-queryList')

    const date = req?.params?.date
    if (!date) return res

    const response = await getHome(date, 'query')

    res.status(response.status).send(response.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_HOME_QUERY_LIST',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbHomeSearch = async (
  req,
  res = { status: 500, send: { auth: false } }
) => {
  try {
    console.log('http sfwbhome-search')

    const chart = req?.params?.chart
    if (!chart) return res

    const response = await getHome(null, chart)

    res.status(response.status).send(response.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_HOME_SEARCH',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbBlack = async (req, res, next) => {
  try {
    console.log('htttp sfwbblack')
    let result = { status: 500, send: { auth: false } }
    // traer lista negra con assoc. de equipos
    if (req.method === 'GET') result = await getBlackList(null)
    if (req.method === 'POST') result = await postBlackList(req)
    if (req.method === 'PUT') result = await putBlackList(req)
    if (req.method === 'DELETE') result = await deleteBlackList(req.params)

    if (result.status === 201) next()
    else res.status(result.status).send(result.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_BLACK',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbWhite = async (req, res, next) => {
  try {
    console.log('htttp sfwbwhite')
    let result = { status: 500, send: { auth: false } }
    // traer lista blanca con su assoc. de equipos
    if (req.method === 'GET') result = await getWhiteList(null)
    if (req.method === 'POST') result = await postWhiteList(req)
    if (req.method === 'PUT') result = await putWhiteList(req)
    if (req.method === 'DELETE') result = await deleteWhiteList(req.params)

    if (result.status === 201) next()
    else res.status(result.status).send(result.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_WHITE',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbQuery = async (req, res, next) => {
  try {
    console.log('htttp sfwbquery')
    let result = { status: 500, send: { auth: false } }
    // traer query con su assoc. de equipos aca es solo get
    if (req.method === 'GET') result = await getQueryList(null)
    if (req.method === 'POST') result = await postQueryList(req.body)
    if (req.method === 'PUT') result = await putQueryList(req.body)
    if (req.method === 'DELETE') result = await deleteQueryList(req.params)

    res.status(result.status).send(result.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_QUERY_LIST',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbKeyWords = async (req, res, next) => {
  try {
    console.log('http sfwbkeywords')
    let result = { status: 500, send: { auth: false } }
    // trae las palabras claves
    if (req.method === 'GET') result = await getKeyWords(null)
    if (req.method === 'POST') result = await postKeyWords(req.body)
    if (req.method === 'PUT') result = await putKeyWords(req.body)
    if (req.method === 'DELETE') result = await deleteKeyWords(req.params)

    if (result.status === 201) next()
    else res.status(result.status).send(result.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_KEYWORDS',
      e.message,
      500,
      e.stack
    )
  }
}

const SfwbPreferences = async (req, res, next) => {
  try {
    console.log('http sfwbpreferences')
    let result = { status: 500, send: { auth: false } }
    // traer las preferencias
    if (req.method === 'PUT') result = await putSfwbPreferences(req)
    else result = await getSfwbPreferences(req)

    if (result.status === 201 && result.flag) next()
    else res.status(result.status).send(result.send)
  } catch (e) {
    throw new AppError(
      e.errorCode ?? 'ERR_SFWB_PREFERENCES',
      e.message,
      500,
      e.stack
    )
  }
}

module.exports = {
  SfwbHomeBlackList,
  SfwbHomeWhiteList,
  SfwbHomeQueryList,
  SfwbHomeSearch,
  SfwbBlack,
  SfwbWhite,
  SfwbQuery,
  SfwbKeyWords,
  SfwbPreferences
}
