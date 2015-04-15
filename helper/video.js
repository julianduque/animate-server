'use strict'

const async = require('async')
const EventEmitter = require('events').EventEmitter

module.exports = function (images) {
  let events = new EventEmitter()

  async.series([
    decodeImages,
    createVideo,
    encodeVideo,
    cleanup
  ], convertFinished)

  // Decode images to files
  function decodeImages (done) {
    done()
  }

  // Create video from images with ffmpeg
  function createVideo (done) {
    done()
  }

  // Encode video
  function encodeVideo (done) {
    done()
  }

  // Cleanup temp folder
  function cleanup (done) {
    done()
  }

  // Convertion finished
  function convertFinished (err) {
    setTimeout(function () {
      events.emit('video', 'this will be the encoded video')
    }, 500)
  }

  return events
}
