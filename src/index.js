var Enum = require('tiny-enum')
var BUTTON_MODE = new Enum('UP', 'JUST_DOWN', 'DOWN', 'JUST_UP')

module.exports = MouseSignal

function ButtonState () {
  this.mode = BUTTON_MODE.UP
  this.nextMode = BUTTON_MODE.UP
  this.down = [ 0, 0 ]
  this.up = [ 0, 0 ]
  this.downDuration = 0
}

function MouseSignal () {
  var self = this

  function mouseenter (e) {
    self.active = true
  }

  function mouseleave (e) {
    self.active = false
  }

  function blur () {
    self.active = false
  }

  function focus () {
    self.active = true 
  }

  function mousemove (e) {
    var bcr = this.getBoundingClientRect()
    var x = e.clientX - bcr.left
    var y = e.clientY - bcr.top

    self.active = true
    self.current[0] = x
    self.current[1] = y
  }

  function mousedown (e) {
    var bcr = this.getBoundingClientRect()
    var x = e.clientX - bcr.left
    var y = e.clientY - bcr.top

    self.active = true
    self.left.nextMode = BUTTON_MODE.DOWN
    self.left.down[0] = x
    self.left.down[1] = y
    e.preventDefault()
  }

  function mouseup (e) {
    var bcr = this.getBoundingClientRect()
    var x = e.clientX - bcr.left
    var y = e.clientY - bcr.top

    self.active = true
    self.left.up[0] = x
    self.left.up[1] = y
    self.left.nextMode = BUTTON_MODE.UP
  }

  this.active = false
  this.left = new ButtonState
  this.previous = [ 0, 0 ]
  this.current = [ 0, 0 ]
  this.eventListeners = {
    mousemove: mousemove,
    mousedown: mousedown,
    mouseup: mouseup,
    mouseenter: mouseenter,
    mouseleave: mouseleave,
    blur: blur,
    focus: focus
  }
}

MouseSignal.ButtonState = ButtonState

MouseSignal.BUTTON_MODE = BUTTON_MODE

MouseSignal.update = function update (dT, ms) {
  ms.previous[0] = ms.current[0]
  ms.previous[1] = ms.current[1]

  if      (!ms.active)                                  ms.left.mode = BUTTON_MODE.UP
  else if (ms.left.mode.JUST_DOWN)                      ms.left.mode = BUTTON_MODE.DOWN
  else if (ms.left.mode.JUST_UP)                        ms.left.mode = BUTTON_MODE.UP
  else if (ms.left.nextMode.DOWN && !ms.left.mode.DOWN) ms.left.mode = BUTTON_MODE.JUST_DOWN
  else if (ms.left.nextMode.UP && !ms.left.mode.UP)     ms.left.mode = BUTTON_MODE.JUST_UP
  else                                                  ms.left.mode = ms.left.nextMode

  if   (!ms.active || ms.left.mode.UP || ms.left.mode.JUST_DOWN) ms.left.downDuration = 0
  else                                                           ms.left.downDuration += dT

  return ms
}

MouseSignal.prototype.toString = function () {
  var isActive = this.active
  var prev = 'x: ' + this.previous[0] + ' y: ' + this.previous[1]
  var current = 'x: ' + this.current[0] + ' y: ' + this.current[1]
  var leftBtnNextMode = this.left.nextMode.toString() 
  var leftBtnMode = this.left.mode.toString() 
  var leftdn = 'x: ' + this.left.down[0] + ' y: ' + this.left.down[1]
  var leftup = 'x: ' + this.left.up[0] + ' y: ' + this.left.up[1]
  var leftduration = this.left.downDuration 

  return 'ACTIVE: ' + isActive +
         '\nPREVIOUS: ' + prev +
         '\nCURRENT: ' + current +
         '\nLEFT-BUTTON' +
         '\n-- NEXT_MODE: ' + leftBtnNextMode +
         '\n-- THIS_MODE: ' + leftBtnMode +
         '\n-- HELD_FOR(ms): ' + leftduration +
         '\n-- DOWN: ' + leftdn +
         '\n-- UP: ' + leftup
}
