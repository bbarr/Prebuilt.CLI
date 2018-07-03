
const netrc = require('netrc')
const request = require('request-promise')
const AdmZip = require('adm-zip')
const fs = require('fs')

module.exports = async (PROJECT_PATH, name) => {
  const zip = new AdmZip()

  zip.addLocalFolder(`${PROJECT_PATH}/input`)
  zip.addLocalFolder(`${PROJECT_PATH}/data`)
  zip.addLocalFile(`${PROJECT_PATH}/config.yaml`)

  const config = fs.readFileSync(`${PROJECT_PATH}/config.yaml`, 'utf8')

  await request.post({
    url: `${process.env.ADMIN_DOMAIN}/deploy?name=${name}&config=${encodeURIComponent(config)}&token=${netrc()['prebuilt.xyz'].token}`,
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
