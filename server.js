'use strict'

const http = require('http')
const port = process.env.PORT || 8080

const server = http.createServer()

server.listen(port)
