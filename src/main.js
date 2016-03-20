var MOUSE_MODE = Enum(
  'INACTIVE',
  'ACTIVE',
  'JUST_DOWN',
  'DOWN',
  'JUST_UP'
)

function Enum () {
  var values = Array.prototype.slice.call(arguments, 0)
  var en = {}

  for (var i = 0, v; v = values[i++];) {
    en[v] = v
  }
  return en
}

function MouseState (el) {
  this.el = el
  this.mode = MOUSE_MODE.INACTIVE
  this.previousMode = MOUSE_MODE.INACTIVE
  this.downDuration = 0
  this.down = [ 0, 0 ]
  this.up = [ 0, 0 ]
  this.previous = [ 0, 0 ]
  this.current = [ 0, 0 ]
}

function updateMouser (dT, mouser) {
  if      (mouser.previousMode === MOUSE_MODE.JUST_DOWN) mouser.mode = MOUSE_MODE.DOWN 
  else if (mouser.previousMode === MOUSE_MODE.JUST_UP)   mouser.mode = MOUSE_MODE.ACTIVE
  else {}
  mouser.downDuration = mouser.mode === MOUSE_MODE.DOWN ? mouser.downDuration + dT : 0
  mouser.previous[0] = mouser.current[0]
  mouser.previous[1] = mouser.current[1]
  mouser.previousMode = mouser.mode
}

function Mouser (body) {
  var self = this

  function mousemove (e) {
    if (self.mode === MOUSE_MODE.INACTIVE) self.mode = MOUSE_MODE.ACTIVE
    self.current[0] = e.clientX
    self.current[1] = e.clientY
  }

  function mouseenter (e) {
    self.mode = MOUSE_MODE.ACTIVE
  }

  function mouseleave (e) {
    self.mode = MOUSE_MODE.INACTIVE
  }

  function blur () {
    self.mode = MOUSE_MODE.INACTIVE
  }

  function mousedown (e) {
    e.preventDefault()
    if (self.mode !== MOUSE_MODE.JUST_DOWN) self.mode = MOUSE_MODE.JUST_DOWN
    self.down[0] = e.clientX
    self.down[1] = e.clientY
  }

  function mouseup (e) {
    self.mode = MOUSE_MODE.JUST_UP
    self.up[0] = e.clientX
    self.up[1] = e.clientY
  }

  body.addEventListener('mousemove', mousemove)
  body.addEventListener('mousedown', mousedown)
  body.addEventListener('mouseup', mouseup)
  body.addEventListener('mouseenter', mouseenter)
  body.addEventListener('mouseleave', mouseleave)
  body.addEventListener('blur', blur)
  MouseState.call(this, body)
}

function randInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

function randColor (minR, maxR, minG, maxG, minB, maxB, alpha) {
  return 'rgba(' + 
         randInt(minR, maxR) + ', ' + 
         randInt(minG, maxG) + ', ' +
         randInt(minB, maxB) + ', ' +
         alpha + 
         ')'
}

function collidesBcrPoint (bcr, pt) {
  return bcr.left < pt[0] && 
         bcr.right > pt[0] &&
         bcr.top < pt[1] &&
         bcr.bottom > pt[1]
}

function getLocalX (bcr, pt) {
  return Math.round(pt[0] - bcr.left)
}

function getLocalY (bcr, pt) {
  return Math.round(pt[1] - bcr.top)
}

function updateMouseState (dT, mouser, ms) {
  var bcr = local.el.getBoundingClientRect()  
  var collides = collidesBcrPoint(bcr, mouser.current)

  if (!collides) {
    ms.mode = MOUSE_MODE.INACTIVE  
    ms.downDuration = 0
  }
  else {
    if      (ms.previousMode === MOUSE_MODE.INACTIVE)                                   ms.mode = MOUSE_MODE.ACTIVE
    else if (mouser.mode === MOUSE_MODE.JUST_DOWN)                                      ms.mode = MOUSE_MODE.JUST_DOWN
    else if (mouser.mode === MOUSE_MODE.JUST_UP && ms.previousMode === MOUSE_MODE.DOWN) ms.mode = MOUSE_MODE.JUST_UP
    else if (ms.previousMode === MOUSE_MODE.JUST_DOWN)                                  ms.mode = MOUSE_MODE.DOWN
    else if (ms.previousMode === MOUSE_MODE.JUST_UP)                                    ms.mode = MOUSE_MODE.ACTIVE
    else                                                                                ms.mode = ms.mode
    ms.downDuration = ms.previousMode === MOUSE_MODE.DOWN ? ms.downDuration + dT : 0
    ms.up[0] = getLocalX(bcr, mouser.up) 
    ms.up[1] = getLocalY(bcr, mouser.up)
    ms.down[0] = getLocalX(bcr, mouser.down)
    ms.down[1] = getLocalY(bcr, mouser.down)
    ms.previous[0] = getLocalX(bcr, mouser.previous)
    ms.previous[1] = getLocalY(bcr, mouser.previous)
    ms.current[0] = getLocalX(bcr, mouser.current)
    ms.current[1] = getLocalY(bcr, mouser.current)
  }
  ms.previousMode = ms.mode
}

var TARGETS = document.getElementsByClassName('target')
var GLOBAL = document.getElementById('global')
var LOCAL = document.getElementById('local')
var FOCUSED = TARGETS[randInt(0, TARGETS.length)]
var mouser = new Mouser(document.body)
var local = new MouseState(FOCUSED)
var state = {
  mouser: mouser,
  local: local
}

for (var i = 0, T; T = TARGETS[i++];) {
  T.style.backgroundColor = randColor(150, 256, 0, 0, 0, 0, 1)
}

FOCUSED.style.backgroundColor = randColor(0, 0, 0, 0, 150, 256, 1)

var last = Date.now()
var current = Date.now()
var dT = current - last

function doSomething () {
  if (state.local.mode === MOUSE_MODE.JUST_UP) {
    if (state.local.downDuration > 2000) {
      console.log('You held that thing like a boss') 
    }
    else {
      console.log('held for ' + state.local.downDuration)  
    }
  }
}

function replacer (key, value) {
  return value instanceof HTMLElement ? value.toString() : value
}

requestAnimationFrame(function update () {
  last = current
  current = Date.now()
  dT = current - last

  updateMouser(dT, state.mouser)
  updateMouseState(dT, state.mouser, state.local)
  doSomething()

  GLOBAL.innerText = JSON.stringify(state.mouser, replacer, 2)
  LOCAL.innerText = JSON.stringify(state.local, replacer, 2)

  requestAnimationFrame(update)
})
window.state = state
