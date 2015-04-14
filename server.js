'use strict'

const http = require('http')
const fs = require('fs')
const path = require('path')
const port = process.env.PORT || 8080

const server = http.createServer()

server.on('request', onRequest)
server.on('listening', onListening)

server.listen(port)

function onRequest (req, res) {
  let index = path.join(__dirname, 'public', 'index.html')
  fs.readFile(index, function (err, file) {
    if (err) return res.end(err.message)

    res.setHeader('Content-Type', 'text/html')
    res.end(file)
  })
}

function onListening () {
  console.log('Server running in port ' + port)
}
