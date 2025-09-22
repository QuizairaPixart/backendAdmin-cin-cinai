const { psql, sfwb, SyncDB, redisClientSub, connectMongo } = require('../db/db')
require('dotenv').config()
const { App } = require('../config')
const process = require('process')
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const https = require('https')
const http = require('http')
const { Server } = require('socket.io')

const compression = require('compression')
// const helmet = require('helmet')
const { handleErrors } = require('../middlewares/errors/handleErrors')
const { clientValidate } = require('../helpers/UserValidations')
const { findAndCreateDefaultUser } = require('../helpers/findAndCreateDefaultUser')
// const cluster = require('node:cluster')
// const availableParallelism = require('node:os')
// const numCPUs = availableParallelism.cpus().length
// inicializamos server
const app = express()
app.use(compression())
app.use(express.urlencoded({ extended: false }))
app.use(cors()) // cors es para controlar quien se conecta a socket

app.use(express.json({ limit: '500mb' }))
// app.use(helmet()); // mejora la seguridad de los request mediante headers

// manejo de errores inesperados
process.on('uncaughtException', (error) => {
  console.log('error inesperado: ', error)
})
let Httpserver, Wsserver
// ssl
if (App.ssl.http.key && App.ssl.http.cert) {
  const key = fs.readFileSync(App.ssl.http.key)
  const cert = fs.readFileSync(App.ssl.http.cert)
  const httpOptions = {
    key,
    cert
  }

  Httpserver = https.createServer(httpOptions, app)
} else {
  Httpserver = http.createServer(app)
}

if (App.ssl.ws.key && App.ssl.ws.cert) {
  const key = fs.readFileSync(App.ssl.ws.key)
  const cert = fs.readFileSync(App.ssl.ws.cert)
  const wsOptions = {
    key,
    cert
  }
  Wsserver = https.createServer(wsOptions, app)
} else {
  Wsserver = http.createServer(app)
}

// validación del lado del servidor
app.use(clientValidate)
// iniciamos WS

app.use('/', require('../routes/Route'))
app.use('/rxartsecure', require('../routes/RxartRouter'))
app.use(handleErrors)

// instanciamos la conexion socket
const io = new Server(Wsserver, {
  // ? config. de la intancia
  maxReceivedFrameSize: '500MiB',
  cors: {
    origin: '*',
    credentials: true,
    allowedHeaders: ['authorization']
  },
  reconnection: true, // Reconexión automática
  reconnectionAttempts: Infinity, // Número de intentos de reconexión
  reconnectionDelay: 2000, // Tiempo en milisegundos que espera antes de la reconex.
  reconnectionDelayMax: 7000 // Tiempo max de intentos de reconex.

})
// listeng de conexiones
try {
  // if (cluster.isPrimary) {
  //   console.log(`Primary ${process.pid} is running`)
  //   // Fork workers.
  //   for (let i = 0; i < numCPUs; i++) {
  //     cluster.fork()
  //   }
  //   cluster.on('exit', (worker, code, signal) => {
  //     console.log(`worker ${worker.process.pid} died`)
  //   })

  //   // //*para recibir info desde el secundario
  //   // for (const id in cluster.workers) {
  //   //   cluster.workers[id].on("message", (mess) => {
  //   //     console.log("a", mess);
  //   //   });

  //   //   //*para enviar info a los secundarios
  //   //   cluster.workers[id].send("desde Primario");
  //   // }
  // } else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  if (!App.nows) {
    Wsserver.listen(App.wsport)
    console.log('socket io desde:', App.wsport)
  }
  if (!App.nohttp) {
    Httpserver.listen(App.httpport, () =>
      console.log('https desde:', App.httpport)
    )
  }

  try {
    SyncDB(psql, sfwb, redisClientSub, connectMongo).then((psqlSynced) => psqlSynced && findAndCreateDefaultUser())
  } catch (error) {
    console.error('sync error:' + error)
  }
  // http
  //* para enviar info al primario
  // cluster.worker.send("desde worker " + process.pid);
  // console.log(`Worker ${process.pid} started`);

  // //*para recibir info del primario
  // process.on("message", (mess) => {
  //   console.log("b", mess);
  // });

  // console.log(`Worker ${process.pid} started`)
  // }
} catch (e) {
  console.error('error', e)
}

// try {
//   SyncDB(psql, sfwb, redisClientSub)
// } catch (error) {
//   console.error('sync error:' + error)
// }

module.exports = { psql, sfwb, io }
