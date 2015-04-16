const domify = require('domify')
const io = require('socket.io-client')
const Webrtc2Images = require('webrtc2images')
const uuid = require('uuid')
const messageTpl = require('./templates/message.hbs')

const socket = io.connect()
const id = uuid.v4()

const rtc = new Webrtc2Images({
  width: 200,
  height: 200,
  frames: 10,
  type: 'image/jpeg',
  quality: 0.4,
  interval: 200
})

rtc.startVideo(function (err) {
  if (err) return logError(err)
})

const messages = document.querySelector('#messages')
const form = document.querySelector('form')

form.addEventListener('submit', function (e) {
  e.preventDefault()
  record()
}, false)

socket.on('message', addMessage)

socket.on('messageack', function (message) {
  if (message.id === id) {
    addMessage(message)
  }
})

socket.on('messages', function (messages) {
  messages.forEach(addMessage)
})

function record () {
  const input = document.querySelector('input[name="message"]')
  const message = input.value
  input.value = ""

  rtc.recordVideo(function (err, frames) {
    if (err) return logError(err)

    socket.emit('message', { id:id, message: message, frames: frames })
  })
}

function addMessage (message) {
  const m = messageTpl(message)
  messages.appendChild(domify(m))
  window.scrollTo(0, document.body.scrollHeight)
}

function logError (err) {
  console.error(err)
}
