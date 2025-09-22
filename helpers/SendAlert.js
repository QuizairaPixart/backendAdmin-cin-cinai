const nodemailer = require('nodemailer')
const { readGroup } = require('../Controller/Databases/CRUD-Client')
const { readPreference } = require('../Controller/Databases/CRUD-Preferences')

const sendMailer = async (auth, mail) => {
  try {
    const acount = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: auth.user, // generated ethereal user
        pass: auth.pass // generated ethereal password
      }
    })

    const verify = await acount.verify()
    if (verify) {
      const send = await acount.sendMail({
        from: mail.from, // sender address
        to: mail.to, // list of receivers
        subject: mail.subject, // Subject line
        text: mail.text, // plain text body
        html: mail.html // html body
      })
      if (send) {
        return { send: send.messageId }
      } else {
        return { send: { auth: false } }
      }
    }
  } catch (e) {
    console.error('sendMailer ', e)
  }
}
const redactMail = async (id, data) => {
  const group = await readGroup(id)
  const preference = await readPreference(id)
  const auth = {
    user: preference.emailUser,
    pass: preference.emailKey
  }
  const email = {
    from: preference.mailUser,
    to: [],

    subject: data.subject,
    text: data.text,
    html: data.html
  }
  if (group.users) {
    for (const user of group.users) {
      email.to.push(user.email)
    }
  }

  const send = await sendMailer(auth, email)
  console.log({ send })
}

module.exports = { sendMailer, redactMail }
