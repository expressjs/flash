'use strict'

function flash (req, res, next) {
  // Let's validate that req.session is required
  if (req.session) {
    // If session.flash doesn't exists we create a new array
    if (!Array.isArray(req.session.flash)) req.session.flash = []

    res.locals.flash = req.session.flash
    req.flash = res.flash = pushMessage

    next()
  } else {
    let error = new Error('A req.session is required!')

    next(error)
  }
}

function pushMessage (type, message) {
  let res = this.res || this
  let messages = res.locals.flash
  // Let's create a new flash message to push
  let flashMessage = {
    type: message ? type : 'info',
    message: message || type
  }

  // do not allow duplicate flash messages
  let msg = messages.find(msg => msg.type === flashMessage.type && msg.message === flashMessage.message)
  if (msg) return this

  messages.push(flashMessage)
  return this
}

module.exports = flash
