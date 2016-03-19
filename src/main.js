function Mouser (body) {
  var self = this

  function mousemove (e) {
    self.previous[0] = self.current[0]
    self.previous[1] = self.previous[1]
    self.current[0] = e.clientX
    self.current[1] = e.clientY
  }

  function mousedown (e) {
    self.down[0] = e.clientX
    self.down[1] = e.clientY
    mousemove(e)
  }

  function mouseup (e) {
    self.up[0] = e.clientX
    self.up[1] = e.clientY
    mousemove(e)
  }

  body.addEventListener('mousemove', mousemove)
  body.addEventListener('mousedown', mousedown)
  body.addEventListener('mouseup', mouseup)
  self.down = [ 0, 0 ]
  self.up = [ 0, 0 ]
  self.previous = [ 0, 0 ]
  self.current = [ 0, 0 ]
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

function Local (el, mouser) {
  var bcr = el.getBoundingClientRect()
  var collides = bcr.left < mouser.current[0] && 
                 bcr.right > mouser.current[0] &&
                 bcr.top < mouser.current[1] &&
                 bcr.bottom > mouser.current[1]

  this.up = collides 
    ? [ mouser.up[0] - bcr.left, mouser.up[1] - bcr.top ]
    : null
  this.down = collides 
    ? [ mouser.down[0] - bcr.left, mouser.down[1] - bcr.top ]
    : null
  this.previous = collides 
    ? [ mouser.previous[0] - bcr.left, mouser.previous[1] - bcr.top ]
    : null
  this.current = collides 
    ? [ mouser.current[0] - bcr.left, mouser.current[1] - bcr.top ]
    : null
}

var TARGETS = document.getElementsByClassName('target')
var GLOBAL = document.getElementById('global')
var LOCAL = document.getElementById('local')
var FOCUSED = TARGETS[randInt(0, TARGETS.length)]
var mouser = new Mouser(document.body)
var local = new Local(FOCUSED, mouser)
var state = {
  mouser: mouser,
  local: local
}

// Setup
for (var i = 0, T; T = TARGETS[i++];) {
  T.style.backgroundColor = randColor(150, 256, 0, 0, 0, 0, 1)
}

FOCUSED.style.backgroundColor = randColor(0, 0, 0, 0, 150, 256, 1)

window.state = state
// Main loop
requestAnimationFrame(function update () {
  requestAnimationFrame(update)
  state.local = new Local(FOCUSED, state.mouser)

  GLOBAL.innerText = state.mouser.current
  LOCAL.innerText = state.local.current
})
