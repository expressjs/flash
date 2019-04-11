'use strict'

const session = require('cookie-session')
const request = require('supertest')
const express = require('express')
const assert = require('assert')

let flash = require('..')

describe('Flash', function () {
  before('instance express app and use session middleware', function () {
    this.app = express()

    this.app.use(session({
      keys: ['a', 'b']
    }))
  })

  it('should set .locals.flash and .session.flash', function (done) {
    let { app } = this

    app.use(flash)

    app.use(function (req, res) {
      assert(Array.isArray(res.locals.flash))
      assert(Array.isArray(req.session.flash))
      assert.equal(res.locals.flash, req.session.flash)
      res.end()
    })

    request(app)
      .get('/')
      .expect(200, done)
  })

  it('should push messages via req.flash()', function (done) {
    let { app } = this

    app.use(flash)

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
      assert.equal(res.locals.flash, req.session.flash)
      res.end()
    })

    request(app)
      .get('/')
      .expect(200, done)
  })

  it('should not allow duplicate flash messages', function (done) {
    let { app } = this

    app.use(flash)

    app.use(function (req, res) {
      req.flash('one')
      req.flash('one')
      assert.deepEqual(res.locals.flash, [{
        type: 'info',
        message: 'one'
      }])
      assert.equal(res.locals.flash, req.session.flash)
      res.end()
    })

    request(app)
      .get('/')
      .expect(200, done)
  })

  it('should overwrite non-array flash locals', function (done) {
    let { app } = this

    app.use(function (req, res, next) {
      req.session.flash = {}
      next()
    })
    app.use(flash)

    app.use(function (req, res) {
      req.flash('one')
      req.flash('one')
      assert.deepEqual(res.locals.flash, [{
        type: 'info',
        message: 'one'
      }])
      assert.equal(res.locals.flash, req.session.flash)
      res.end()
    })

    request(app)
      .get('/')
      .expect(200, done)
  })

  it('should support res.flash()', function (done) {
    let { app } = this

    app.use(flash)

    app.use(function (req, res) {
      res.flash('one')
      res.flash('one')
      assert.deepEqual(res.locals.flash, [{
        type: 'info',
        message: 'one'
      }])
      assert.equal(res.locals.flash, req.session.flash)
      res.end()
    })

    request(app)
      .get('/')
      .expect(200, done)
  })
})
