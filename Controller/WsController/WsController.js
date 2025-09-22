const ClientPSQL = require('../../Controller/Databases/CRUD-Client')
const jwt = require('jsonwebtoken')
const { sendRedis, subscribeRedis, unSubscribeRedis } = require('./RedisController')
const { CreateAction } = require('../Proccess/Actions/ActionsCtrl')
const { SendActions } = require('../../middlewares/WsSender')

let connectionSockets = []

// ? ✅ Permite o deniega la conexion
const OriginIsAllowed = async (socket) => {
  try {
    const headers = socket?.handshake?.auth
    const result = { complete: false }

    if (headers) {
      const userId = headers.userId ? headers.userId : null
      const token = headers.token ? headers.token : null

      console.log(userId, 'linea 19')
      const userDB = await ClientPSQL.readUser({ id: userId })
      if (userDB) {
        jwt.verify(token, userDB.session_id, (err, verify) => {
          if (err) {
            console.log('client', err)
            return (result.complete = false)
          } else {
            return (result.complete = true)
          }
        })
      } else if (userId === -1) {
        return (result.complete = true)
      }
    }
    return result.complete
  } catch (error) {
    console.log({ error })
    return false
  }
}
const closeSocketConnection = async (socket) => {
  socket.conn.on('close', async (reason, code) => {
    // * el cierre de conexion del front
    const identity = connectionSockets.find((conn) => conn.id === socket.id)?.identity
    connectionSockets = connectionSockets.filter((conn) => conn.id !== socket.id)
    unSubscribeRedis(`client:${identity}`)
    await sendRedis(`backend:${identity}`, { connection: { identity, state: 'close' } })
    await sendRedis(`backend:${identity}`, { device: false, identity })
  })
}
const receiveSokioMessage = async (socket) => {
  // *estado del equipo a conectar
  socket.on('openState', async (mess) => {
    // recibe orden de conexion del front
    const identity = mess.identity
    //* tenemos que armar logica de conectar el id
    connectionSockets.push({ identity, id: socket.id })
    // console.log(mess)
    //* enviar mensaje a api-client por canal 1 para revisar que el equipo se encuentra disponible
    await subscribeRedis(`client:${identity}`)
    await sendRedis('channel-ws-1', mess)
  })

  socket.on('connectDevice', async (mess) => {
    await sendRedis(`backend:${mess?.identity}`, { connection: mess })
  })

  socket.on('actions', async (mess) => {
    // recibe las acciones del front
    // console.log('en mess al principio=>', mess)
    const actions = mess?.actions
    const result = await CreateAction({ actions })
    const sendAction = await SendActions({ locals: { id: result.actions }, noSend: true })
    if (actions[0]?.path) sendAction[0].path = normalizePath(actions[0]?.path)
    await sendRedis(/* `backend:${mess?.identity}` */ 'channel-ws-1', { connection: { actions: sendAction } })
  })
}

const sendSokioMessage = async (socket, { arg, message }) => {
  // envia los mensajes hacia el front
  socket.send(arg, message)
}

const sendSocketMessage = async (mess, identity, io, arg) => {
  // console.log('sendSocketMessage =>', mess, identity, arg)
  const conn = connectionSockets.find((conn) => conn.identity === identity)
  if (conn?.id) { io.to(conn.id).emit(arg, mess) }
}

const normalizePath = (path) => {
  if (!path) return path
  path = path.replace(/([^\\])\\(?![\\])/g, '$1\\\\')
  if (path.endsWith('\\')) path = path.slice(0, -1)
  return path
}

module.exports = { OriginIsAllowed, receiveSokioMessage, sendSokioMessage, sendSocketMessage, closeSocketConnection }
