const { throwAppError } = require('../../middlewares/errors/AppError')
const { QueryDevice, CalcTicket, ChangeStatusDevice, changeDeviceData, ChangeClientData, QueryClientData } = require('../Proccess/Actions/RxartAPICucoCtrl')

const PostRxart = async (req, res) => {
  try {
    let response = { status: 500, send: { empty: true } }
    // console.log(req.query)
    if (req.query.endpoint === 'query_device') response = await QueryDevice(req.body)
    if (req.query.endpoint === 'calc_ticket_unlock') response = await CalcTicket(req.body)
    if (req.query.endpoint === 'change_device_status') response = await ChangeStatusDevice(req.body)
    if (req.query.endpoint === 'change_device_data') response = await changeDeviceData(req.body)
    if (req.query.endpoint === 'change_client_data') response = await ChangeClientData(req.body)
    if (req.query.endpoint === 'query_client_data') response = await QueryClientData(req.body)
    // if (req.params.endpoint === 'ticket_device') response = await TicketDevice(req.params.query)
    if (response.send.error) response.status = 403
    if (response) res.status(response.status).send(response.send)
  } catch (e) {
    throwAppError(e, 'ERR_RXART_POST')
  }
}

module.exports = { PostRxart }
