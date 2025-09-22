const PdfPrinter = require('pdfmake')
const fs = require('fs')
const path = require('path')
const { App } = require('../../../config')
// Fuentes requeridas en Node
const fonts = {
  Roboto: {
    normal: path.resolve(__dirname, '../../../assets/Roboto-Bold.ttf'),
    bold: path.resolve(__dirname, '../../../assets/Roboto-Medium.ttf'),
    italics: path.resolve(__dirname, '../../../assets/Roboto-Italic.ttf'),
    bolditalics: path.resolve(__dirname, '../../../assets/Roboto-SemiBoldItalic.ttf')
  }
}

const printer = new PdfPrinter(fonts)

// Mock de datos
// const mockPdfCreate = {
//   title: 'Establecimientos',
//   columnName: [
//     ['nombre columna1', 'claveCol1'],
//     ['nombre columna2', 'claveCol2'],
//     ['nombre columna3', 'claveCol3']
//   ],
//   data: [
//     { claveCol1: 'nombre1', claveCol2: 'nombre2', claveCol3: 'nombre3' },
//     { claveCol1: 'nombre4', claveCol2: 'nombre5', claveCol3: 'nombre6' }
//   ]
// }

const PdfCreate = async (body) => {
  let res = { status: 500, send: 'Error Interno del Servidor' }
  try {
    // ✅ Ruta absoluta al logo
    const logoPath = path.resolve(__dirname, '../../../assets/logo-pixart.png')

    const content = []

    // Logo y título SOLO en la primera página
    content.push({
      image: logoPath,
      width: 100,
      alignment: 'center',
      margin: [0, 0, 0, 10]
    })

    content.push({
      text: body.title || 'Documento',
      alignment: 'center',
      fontSize: 14,
      bold: true,
      margin: [0, 0, 0, 20]
    })

    // Datos
    body.data.forEach((e, idx) => {
      const rows = body.columnName.map((col) => [col[0], e[col[1]]])

      rows.forEach(([label, value]) => {
        content.push({
          columns: [
            { text: label, width: '40%', bold: true, fontSize: 11 },
            { text: String(value ?? 'noDisponible'), width: '60%', fontSize: 11 }
          ],
          margin: [0, 2, 0, 2]
        })
      })

      if (idx < body.data.length - 1) {
        content.push({ text: '', pageBreak: 'after' })
      }
    })

    const docDefinition = {
      content,
      defaultStyle: { fontSize: 11 }
    }
    const dirPath = `${App.dirstorage}${App.dirpdf}`
    // Crear PDF en servidor

    await new Promise((resolve, reject) => {
      const pdfDoc = printer.createPdfKitDocument(docDefinition)
      const filePath = path.resolve(dirPath, `${body?.title ?? 'Desconocido'}.pdf`)
      const stream = fs.createWriteStream(filePath)
      pdfDoc.pipe(stream)
      pdfDoc.end()
      stream.on('finish', resolve)
      stream.on('error', reject)
    })

    const getUrl = () =>
      `${App.httpHostBackendFile}:${App.httpPortBackendFile}/download${App.dirpdf}/${body?.title ?? 'Desconocido'}/pdf`

    res = {
      status: 200,
      send: { url: getUrl() } // ruta del archivo generado
    }
  } catch (err) {
    console.error('Error creando PDF:', err)
  }

  return res
}

// Ejecución de prueba
// PdfCreate(mockPdfCreate).then((r) => console.log(r))

module.exports = { PdfCreate }
