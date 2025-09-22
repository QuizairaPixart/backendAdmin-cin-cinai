const { readThief } = require('../../Databases/CRUD-Actions')
const { App } = require('../../../config')
const fs = require('fs')
const path = require('path')

//! FUNCIONA DE MANERA LOCAL,
//! REVISAR EL TEMA DE LAS RUTAS, YA QUE SE CAMBIARON AL
//! DIVIDIR (API-CLIENT, PROCESSOR Y API-BACKEND) EN DISTINTAS VM

const getImages = async (id) => {
  const thief = await readThief({ order_id: id })
  const buffer = []
  let dirPath

  if (thief) {
    dirPath = path.resolve(
      path.dirname(__filename),
      `../../../../../API-Client${App.dirstorage}${App.dirphotos}/${thief.identity}-${thief.order_id}`
    )

    if (thief.path) {
      for (const pathImg of thief.images) {
        buffer.push({
          name: pathImg,
          buffer: fs.readFileSync(dirPath + '/' + pathImg)
        })
      }
    }
  }

  return { status: 200, send: buffer }
}

module.exports = { getImages }

// const { } = require("../../Databases/CRUD-Locations");
// const { readThief } = require("../../Databases/CRUD-Actions");
// const { App } = require("../../../config");
// const fs = require("fs");

// const getImages = async (id) => {
//   let tracking = (await readTracking({ id }, "device"))[0];
//   let buffer = [];
//   let dirPath =
//     App.dirstorage + tracking.device.identity + "-" + tracking.order_id;
//   let Thief = await readThief({ order_id: tracking.order_id });

//   if (Thief) {
//     if (Thief.path) {
//       for (const pathImg of JSON.parse(Thief.images)) {
//         buffer.push({
//           name: pathImg,
//           buffer: fs.readFileSync(dirPath + "/" + pathImg),
//         });
//       }
//     }

//     return { status: 200, send: buffer };
//   }

//   dirThiefs.close();
// };

// module.exports = { getImages };
