const {
  lastQueryHistory,
  mostQuery,
  getLine
} = require('../Actions/SfWbHomeCtrl')

const getHome = async (date, query) => {
  let res

  if (query === 'black') res = await getLine(date, query)
  if (query === 'white') res = await getLine(date, query)
  if (query === 'query') res = await getLine(date, query)
  if (query === 'searchLast') res = await lastQueryHistory()
  if (query === 'searchMost') res = await mostQuery()

  if (res) return { status: 200, send: res || [] }
}

module.exports = { getHome }
