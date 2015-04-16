'use strict'

const path = require('path')
const course = require('course')
const st = require('st')
const jsonBody = require('body/json')
const animateClient = require('animate-client')
const helper = require('../helper')

const router = course()
const mount = st({
  path: animateClient,
  index: 'index.html',
  passthrough: true
})

function onRequest (req, res) {
  if (req.url.startsWith('/socket.io')) return

  mount(req, res, function (err) {
    if (err) return fail(err, res)

    router(req, res, function (err) {
      if (err) return fail(err, res)

      res.statusCode = 404
      res.end(`404 Not Found: ${req.url}`)
    })
  })
}

function fail (err, res) {
  res.statusCode = 500
  res.setHeader('Content-Type', 'text/plain')
  res.end(err.message)
}

module.exports = onRequest
