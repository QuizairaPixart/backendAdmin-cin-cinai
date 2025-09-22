const { Op } = require('sequelize')
const { blackList, historyBlack } = require('../../models/Sfwb/BlackListModel')
const { keywordsList } = require('../../models/Sfwb/KeyWordsModel')
const { sfwbPreferences } = require('../../models/Sfwb/PreferencesModel')
const { queryList, historyQuery } = require('../../models/Sfwb/QueryModel')
const { whiteList, historyWhite } = require('../../models/Sfwb/WhiteListModel')
const { SequelizeError } = require('../../middlewares/errors/AppError')

// white
const createWhite = async (data) => {
  try {
    let white
    if (data) {
      white = await whiteList.create(data)
      if (white instanceof whiteList) {
        console.log(`whitelist ${white.id} creado con exito!  `)
      }
    }
    return white
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readHistoryWhite = async (date) => {
  const fecha = new Date(date)

  return await historyWhite.findAll({
    where: {
      date: { [Op.gte]: fecha }
    }
  })
}

const readWhite = async (id, tables = null) => {
  try {
    let white
    if (id) {
      white = await whiteList.findOne({
        where: id,
        include: tables
      })
    } else {
      white = await whiteList.findAll()
    }
    return white
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateWhite = async (id, data, tables) => {
  try {
    await whiteList.update(data, { where: id })
    return true
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteWhite = async (id) => {
  try {
    const white = await whiteList.destroy({ where: id })
    if (white) return { result: true }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// black
const createBlack = async (data) => {
  try {
    let black
    if (data) {
      black = await blackList.create(data)
      if (black instanceof blackList) {
        console.log(`blacklist ${black.id} creado con exito!  `)
      }
    }
    return black
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readHistoryBlack = async (date) => {
  const fecha = new Date(date)

  return await historyBlack.findAll({
    where: {
      date: { [Op.gte]: fecha }
    }
  })
}

const readBlack = async (id, tables = null) => {
  try {
    let black
    if (id) {
      black = await blackList.findOne({
        where: id,
        include: tables
      })
    } else {
      black = await blackList.findAll({ include: tables })
    }
    return black
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateBlack = async (id, data, tables) => {
  try {
    await blackList.update(data, { where: id })
    return true
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteBlack = async (id) => {
  try {
    const black = await blackList.destroy({ where: id })
    if (black) {
      return { result: true }
    }
  } catch (e) {
    console.error('DB-black delete', e)
    return { error: true }
  }
}

// query
const createQuery = async (data) => {
  try {
    let query
    if (data) {
      query = await queryList.create(data)
      if (query instanceof queryList) {
        console.log(`querylist ${query.id} creado con exito!  `)
      }
    }
    return query
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readHistoryQuery = async (date) => {
  const fecha = new Date(date)
  return await historyQuery.findAll({
    where: {
      date: { [Op.gte]: fecha }
    }
  })
}

const readQuery = async (id, tables = null) => {
  try {
    let query
    if (id) {
      query = await queryList.findOne({
        where: id,
        include: tables
      })
    } else {
      query = await queryList.findAll({ include: tables })
    }
    return query
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateQuery = async (id, data, tables) => {
  try {
    const query = await queryList.update(data, { where: id, tables: null })
    if (query) return true
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteQuery = async (id) => {
  try {
    const query = await queryList.destroy({ where: id })
    if (query) {
      return { result: true }
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// keywords
const createKeywords = async (data) => {
  try {
    let Keywords
    if (data) {
      Keywords = await keywordsList.create(data)
      if (Keywords instanceof keywordsList) {
        console.log(`Keywordslist ${Keywords.id} creado con exito!  `)
      }
    }
    return Keywords
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readKeywords = async (id) => {
  try {
    let Keywords
    if (id) {
      Keywords = await keywordsList.findOne({ where: id })
    } else {
      Keywords = await keywordsList.findAll()
    }
    return Keywords
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updateKeyWords = async (id, data) => {
  try {
    const keyword = await keywordsList.update(data, { where: id })
    if (keyword) return true
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const deleteKeyWord = async (id) => {
  try {
    const keyword = keywordsList.destroy({ where: id })
    if (keyword) {
      return { result: true }
    }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read preference
const CreateSafewebPreference = async (data) => {
  try {
    let preference
    if (data) {
      preference = await sfwbPreferences.create(data)
      if (preference instanceof sfwbPreferences) {
        console.log(`preferenceSafeweb ${preference.id} creado con exito!  `)
      }
    }
    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const readPreference = async (id) => {
  try {
    let preference
    if (id) {
      preference = await sfwbPreferences.findOne({
        where: id
      })
    } else {
      preference = await sfwbPreferences.findAll()
    }
    return preference
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

const updatePreference = async (id, data) => {
  try {
    let preference = await readPreference(id)
    if (preference) {
      preference = Object.assign(preference, data)
      preference.save()
    }
    return { state: true, preference }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

module.exports = {
  createWhite,
  readWhite,
  updateWhite,
  deleteWhite,
  createBlack,
  readBlack,
  updateBlack,
  deleteBlack,
  createQuery,
  readQuery,
  updateQuery,
  deleteQuery,
  createKeywords,
  readKeywords,
  updateKeyWords,
  deleteKeyWord,
  CreateSafewebPreference,
  readPreference,
  updatePreference,
  readHistoryBlack,
  readHistoryWhite,
  readHistoryQuery
}
