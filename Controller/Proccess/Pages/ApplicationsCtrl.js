const ApplicationsPSQL = require('../../Databases/CRUD-Applications')
const { readPreference } = require('../../Databases/CRUD-Preferences')
const { useTimeApplications, applicationsPagination } = require('../Actions/ApplicationsCtrl')
const GetApps = async (req) => {
  let apps = null
  let { pagination } = req.params
  let { chart } = req.params

  if (pagination) {
    pagination = JSON.parse(pagination)
    // console.log('pagination=>', pagination)
    apps = await applicationsPagination(pagination)
  }

  if (chart) {
    chart = JSON.parse(chart)
    // console.log('chart=>', chart)
    const { groupApp, dateFilter, view } = chart
    apps = await useTimeApplications(groupApp, dateFilter, view)
  }

  if (apps) return { status: 200, send: apps }
  else return { status: 500, send: { auth: false } }
}

const PutApps = async (req) => {
  let pref = null
  const result = []
  const apps = req.body
  pref = await readPreference(1)
  for (const app of apps) {
    let flag = true
    const appDB = await ApplicationsPSQL.updateApp(app.id, app)

    if (!appDB) {
      flag = false
    }
    result.push({ id: appDB.id, result: flag })
  }
  const appsGroupApp0 = (await ApplicationsPSQL.readAppForGroupApp(0)).map(app => app.uninstall)
  pref?.lockApps?.sort()
  appsGroupApp0.sort()
  const existFilterGroup = apps?.filter((app) => app.groupApp === 0)

  if (existFilterGroup?.length > 0 || (JSON.stringify(pref?.lockApps) !== JSON.stringify(appsGroupApp0))) {
    await comparePrefereces(appsGroupApp0, pref)
    return { status: 201, send: result }
  }

  return { status: 200, send: result }
}

const comparePrefereces = async (apps, pref) => {
  // guardo cambios en pref
  pref.lockApps = apps
  await pref.save()
}

module.exports = { GetApps, PutApps }
