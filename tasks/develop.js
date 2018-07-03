
const http = require('http')

const watch = require('watch')
const static = require('node-static')

module.exports = async (PROJECT_PATH, build, port) => {
  await build(PROJECT_PATH)
  await new Promise(res => {
    // watch
    watch.watchTree(`${PROJECT_PATH}/data`, () => {
      build(PROJECT_PATH)
    })
    watch.watchTree(`${PROJECT_PATH}/input`, () => {
      build(PROJECT_PATH)
    })
    // serve
    var fileServer = new static.Server(`${PROJECT_PATH}/output`)
    http.createServer(function (request, response) {
      request.addListener('end', function () {
        fileServer.serve(request, response)
      }).resume()
    }).listen(port)
  })
}
