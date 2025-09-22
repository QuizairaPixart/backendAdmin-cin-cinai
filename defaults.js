const { App, RxartSecure } = require('./config')
const { roles } = require('./utils/roles.json')
const { rxartPrefClient } = require('./utils/rxartPrefClient.json')

const defaults = {
  users: {
    user: 'Admin',
    password: 'Admin',
    name: 'admin',
    last: 'admin',
    phone: '123456789',
    email: ` ${App.recibeemailsender}`,
    range: 1,
    geo_id: 1,
    date: Date.now()
  },

  preferences: {
    time_connection: 60,
    time_persistence: 60,
    time_off_line_disconnection: 30,
    timeouts: [10, 5],
    use_other: false,
    use_google: false,
    stats: true,
    applications: true,
    lockApps: [
    ],
    time_location: 15,
    url_google: '',
    key_google: '',
    user_id: 1,
    date: Date.now()
  },
  useTime: {
    start_time: '00:00',
    end_time: '00:00',
    days_id: [],
    active_use_time: false
  },

  serverPreference: {
    url_secondary: `${App.urlSecondary}`,
    Ws_url: `${App.wshostback}:${App.wsportback}`,
    SafeWeb_url: [
      `${App.httpsafeweb}:${App.portsafeweb}`, `${App.wssafeweb}:${App.portwssafeweb}`
    ],
    Rxart_Secure: [
      `${RxartSecure.URL}`, `${RxartSecure.APIKEY}`, `${RxartSecure.CLIENTID}`
    ],
    max_licences: `${App.maxLicences}`,
    project_end_date: null,
    show_info: true
  },

  groups: {
    name: 'Todos',
    visible: false,
    user_id: 1,
    date: Date.now()
  },

  thief: {
    default: false,
    touch: false,
    screen: false,
    background: false,
    /* usb: false, */
    alarm: false,
    pass: false,
    /* statusMessage: false, */
    messageTitle: 'Alerta de Robo!',
    messageBody: 'Por Favor Devolver el Dispositivo al Establecimiento!!',
    photo: false,
    quality: 'low',
    recursive: false,
    timeImage: 2,
    email: `${App.authuseremailsender}`,
    statusTracking: false,
    timeRequest: 3,
    timeTracking: 1,
    date: Date.now()
  },

  reports: {
    reportsDays: false,
    days: 7,
    overAlert: false,
    percentRam: 70,
    percentDisk: 70,
    percentBattery: 20,
    emailUser: `${App.authuseremailsender}`,
    emailKey: `${App.authkeyemailsender}`,
    date: Date.now()
  },

  safeweb: {
    responseDefault: true,
    blackList: true,
    whiteList: true,
    keyWords: true,
    historyDays: 7,
    preferenceId: 1,
    date: Date.now()
  },

  configGeofences: {
    checkEmail: false,
    checkSms: false,
    notifications: 'Inmediatas',
    sendMsg: '',
    activeDevice: false,
    activeNetwork: false,
    powerOffDevice: false,
    selectData: 'Día',
    exportData: false,
    date: Date.now()
  },

  roles,

  rxartPrefClient

}

module.exports = { defaults }
