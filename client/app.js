const xhr = require('xhr')
const domify = require('domify')
const Webrtc2Images = require('webrtc2images')
const messageTpl = require('./templates/message.hbs')

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


function record () {
  const input = document.querySelector('input[name="message"]')
  const message = input.value
  input.value = ""

  rtc.recordVideo(function (err, frames) {
    if (err) return logError(err)

    xhr({
      uri: '/process',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: frames }),
    }, function (err, res, body) {
      if (err) return logError(err)

      body = JSON.parse(body)

      if (body.video) {
        addMessage({ message: message, video: body.video })
      }
    })

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
