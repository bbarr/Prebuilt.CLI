
const netrc = require('netrc')
const request = require('request-promise')
const AdmZip = require('adm-zip')
const fs = require('fs')

module.exports = async (PROJECT_PATH, name) => {
  const zip = new AdmZip()

  zip.addLocalFolder(`${PROJECT_PATH}/input`, 'input')
  zip.addLocalFolder(`${PROJECT_PATH}/data`, 'data')
  zip.addLocalFile(`${PROJECT_PATH}/config.yaml`)

  await request.post({
    url: `${process.env.ADMIN_DOMAIN}/deploy?token=${netrc()['prebuilt.xyz'].token}`,
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
