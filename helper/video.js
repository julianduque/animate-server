'use strict'

const os = require('os')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')
const async = require('async')
const dataURIBuffer = require('data-uri-to-buffer')
const EventEmitter = require('events').EventEmitter
const listFiles = require('./list')
const ffmpeg = require('./ffmpeg')

module.exports = function (images) {
  let events = new EventEmitter()
  let count = 0
  let baseName = uuid.v4()
  let tmpDir = os.tmpDir()

  async.series([
    decodeImages,
    createVideo,
    encodeVideo,
    cleanup
  ], convertFinished)

  // Decode images to files
  function decodeImages (done) {
    async.eachSeries(images, decodeImage, done)
  }

  // Decode a single image
  function decodeImage (image, done) {
    let fileName = `${baseName}-${count++}.jpg`
    let buffer = dataURIBuffer(image)
    let ws = fs.createWriteStream(path.join(tmpDir, fileName))

    ws.on('error', done)
      .end(buffer, done)

    events.emit('log', `Converting ${fileName}`)
  }

  // Create video from images with ffmpeg
  function createVideo (done) {
    events.emit('log', 'Creating video')
    ffmpeg({
      baseName: baseName,
      folder: tmpDir
    }, done)
  }

  // Encode video
  function encodeVideo (done) {
    done()
  }

  // Cleanup temp folder
  function cleanup (done) {
    events.emit('log', 'Cleaning up')

    listFiles(tmpDir, baseName, function (err, files) {
      if (err) return done(err)

      // delete files
      deleteFiles(files, done)
    })
  }

  // Delete all files
  function deleteFiles (files, done) {
    async.each(files, deleteFile, done)
  }

  // Delete one file
  function deleteFile (file, done) {
    events.emit('log', `Deleting ${file}`)

    fs.unlink(path.join(tmpDir, file), function (err) {
      // ignore error

      done()
    })
  }

  // Convertion finished
  function convertFinished (err) {
    setTimeout(function () {
      events.emit('video', 'this will be the encoded video')
    }, 500)
  }

  return events
}
