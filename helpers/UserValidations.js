// const ClientPSQL = require('../Controller/Databases/CRUD-Client')
const { Encrypt, Restore, System } = require('../config')
const { redisServer } = require('../db/db')
const { App } = require('../config')
const bcrypt = require('bcrypt')
const { roles } = require('../utils/roles.json')
const jwt = require('jsonwebtoken')

const clientRegister = async (user, password) => {
  const result = { auth: false }

  const userDB = await bcrypt.compare(user, System.USystem)
  const passwordDB = await bcrypt.compare(password, System.PSystem)

  if (userDB && passwordDB) {
    const hash = await genereateHash()

    const store = {
      id: parseInt(System.ISystem),
      session_id: hash
    }

    const userRedis = {}

    if (store) {
      const userRoles = [{ ...roles }]
      const rolesInfo = processRoles(userRoles)
      if (rolesInfo) result.roles = rolesInfo

      userRedis.id = store.id
      userRedis.roles = rolesInfo
      userRedis.session_id = hash

      const token = await GenerateToken(JSON.stringify(userRedis), hash)

      result.auth = true
      result.id = userRedis.id
      result.range = 1
      result.token = token.token

      // console.log(userRedis)
      if (App.timeRedisUsersWeb) {
        redisServer.set(`UsersWeb:${userRedis.id}`, JSON.stringify(userRedis), 'EX', App.timeRedisUsersWeb)
      } else {
        redisServer.set(`UsersWeb:${userRedis.id}`, JSON.stringify(userRedis))
      }
    }
    // console.log({ store })
  }
  return result
}

const genereateHash = async () => {
  let encrypt = ''
  const char = Encrypt.chars
  const lengths = char.length
  for (let i = 0; i < Encrypt.exp; i++) {
    encrypt += char.charAt(Math.floor(Math.random() * lengths))
  }
  return encrypt
}

const GenerateToken = async (user, hash) => {
  const token = jwt.sign(user, hash)

  return { token, hash }
}

const clientValidate = async (req, res, next) => {
  try {
    const tokenPixtech = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwic2Vzc2lvbl9pZCI6IkNNMFNtek40cTl0M2xhVCJ9.Wmf1mfiZMpGgrc_Dxdhdo248ADUkP_7Byam8H5-wyoE'
    if (
      req.path === '/login' ||
      req.path.includes('/reports') ||
      req.path.includes('download') ||
      req.headers.pixtech === tokenPixtech
    ) {
      next()
    } else {
      const headers = JSON.parse(req.headers.authorization)
        ? JSON.parse(req.headers.authorization)
        : null
      const result = { complete: false }

      if (headers) {
        const userId = headers.userId ? headers.userId : null
        // const rolesHead = headers.roles ? headers.roles : null
        const token = headers.token ? headers.token : null

        let userRedis = userId ? await redisServer.get(`UsersWeb:${userId}`) : null
        if (userRedis) {
          userRedis = JSON.parse(userRedis)
          // console.log(userRedis)

          const tokenToCompare = await GenerateToken(JSON.stringify(userRedis), userRedis.session_id)

          if (token === tokenToCompare?.token) {
            jwt.verify(token, userRedis.session_id, (err, verify) => {
              if (err) {
                console.log('client', err)
                return (result.complete = false)
              } else {
                // console.log(verify.roles/* , userRedis.roles */)
                if (JSON.stringify(verify.roles) === JSON.stringify(userRedis.roles)) {
                  // if (JSON.stringify(rolesHead) !== JSON.stringify(userRedis.roles)) {
                  // return (result.complete = false)
                  // } else {
                  return (result.complete = true)
                  // }
                } else {
                  return (result.complete = false)
                }
              }
            })
          }
        }
      }

      if (result.complete === false) {
        res.status(403).send({ redirect: true })
      } else {
        next()
      }
    }
  } catch (e) {
    res.status(500).send({ error: e })
    console.error('error: ' + e)
  }
}

const validateToken = async (user, token) => {
  const result = { status: false }
  if (user === -1) {
    // const user_DB = await ClientPSQL.readUser({ id: user })

    jwt.verify(
      token,
      Restore.charEncode,
      { encrypt: 'HS256' },
      (err, verify) => {
        if (err) {
          console.error('token', err)
        } else if (verify) {
          if (verify.password === Restore.stringChar) {
            result.status = true
          }
        }
      }
    )
  }
  return result
}

const processRoles = (userRoles) => {
  if (userRoles.length === 0) return null

  // let roleProperties = (userRoles[0].toJSON())
  let roleProperties = userRoles[0]
  // delete roleProperties?.id
  delete roleProperties?.roleName
  // delete roleProperties?.version
  // delete roleProperties?.usersRole
  roleProperties = Object.keys(roleProperties)

  const rolesInfo = {}

  for (const role of userRoles) {
    for (const property of roleProperties) {
      if (role[property]) {
        rolesInfo[property] = rolesInfo[property] || {}

        if (Array.isArray(role[property]) && Array.isArray(rolesInfo[property])) {
          rolesInfo[property] = [...new Set([...rolesInfo[property], ...role[property]])]
        } else {
          rolesInfo[property] = { ...rolesInfo[property], ...role[property] }
        }
      } else {
        rolesInfo[property] = rolesInfo[property] || {}
      }
    }
  }

  return Object.keys(rolesInfo).length > 0 ? rolesInfo : null
}

module.exports = { clientRegister, clientValidate, validateToken }
