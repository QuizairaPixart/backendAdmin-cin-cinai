const { readUseTimeAppsForGroupApp, readAppsWithPagination, readAppsWithOutPagination } = require('../../Databases/CRUD-Applications')
const { readAllAppUseMetrics } = require('../../Databases/CRUD-AllAppUseMetrics')

const useTimeApplications = async (groupApp, dateFilter, view) => {
  let useTime = null
  const array = []
  let filterGroup = null
  let endDate = null
  let startDate = null
  let date = null
  if (dateFilter !== 0) {
    endDate = formatDays(1)
    startDate = formatDays(parseInt(dateFilter))
    date = intervalOfDays(startDate, endDate)
  }

  if (groupApp !== 'no') filterGroup = { groupApp }

  useTime = await readUseTimeAppsForGroupApp(filterGroup, date)

  if (view !== 'home') {
    useTime.forEach(element => {
      const data = {
        id: element.id,
        name: element.app,
        groupApp: element.groupApp,
        totalTimeSeconds: 0
      }

      element.allAppUseMetrics.forEach(useTimeApp => {
        data.totalTimeSeconds += useTimeApp.totalTimeSeconds
      })

      array.push(data)
    })
  } else {
    // console.log(useTime)
    useTime.forEach(element => {
      // console.log(element.allAppUseMetrics)
      element.allAppUseMetrics.forEach(metric => {
        array.push(metric)
      })
    })
  }

  array.sort(function (a, b) {
    return b.totalTimeSeconds - a.totalTimeSeconds
  })
  // console.log({ array })
  return array
}

const applicationsPagination = async (pagination) => {
  let apps = null
  let useTime = null
  const array = []
  let response = null
  let endDate = null
  let startDate = null
  let date = null
  let filterGroup = null
  let count = null
  const { groupApp, search, dateFilter, offset, limit, order, exportData, column } = pagination
  // console.log(groupApp, search, dateFilter, offset, limit, order, exportData, column)

  if (dateFilter !== 0) {
    endDate = formatDays(1)
    startDate = formatDays(parseInt(dateFilter))
    date = intervalOfDays(startDate, endDate)
  }

  if (groupApp !== 'no') filterGroup = ['groupApp', groupApp]

  if (exportData) {
    apps = await readAppsWithOutPagination(filterGroup, date, search, column)
  } else {
    apps = await readAppsWithPagination(filterGroup, date, order, limit, offset, search, column)
    count = apps?.count
    apps = apps?.rows
  }

  const applicationId = apps?.map((app) => app.id)
  useTime = await readAllAppUseMetrics(applicationId, date)

  apps?.forEach(async (element) => {
    const data = {
      id: element.id,
      app: element.app,
      uninstall: element.uninstall,
      installPath: element.installPath,
      version: element.version,
      system: element.system,
      groupApp: element.groupApp,
      last_date: element.last_date,
      totalTimeSeconds: 0
    }

    if (useTime.length > 0) {
      useTime.forEach(useTimeApp => {
        if (useTimeApp.applicationId === data.id) data.totalTimeSeconds += useTimeApp.totalTimeSeconds
      })
    }

    array.push(data)
  })

  // console.log({ array })
  if (exportData) response = array
  else response = { count, rows: array }

  return response
}

const formatDays = (rest) => {
  const today = new Date()
  let endDate = today.setUTCDate(today.getUTCDate() - rest)
  // console.log(endDate)
  endDate = new Date(endDate).toISOString().split('T')[0]
  return endDate
}

const intervalOfDays = (start, end) => {
  const date = [
    new Date(start + ' 00:00:00.000 +00:00'),
    new Date(end + ' 23:59:59.000 +00:00')
  ]
  return date
}
module.exports = { useTimeApplications, applicationsPagination, formatDays, intervalOfDays }
