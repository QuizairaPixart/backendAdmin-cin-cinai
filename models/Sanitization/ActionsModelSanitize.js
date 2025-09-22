const ActionsModel = (req) => {
  const res = []
  for (const data of req.actions) {
    switch (data.action) {
      case 'lock':
        res.push({
          action: data.action,
          data: lockSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId,
          userId: data.userId
        })
        break
      case 'install':
        res.push({
          action: data.action,
          data: installSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'power_config':
        res.push({
          action: data.action,
          data: rebootSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'message':
        res.push({
          action: data.action,
          data: messageSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'tracking':
        res.push({
          action: data.action,
          data: trackingSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId,
          userId: data.userId
        })
        break
      case 'uninstall':
        res.push({
          action: data.action,
          data: unistallSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'command':
        res.push({
          action: data.action,
          data: commandSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'folders':
        res.push({
          action: data.action,
          data: folderSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'disable':
        res.push({
          action: data.action,
          data: disableSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'screen_lock':
        res.push({
          action: data.action,
          data: screenLockSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      case 'brightness':
        res.push({
          action: data.action,
          data: brightnessSanitize(data),
          devicesId: data.devicesId,
          groupsId: data.groupsId
        })
        break
      default:
        console.log('desconocido', data)
        break
    }
  }
  return res
}

const lockSanitize = ({ data }) => {
  const res = {}
  // eslint-disable-next-line camelcase
  const { statusLock, order_id, preferences } = data
  const {
    touch,
    background,
    screen,
    usb,
    alarm,
    pass,
    messageTitle,
    messageBody,
    photo
  } = preferences

  res.statusLock = statusLock ?? SanitizeBoolean(statusLock)
  // eslint-disable-next-line camelcase
  res.order_id = order_id ? parseFloat(order_id) : null
  res.preferences = {
    touch: touch ?? SanitizeBoolean(touch),
    background: background ?? SanitizeBoolean(background),
    screen: screen ?? SanitizeBoolean(screen),
    usb: usb ?? SanitizeBoolean(usb),
    alarm: alarm ?? SanitizeBoolean(alarm),
    pass: pass ? String(pass) : null,
    messageTitle: messageTitle ? String(messageTitle) : '',
    messageBody: messageBody ? String(messageBody) : '',
    photo: {
      status: photo.status ?? SanitizeBoolean(photo.status),
      quality: photo.quality ? String(photo.quality) : null,
      recursive: photo.recursive ?? SanitizeBoolean(photo.recursive),
      time: photo.time ? parseInt(photo.time) : null
    }
  }

  return res
}

const messageSanitize = ({ data }) => {
  const res = {}
  const { title, body, recursive } = data
  res.title = title ? String(title) : null
  res.body = body ? String(body) : null
  res.recursive = {
    status: recursive.status ?? SanitizeBoolean(recursive.status),
    repeat: recursive.repeat ? parseInt(recursive.repeat) : null,
    finish: recursive.finish ? parseInt(recursive.finish) : null
  }

  return res
}

const trackingSanitize = ({ data }) => {
  const res = {}
  // eslint-disable-next-line camelcase
  const { statusTracking, tracking, report, order_id } = data
  res.statusTracking = statusTracking ?? SanitizeBoolean(statusTracking)
  res.tracking = tracking ? parseInt(tracking) : null
  res.report = report ? parseInt(report) : null
  // eslint-disable-next-line camelcase
  res.order_id = order_id ? parseInt(order_id) : null

  return res
}
const installSanitize = ({ data }) => {
  const res = {}
  const { fileName, url, type } = data
  res.fileName = fileName ? String(fileName) : null
  res.url = url ? String(url) : null
  res.type = type ? String(type) : null

  return res
}

const unistallSanitize = ({ data }) => {
  const res = {}
  const { uninstall: uninstallData } = data
  res.uninstall = String(uninstallData)

  return res
}

const rebootSanitize = ({ data }) => {
  const res = {}
  const { powerState } = data
  res.powerState = powerState ? String(powerState) : null

  return res
}

const SanitizeBoolean = (bool) => {
  if (bool === false) {
    return false
  } else {
    return Boolean(bool)
  }
}

const commandSanitize = ({ data }) => {
  const res = {}
  const { command } = data
  res.command = command ? String(command) : null

  return res
}

const folderSanitize = ({ data }) => {
  const res = {}
  const { images, videos, documents, downloads, music } = data
  res.images = images ?? SanitizeBoolean(images)
  res.videos = videos ?? SanitizeBoolean(videos)
  res.documents = documents ?? SanitizeBoolean(documents)
  res.downloads = downloads ?? SanitizeBoolean(downloads)
  res.music = music ?? SanitizeBoolean(music)

  return res
}

const disableSanitize = ({ data }) => {
  const res = {}
  // eslint-disable-next-line camelcase
  const { statusLock, preferences } = data
  const {
    touch,
    // background,
    screen
    // usb,
    // alarm,
    // pass,
    // messageTitle,
    // messageBody,
    // photo
  } = preferences

  res.statusLock = statusLock ?? SanitizeBoolean(statusLock)
  res.preferences = {
    touch: touch ?? SanitizeBoolean(touch),
    // background: background ?? SanitizeBoolean(background),
    screen: screen ?? SanitizeBoolean(screen)
    // usb: usb ?? SanitizeBoolean(usb),
    // alarm: alarm ?? SanitizeBoolean(alarm),
    // pass: pass ? String(pass) : null,
    // messageTitle: messageTitle ? String(messageTitle) : null,
    // messageBody: messageBody ? String(messageBody) : null,
    // photo: {
    //   status: photo.status ?? SanitizeBoolean(photo.status),
    //   quality: photo.quality ? String(photo.quality) : null,
    //   recursive: photo.recursive ?? SanitizeBoolean(photo.recursive),
    //   time: photo.time ? parseInt(photo.time) : null
    // }
  }

  return res
}

const screenLockSanitize = ({ data }) => {
  const res = {}
  const { statusScreenLock } = data
  res.statusScreenLock = statusScreenLock ?? SanitizeBoolean(statusScreenLock)

  return res
}

const brightnessSanitize = ({ data }) => {
  const res = {}
  const { status, percentage } = data
  res.status = status ?? SanitizeBoolean(status)
  res.percentage = percentage ? parseInt(percentage) : null

  return res
}

module.exports = { ActionsModel }
