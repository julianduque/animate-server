'use strict'

const level = require('level')
const uuid = require('uuid')

module.exports = function (options) {
  options = options || {}

  const db = level('./messages.db')

  function save (message, callback) {
    let key = `message-${Date.now()}-${uuid.v4()}`
    let options = {
      valueEncoding: 'json'
    }

    db.put(key, message, options, callback)
  }

  function list (callback) {
    callback()
  }

  return {
    save: save,
    list: list
  }
}
