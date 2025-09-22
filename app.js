const { io } = require('./server/server')
const { OriginIsAllowed, receiveSokioMessage } = require('./Controller/WsController/WsController')
const { onReceiveRedis } = require('./Controller/WsController/RedisController')
const { sendSocketMessage, closeSocketConnection } = require('./Controller/WsController/WsController')

io.use(async (socket, next) => {
  // console.log('headers ==>', socket.request.headers.authorization)
  if (socket.handshake.auth.token && await OriginIsAllowed(socket)) next()
  else next(new Error('{auht:false}'))
})

io.on('connection', (socket) => {
  //! conexion websocket del lado del front
  receiveSokioMessage(socket)
  closeSocketConnection(socket)
})

onReceiveRedis(io, sendSocketMessage)
