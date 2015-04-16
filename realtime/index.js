'use strict'
const socketio = require('socket.io')
const database = require('../database')
const helper = require('../helper')

module.exports = function (server) {
  const db = database()
  const io = socketio(server)
  io.on('connection', onConnection)

  function onConnection (socket) {
    console.log(`Client connected ${socket.id}`)

    db.list(function (err, messages) {
      if (err) return console.error(err)

      socket.emit('messages', messages)
    })

    socket.on('message', function (message) {
      const converter = helper.convertVideo(message.frames)

      converter.on('log', console.log)

      converter.on('video', function (video) {
        delete message.frames
        message.video = video

        // Save message
        db.save(message, function (err) {
          if (err) return console.error(err)
        })

        // Send video to everyone
        socket.broadcast.emit('message', message)

        // Send video to sender
        socket.emit('messageack', message)
      })
    })
  }
}
