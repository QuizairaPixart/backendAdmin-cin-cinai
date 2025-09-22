const { redisClientPub, redisClientSub } = require('../../db/db')
const { statsDataFormat } = require('../../helpers/statsDataFormat')
const { readAction } = require('../Databases/CRUD-Actions')

const unSubscribeRedis = async (channel) => {
  const subscribe = await stateSuscriptions()
  if (subscribe.includes(channel)) {
    await redisClientSub.unsubscribe(channel, (count, err) => {
      // console.log('desuscripción de: ' + channel)
    })
  }
}

const subscribeRedis = async (channel) => {
  const subscribe = await stateSuscriptions()
  if (!subscribe.includes(channel)) {
    await redisClientSub.subscribe(channel, (count, err) => {
      // console.log('suscripción a: ' + channel)
    })
  }
}

const onReceiveRedis = async (io, sendConnection) => {
  // const subscribe = await stateSuscriptions()
  // console.log('onReceiveRedis =>', subscribe)

  await redisClientSub.on('message', async (channel, mess) => {
    const message = JSON.parse(mess)
    // console.log({ message, channel }, 'API-Backend')
    if (channel.includes('client')) {
      //* rutas de la api
      // console.log(channel)
      await routerReceiveRedis(message, io, sendConnection)
    } else if (message.client) {
      await routerReceiveRedis(message, io, sendConnection)
    }

    // toda la informacion que viene desde el api-client
  })
}

const sendRedis = async (channel, message) => {
  redisClientPub.publish(channel, JSON.stringify(message))
}

const stateSuscriptions = async () => {
  let subscribe = redisClientSub?.condition?.subscriber?.set?.subscribe
  subscribe = subscribe ? Object.keys(subscribe) : []
  // console.log('stateSuscriptions =>', { subscribe })
  return subscribe
}

const routerReceiveRedis = async (mess, io, sendSocketConnection) => {
  if (mess?.client !== undefined) {
    if (mess.client === true && (await stateSuscriptions()).includes(`client:${mess.identity}`)) {
      await sendRedis('channel-ws-1', { device: true, identity: mess.identity })
    } else {
      await sendRedis(`backend:${mess.identity}`, { device: false, identity: mess.identity })
    }
    await sendSocketConnection(mess, mess?.identity, io, 'clientConnect')
  } else {
    const args = Object.keys(mess)
    let message
    let argument
    let percentageRam = null
    let percentageDisk
    args.forEach(async (arg) => {
      if (arg === 'stats') {
        if (mess[arg]?.Ram) {
          percentageRam = statsDataFormat(mess[arg]?.Ram.available, mess[arg]?.Ram.total)
          // console.log(percentageRam)
          message = {
            percentageRam,
            Ram: mess[arg].Ram
          }
          argument = 'statRam'
          // mess[arg].percentageRam = percentageRam
          sendSocketConnection(message, mess?.identity, io, argument)
        }
        if (mess[arg]?.Disk) {
          percentageDisk = statsDataFormat(mess[arg]?.Disk.available, mess[arg]?.Disk.total)
          // console.log(percentageDisk)
          message = {
            percentageDisk,
            Disk: mess[arg].Disk
          }
          argument = 'statDisk'
          // mess[arg].percentageDisk = percentageDisk
          sendSocketConnection(message, mess?.identity, io, argument)
        }
        if (mess[arg]?.Battery) {
          message = {
            Battery: mess[arg].Battery
          }
          argument = 'statBattery'
          sendSocketConnection(message, mess?.identity, io, argument)
        }
      } else if (arg === 'actions') {
        // console.log(mess[arg])
        const { actionId } = mess[arg]
        const actionCompleted = await readAction(actionId)
        // console.log(actionCompleted[0])
        // message = actionCompleted[0]
        // argument = 'actionsCompleted'
        message = mess[arg]?.action === 'command' ? mess[arg] : actionCompleted[0]
        argument = mess[arg]?.action === 'command' ? 'command' : 'actionsCompleted'
        sendSocketConnection(message, mess?.identity, io, argument)
      } else {
        sendSocketConnection(mess[arg], mess?.identity, io, arg)
      }
    })

    //* ruteo de lo que manda el cliente
  }
}
module.exports = { unSubscribeRedis, subscribeRedis, onReceiveRedis, sendRedis, stateSuscriptions }
