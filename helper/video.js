'use strict'

const EventEmitter = require('events').EventEmitter

module.exports = function (images) {
  let events = new EventEmitter()

  setTimeout(function () {
    events.emit('video', 'this will be the encoded video')
  }, 1000)

  return events
}
