const { SequelizeError } = require('../../middlewares/errors/AppError')
const { actions, thief } = require('../../models/Psql/ActionsModel')
const { completed } = require('../../models/Psql/CompletedModel')

// POSTGRES//------------------

// ACTIONS //-------------
// create action
const createAction = async (data) => {
  try {
    let action = null
    action = await actions.create(data)
    console.log(`accion ${action.id} creado con exito`)

    return action
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read action
const readAction = async (id, tables = null) => {
  try {
    let actionsDB
    if (id != null) {
      actionsDB = await actions.findAll({ where: id, include: tables })
    } else {
      actionsDB = await actions.findAll({ include: [tables] })
    }
    return actionsDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}
const updateOrCreateAction = async (data) => {
  try {
    let action, modifydevice, disablePreviousAction
    let create = true
    // console.log('entro en data', { data })

    // ? genero la consulta sql (traigo acciones de los equipos con sus completed ordenadas por id)
    const actionsComplete = await actions.findAll(
      {
        where: { action: data.action },
        order: [['id', 'ASC']],
        include: [
          { association: 'devices', where: { id: data.devicesId }, required: true },
          { association: 'completed', required: false }]
      }
    )
    // ? filtro que las acciones no tengan un completed

    const actionsToComplete = actionsComplete.length > 0 ? actionsComplete.filter((actioncomplete) => actioncomplete.completed === null) : []
    // ? genero en caso que sea false el lock y que tengamos un disable en true ponerlo en false
    if (data.action === 'lock') {
      // console.log('entro action', { data, actionsComplete })
      const disablePreviousActionDB = (await actions.findAll(
        {
          limit: 1,
          where: { action: 'disable' },
          order: [['id', 'DESC']],
          include: [{ association: 'devices', where: { id: data.devicesId }, required: true }, { association: 'completed', required: false }]
        }
      ))
      const disablePreviousActionToComplete = disablePreviousActionDB.length > 0 ? disablePreviousActionDB.filter((disablePrevious) => disablePrevious.completed === null) : []
      disablePreviousAction = disablePreviousActionToComplete.length > 0 ? disablePreviousActionToComplete.findLast(({ action }) => action === 'disable') : null
      if (disablePreviousAction) {
        disablePreviousAction.data = {
          statusLock: data?.data?.statusLock,
          preferences: {
            touch: data?.data?.preferences?.touch,
            screen: data?.data?.preferences?.screen
          }
        }
        // console.log({ disablePreviousAction })
        await disablePreviousAction.save()
      }
    }

    // ? busco la ultima accion (que no tenga complete por el filtro anterior) que sea igual a la accion que tengo (disabled,lock,tracking)

    const actionToChange = actionsToComplete.length > 0 ? actionsToComplete.findLast(({ action }) => action === data.action) : null

    // console.log(actionToChange)
    // ? si lo encuentro lo updateo si no lo creo y puse un flag para verificar

    if (actionToChange) {
      // console.log(actionToChange, '=> aquí')
      const orderId = actionToChange?.data?.order_id
      actionToChange.data = data.data
      if (orderId &&
       (actionToChange.data.statusLock === false || actionToChange.data.statusTracking === false)
      ) { actionToChange.data.order_id = orderId }
      // console.log({ data, actionToChangeData: actionToChange.data })
      await actionToChange.save()
      create = false
      action = actionToChange
    } else action = await createAction(data)
    return { action, create, modifydevice, disablePreviousAction }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}
// update action
const updateAction = async (id, data) => {
  try {
    let flag = false
    if (Array.isArray(data)) {
      for (const dat of data) {
        const actionsDB = await actions.update(dat, {
          where: { id: dat.id }
        })
        if (actionsDB) flag = true
      }
    } else {
      const actionsDB = await actions.update(data, { where: { id } })
      if (actionsDB) flag = true
    }
    return flag
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete action
const deleteAction = async (id) => {
  try {
    const actionDB = await actions.findOne({ where: id })
    if (actionDB !== null) {
      return await actionDB.destroy()
    } else {
      return { Auth: false }
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

// COMPLETED//----------
// create completed
const createCompleted = async (data) => {
  try {
    let completeDB = null
    completeDB = await completed.create(data)
    console.log(`complete ${completeDB.id} creado con exito`)

    return completeDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read action complete of device
const deviceActionCompleted = async (deviceId = null) => {
  try {
    let actionComplete
    if (deviceId) {
      actionComplete = await actions.findOne({
        where: { action: 'command' },
        include: [{
          model: completed,
          where: { deviceId },
          required: true
        }],
        order: [['date', 'DESC']]
      })
    }
    return actionComplete
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read completed
const readCompleted = async (id) => {
  try {
    let completeDB
    if (id) {
      completeDB = await completed.findAll({ where: id })
    } else {
      completeDB = await completed.findAll()
    }
    return completeDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update completed
const updateCompleted = async (id, data) => {
  try {
    const completeDB = await completed.update(data, { where: { id } })
    if (completeDB) return true
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// delete completed
const deleteCompleted = async (id) => {
  try {
    const complete = await completed.destroy({ where: id })
    if (complete) return { result: true }
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// THIEF//--------------
// create thief
const createThief = async (data) => {
  try {
    let Thief = null
    Thief = await thief.create(data)
    console.log(`actionthief ${Thief.id} creado con exito`)

    return Thief
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// read thief
const readThief = async (id) => {
  try {
    let ThiefDB
    if (id) {
      ThiefDB = await thief.findOne({ where: id, order: [['id', 'DESC']] })
    } else {
      ThiefDB = await thief.findAll()
    }
    return ThiefDB
  } catch (e) {
    throw new SequelizeError(
      e.name,
      e.original ? e.original.routine + ' => ' + e.message : e.message,
      e.statusCode || 500,
      e.sql
    )
  }
}

// update thief
const updateThief = async (id, data) => {
  try {
    const ThiefDB = await readThief(id)
    if (ThiefDB) {
      const array = ThiefDB.images
      data.images = array.concat(data.images)
      await thief.update(data, { where: { id } })
    } else {
      data.image = JSON.stringify(data.image)
      createThief(data)
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

// delete thief
const deleteThief = async (id) => {
  try {
    const thiefDelete = await thief.destroy({ where: id })
    if (thiefDelete) return { result: true }
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
  createAction,
  readAction,
  updateAction,
  deleteAction,
  updateOrCreateAction,
  deviceActionCompleted,
  createCompleted,
  readCompleted,
  updateCompleted,
  deleteCompleted,
  createThief,
  readThief,
  updateThief,
  deleteThief
}
