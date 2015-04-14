'use strict'

const http = require('http')
const port = process.env.PORT || 8080

const server = http.createServer(onRequest)

server.listen(port, onListening)

function onRequest (req, res) {
  res.end('Hello io.js')
}

function onListening () {
  console.log('Server running in port ' + port)
}
