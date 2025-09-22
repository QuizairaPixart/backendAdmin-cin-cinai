require('dotenv').config()
const IoRedis = require('ioredis')
const { Sequelize } = require('sequelize')
const { Postgres, Redis, Mongo } = require('../config')
const mongoose = require('mongoose')

// connexion a BD postgres
const psql = new Sequelize(Postgres.database, Postgres.user, Postgres.pass, {
  host: Postgres.host,
  schema: 'geostats',
  dialect: 'postgres',
  logging: false
})

const sfwb = new Sequelize(Postgres.database, Postgres.user, Postgres.pass, {
  host: Postgres.host,
  schema: 'safeWeb',
  dialect: 'postgres',
  logging: false
})

const rxartPsql = new Sequelize(Postgres.database, Postgres.user, Postgres.pass, {
  host: Postgres.host,
  schema: 'rxart',
  dialect: 'postgres',
  logging: false
})

//* conexion con mongoDB
const connectMongo = async () => {
  mongoose.set('strictQuery', false)
  await mongoose.connect(Mongo.uri).then(() => {
    console.log(5, 'Conectado a Mongo')
  })
}

const redisClientPub = new IoRedis({
  password: Redis.pass,
  host: Redis.host,
  port: Redis.port
})

const redisClientSub = new IoRedis({
  password: Redis.pass,
  host: Redis.host,
  port: Redis.port
})

const redisServer = new IoRedis({
  password: Redis.pass,
  host: Redis.host,
  port: Redis.port
})

// sinqueo de la BD
const SyncDB = async (psql, sfwb, redisSub, mongoDb) => {
  const psqlSynced = false

  try {
    await psql.authenticate()
      .then(async () => {
        console.log(1, 'conectado a la BD de postgres')
        // await psql.sync({ alter: true, force: true })
        //   .then(() => {
        //     console.log(1, 'sinqueo BD postgres')
        //     psqlSynced = true
        //   })
        //   .catch((geoSyncError) => console.log({ geoSyncError })) // sinqueo BD
      })
  } catch (geoError) {
    console.error({ geoError })
  }

  sfwb
    .authenticate()
    .then(async () => {
      console.log(2, 'conectado a la BD de safeWeb')
      // sfwb
      //   .sync({ alter: true })
      //   .then(() => console.log(2, 'sinqueo BD safeWeb'))
      //   .catch((sfwbSyncError) => console.log({ sfwbSyncError })) // sinqueo BD
    })
    .catch((sfwbError) => console.log({ sfwbError }))

  rxartPsql
    .authenticate()
    .then(async () => {
      console.log(3, 'conectado a la BD de rxartSecure')
      // rxartPsql
      //   .sync({ alter: true })
      //   .then(() => console.log(3, 'sinqueo BD rxartPsql'))
      //   .catch((rxartSyncError) => console.log({ rxartSyncError })) // sinqueo BD
    })
    .catch((rxartError) => console.log({ rxartError }))

  redisSub.subscribe('channel-ws-2').then((count, err) => {
    if (!err) console.log('suscrito a channel-ws-2')
  })

  await mongoDb()
    .catch((err) => {
      console.error('Error en Mongo =>', err)
    })

  return psqlSynced
}

module.exports = {
  psql,
  sfwb,
  rxartPsql,
  connectMongo,
  SyncDB,
  redisClientPub,
  redisClientSub,
  redisServer
}
