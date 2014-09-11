
var session = require('cookie-session')
var request = require('supertest')
var express = require('express')
var assert = require('assert')

var flash = require('..')

describe('Flash', function () {
  it('should set .locals.flash and .session.flash', function (done) {
    var app = express()
    app.use(session({
      keys: ['a', 'b']
    }))
    app.use(flash())

    app.use(function (req, res) {
      assert(Array.isArray(res.locals.flash))
      assert(Array.isArray(req.session.flash))
      assert.equal(res.locals.flash, req.session.flash)
      res.end()
    })

    request(app.listen())
    .get('/')
    .expect(200, done)
  })

  it('should push messages via req.flash()', function (done) {
    var app = express()
    app.use(session({
      keys: ['a', 'b']
    }))
    app.use(flash())

    app.use(function (req, res) {
      req.flash('one')
      req.flash('error', 'two')
      assert.deepEqual(res.locals.flash, [{
        type: 'info',
        message: 'one'
      }, {
        type: 'error',
        message: 'two'
      }])
      res.end()
    })

    request(app.listen())
    .get('/')
    .expect(200, done)
  })

  it('should not allow duplicate flash messages', function (done) {
    var app = express()
    app.use(session({
      keys: ['a', 'b']
    }))
    app.use(flash())

    app.use(function (req, res) {
      req.flash('one')
      req.flash('one')
      assert.deepEqual(res.locals.flash, [{
        type: 'info',
        message: 'one'
      }])
      res.end()
    })

    request(app.listen())
    .get('/')
    .expect(200, done)
  })

  it('should overwrite non-array flash locals', function (done) {
    var app = express()
    app.use(session({
      keys: ['a', 'b']
    }))
    app.use(function (req, res, next) {
      req.session.flash = {}
      next()
    })
    app.use(flash())

    app.use(function (req, res) {
      req.flash('one')
      req.flash('one')
      assert.deepEqual(res.locals.flash, [{
        type: 'info',
        message: 'one'
      }])
      res.end()
    })

    request(app.listen())
    .get('/')
    .expect(200, done)
  })

  it('should support res.flash()', function (done) {
    var app = express()
    app.use(session({
      keys: ['a', 'b']
    }))
    app.use(flash())

    app.use(function (req, res) {
      res.flash('one')
      res.flash('one')
      assert.deepEqual(res.locals.flash, [{
        type: 'info',
        message: 'one'
      }])
      res.end()
    })

    request(app.listen())
    .get('/')
    .expect(200, done)
  })
})
