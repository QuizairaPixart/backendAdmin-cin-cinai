const { Op } = require('sequelize')
const { historyBlack } = require('../../../models/Sfwb/BlackListModel')
const { historyQuery, queryList } = require('../../../models/Sfwb/QueryModel')
const { historyWhite } = require('../../../models/Sfwb/WhiteListModel')

const lastQueryHistory = async () => {
  const lastQuery = await historyQuery.findAll({
    order: [['date', 'DESC']],
    limit: 3
  })

  return lastQuery
}

const mostQuery = async () => {
  const mostQuery = await queryList.findAll({
    order: [['count', 'DESC']],
    limit: 10
  })

  return mostQuery
}

const operationsDays = (date, numberDays) => {
  const day = new Date(date)
  const dayPlus = day.setDate(day.getDate() + numberDays)
  const response = new Date(dayPlus).toISOString().split('T')[0]

  return response
}

const getLine = async (date, table) => {
  let dt
  const response = []
  let day

  if (table === 'black') dt = historyBlack
  else if (table === 'white') dt = historyWhite
  else if (table === 'query') dt = historyQuery

  for (let index = 0; index < 7; index++) {
    const dayToQuery = day === undefined ? date : operationsDays(day, 1)

    const count = await dt.count({
      where: {
        date: {
          [Op.between]: [
            new Date(dayToQuery + ' 00:00:00.000 +00:00'),
            new Date(dayToQuery + ' 23:59:59.000 +00:00')
          ]
        }
      }
    })

    response.push({
      day: dayToQuery,
      count
    })
    day = dayToQuery
  }
  // console.log(response);
  return response
}

module.exports = {
  lastQueryHistory,
  mostQuery,
  getLine
}
