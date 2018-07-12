
const uuid = require('uuid/v1')
const request = require('request-promise')

const ADMIN_DOMAIN = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'http://admin.prebuilt.xyz'

module.exports = async (email) => {

  const nonce = uuid()

  await request.get({
    url: `${ADMIN_DOMAIN}/auth/magic/request?email=${email}&nonce=${nonce}`
  })

  return new Promise(res => {
      
    const poll = async () => {
      const token = await request.get({ 
        url: `${ADMIN_DOMAIN}/auth/magic/poll?nonce=${nonce}`
      })
      if (token !== 'false') {
        res(token)
      } else setTimeout(poll, 2000)
    }

    poll()
  })
}
