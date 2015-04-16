'use strict'

module.exports = function (options) {
  options = options || {}

  function save (message, callback) {
    callback()
  }

  function list (callback) {
    callback()
  }

  return {
    save: save,
    list: list
  }
}
