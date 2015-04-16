'use strict'

const level = require('level')
const ttl = require('level-ttl')
const uuid = require('uuid')
const concat = require('concat-stream')

module.exports = function (options) {
  options = options || {}

  let duration = options.duration || 10 * 60 * 1000
  let limit = options.limit || 10

  const db = ttl(level('./messages.db'), { checkFrequency: 10000 })

  function save (message, callback) {
    let key = `message-${Date.now()}-${uuid.v4()}`
    let options = {
      valueEncoding: 'json',
      ttl: duration
    }

    db.put(key, message, options, callback)
  }

  function list (callback) {
    let rs = db.createValueStream({
      limit: limit,
      valueEncoding: 'json',
      reverse: true,
      gt: 'message'
    })

    rs.pipe(concat(function (messages) {
      callback(null, messages.reverse())
    }))

    rs.on('error', callback)
  }

  return {
    save: save,
    list: list
  }
}
