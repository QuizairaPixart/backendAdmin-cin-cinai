const { CronJob } = require('cron')
const { readReports } = require('../Controller/Databases/CRUD-Preferences')
const { sendMailer } = require('./SendAlert')
const { email } = require('../email')
const { readGroup } = require('../Controller/Databases/CRUD-Client')

const initialCron = async () => {
  const report = await readReports(1)
  if (report && report.reportsDays) return await cronTask(report)
}

let init = initialCron()

const cronTask = async (reportDB, restart) => {
  let recipients = []
  let instance = []
  const group = await readGroup(reportDB.groupId)
  recipients = group?.users?.map((user) => user.email)

  instance = init

  // cargo los datos de autenticacion
  const sendmail = {
    auth: {
      user: reportDB.emailUser,
      pass: reportDB.emailKey
    },
    mail: {
      from: reportDB.emailUser,
      to: recipients,
      subject: email.subject,
      text: email.text,
      html: email.html
    }
  }

  if (restart && instance.runing) instance.stop()

  if (reportDB.reportsDays === true) {
    // si se reportan dias
    init = await jobInit(reportDB.days, sendmail)
  } else {
    // si es falso se detendra el cron si existe
    if (instance) instance.stop()
  }
  return init
}

const jobInit = async (time, mail) => {
  let count = 0
  sendMailer(mail.auth, mail.mail)
  console.log(2, 'mando mail ')

  const instance = new CronJob('*/59 */59 */23 * * *', () => {
    count++
    if (count === time) {
      sendMailer(mail.auth, mail.mail)
      console.log(1, 'mando mail ')
      count = 0
    }
    console.log('contador en: ' + count)
  })
  instance.start()
  return instance
}

module.exports = {
  cronTask,
  initialCron
}
