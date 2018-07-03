
const uuid = require('uuid/v1')
const request = require('request-promise')

module.exports = async (email) => {

  const nonce = uuid()

  await request.get({
    url: `${process.env.ADMIN_DOMAIN}/auth/magic/request?email=${email}&nonce=${nonce}`
  })

  return new Promise(res => {
      
    const poll = async () => {
      const token = await request.get({ 
        url: `${process.env.ADMIN_DOMAIN}/auth/magic/poll?nonce=${nonce}`
      })
      if (token !== 'false') {
        res(token)
      } else setTimeout(poll, 2000)
    }

    poll()
  })
}
