const {
  CreateAction,
  UpdateStat,
  ReadActionComplete
} = require('../Actions/ActionsCtrl')

// const GetActions = async (req, res) => {
//   let response = { status: 500, send: { auth: false } };
//   let data = req.params.id;
//   let actions = await ReadAction(null);
//   if (actions) {
//     (response.status = 201), (response.send = actions);
//   }
//   return response;
// };
// const GetAction = async (req, res) => {
//   let response = { status: 500, send: { auth: false } };
//   let data = req.params.id;
//   let actions = await ReadAction({ id: data });
//   if (actions) {
//     (response.status = 201), (response.send = actions);
//   }
//   return response;
// };
const PostActions = async (req, res) => {
  try {
    const response = { status: 500, send: { auth: false } }
    const data = req.body
    // console.log({ data })
    const actions = await CreateAction(data)
    if ((actions.result === true)) {
      response.status = 201
      response.send = actions.actions
    }
    return response
  } catch (error) {
    console.log('error PostAction', error)
  }
}
// const PutAction = async (req, res) => {
//   let response = { status: 500, send: { auth: false } };
//   let data = req.body;
//   let actions = await UpdateAction(data);
//   if (actions) {
//     (response.status = 201), (response.send = actions);
//   }
//   return response;
// };
// const DeleteAction = async (req, res) => {
//   let response = { status: 500, send: { auth: false } };
//   let data = req.body;
//   let actions = await deleteAction(data);
//   if (actions) {
//     (response.status = 201), (response.send = actions);
//   }
//   return response;
// };
const PutStat = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const data = req.body
  const actions = await UpdateStat(data)
  if (actions) {
    response.status = 201
    response.send = actions
  }
  return response
}

const GetActionsCompleted = async (req, res) => {
  const response = { status: 500, send: { auth: false } }
  const deviceId = req.params.id
  const actions = await ReadActionComplete(deviceId)

  if (actions) {
    response.status = 200
    response.send = actions?.data
  } else {
    response.status = 200
    response.send = []
  }

  return response
}

module.exports = {
  // GetAction,
  // GetActions,
  PostActions,
  // PutAction,
  // DeleteAction,
  PutStat,
  GetActionsCompleted
}
