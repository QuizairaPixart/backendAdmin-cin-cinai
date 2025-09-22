const config = {
  App: {
    authkeyemailsender: process.env.AUTH_KEY_EMAIL_SENDER,
    authuseremailsender: process.env.AUTH_USER_EMAIL_SENDER,
    dircontent: process.env.DIRCONTENT,
    dirinstall: process.env.DIRINSTALL,
    dirphotos: process.env.DIRPHOTOS,
    dirstorage: process.env.DIRSTORAGE,
    dirwallpaper: process.env.DIRWALLPAPER,
    dirdenunciations: process.env.DIRDENUNCIATIONS,
    dirpdf: process.env.DIRPDF,
    headerPolicy: process.env.HEADERPOLICY,
    httphost: process.env.APP_HOST,
    httpport: process.env.APP_PORT,
    wsport: process.env.APP_PORT2,
    httpHostBackendFile: process.env.APP_HTTPHOSTBACKEND,
    httpPortBackendFile: process.env.APP_PORT,
    httpportbknd: process.env.APP_HTTPPORTBACKEND,
    httpsafeweb: process.env.APP_BACKEND_SAFEWEB_HTTP,
    portsafeweb: process.env.APP_BACKEND_SAFEWEB_PORT,
    portwssafeweb: process.env.APP_BACKEND_SAFEWEB_PORTWS,
    recibeemailsender: process.env.RECIBE_EMAIL_SENDER,
    wshostback: process.env.APP_BACKEND_WS_HOST,
    wsportback: process.env.APP_BACKEND_WS_PORT,
    wssafeweb: process.env.APP_BACKEND_SAFEWEB_WS,
    wsurls: process.env.APP_BACKEND_URLS,
    wsprotocol: process.env.APP_WS_PROTOCOL,
    urlSecondary: process.env.URLSECONDDEFAULT,
    proxySafeWebUrl: process.env.APP_BACKEND_SAFEWEB_PROXYURL,
    proxySafeWebAPIUrl: process.env.APP_BACKEND_SAFEWEB_PROXYAPIURL,
    proxySafeWebPort: process.env.APP_BACKEND_SAFEWEB_PROXYAPIPORT,
    timeRedisUsersWeb: process.env.APP_BACKEND_TIME_REDIS_USERSWEB,
    maxLicences: process.env.MAX_LICENCES,
    restoreMongoDB: process.env.RESTORE_MONGO_DB ? process.env.RESTORE_MONGO_DB.toLocaleLowerCase() === 'true' : false,
    ssl: {
      http: {
        key: process.env.PATH_SSL_SERVER_KEY_HTTP,
        cert: process.env.PATH_SSL_SERVER_CERT_HTTP
      },
      ws: {
        key: process.env.PATH_SSL_SERVER_KEY_WS,
        cert: process.env.PATH_SSL_SERVER_CERT_WS
      }
    }
  },
  Postgres: {
    user: process.env.PSQL_USERNAME,
    pass: process.env.PSQL_PASSWORD,
    host: process.env.PSQL_HOST,
    port: process.env.PSQL_PORT,
    database: process.env.PSQL_DATABASE,
    max: process.env.PSQL_MAX,
    min: process.env.PSQL_MIN
  },
  SafeWeb: {
    user: process.env.SFWB_USERNAME,
    pass: process.env.SFWB_PASSWORD,
    host: process.env.SFWB_HOST,
    port: process.env.SFWB_PORT,
    database: process.env.SFWB_DATABASE,
    max: process.env.SFWB_MAX,
    min: process.env.SFWB_MIN
  },
  Redis: {
    host: process.env.REDISHOST,
    port: process.env.REDISPORT,
    lifetime: process.env.REDISLIFETIME,
    pass: process.env.REDISPASS
  },
  Mongo: {
    uri: process.env.MONGOURI
  },
  Encrypt: {
    chars: process.env.CHAR_ENCRYPT,
    exp: process.env.NUMBER_ENCRYPT,
    expire: process.env.EXPIRED_TOKEN
  },
  Restore: {
    charEncode: process.env.RESTORE_DB_ENCODE,
    stringChar: process.env.RESTORE_DB_STRING
  },
  RxartSecure: {
    APIKEY: process.env.RXARTAPIKEY,
    URL: process.env.RXARTURL,
    CLIENTID: process.env.RXARTCLIENTID
  },
  ApiRxartSecure: {
    url: process.env.API_URL,
    bearerToken: process.env.API_TOKEN,
    projectId: process.env.PROJECT_ID
  },
  System: {
    USystem: process.env.U_SYSTEM,
    PSystem: process.env.P_SYSTEM,
    ISystem: process.env.I_SYSTEM
  }
}

module.exports = config
