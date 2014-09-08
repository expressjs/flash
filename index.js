
var assert = require('assert')

module.exports = function () {
  return function (req, res, next) {
    assert(req.session, 'a req.session is required!')
    res.locals.flash = req.session.flash = req.session.flash || []
    req.flash = res.flash = push
    next()
  }
}

function push(type, msg) {
  if (!msg) {
    msg = type
    type = 'info'
  }
  var res = this.res || this
  res.locals.flash.push({
    type: type,
    message: msg,
  })
  return this
}
