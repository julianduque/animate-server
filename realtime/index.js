'use strict'
const socketio = require('socket.io')
const helper = require('../helper')

module.exports = function (server) {
  const io = socketio(server)
  io.on('connection', onConnection)

  function onConnection (socket) {
    console.log(`Client connected ${socket.id}`)

    socket.on('message', function (message) {
      const converter = helper.convertVideo(message.frames)

      converter.on('log', console.log)

      converter.on('video', function (video) {
        delete message.frames
        message.video = video

        // Send video to everyone
        socket.broadcast.emit('message', message)

        // Send video to sender
        socket.emit('messageack', message)
      })
    })
  }
}
