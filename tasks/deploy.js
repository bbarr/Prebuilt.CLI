
const netrc = require('netrc')
const request = require('request-promise')
const AdmZip = require('adm-zip')
const fs = require('fs')

const ADMIN_DOMAIN = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://admin.prebuilt.xyz'

module.exports = async (PROJECT_PATH, name) => {
  const zip = new AdmZip()

  zip.addLocalFolder(`${PROJECT_PATH}/input`, 'input')
  zip.addLocalFolder(`${PROJECT_PATH}/data`, 'data')
  zip.addLocalFile(`${PROJECT_PATH}/config.yaml`)

  await request.post({
    url: `${ADMIN_DOMAIN}/deploy?token=${netrc()['prebuilt.xyz'].token}`,
    formData: {
      package: {
        value: zip.toBuffer(),
        options: {
          filename: 'package.zip',
          contentType: 'application/zip'
        }
      }
    }
  })
}
