var MouseSignal = require('../src')
var utils = require('./utils')

var TARGETS = document.getElementsByClassName('target')
var GLOBAL = document.getElementById('global')
var LOCAL = document.getElementById('local')
var FOCUSED = TARGETS[5]
var global = new MouseSignal(document.body)
//var local = new MouseSignal.Scoped(FOCUSED)
var state = {
  global: global,
  local: local
}

for (var i = 0, T; T = TARGETS[i++];) {
  T.style.backgroundColor = utils.randColor(150, 256, 150, 256, 150, 256, 1)
}

FOCUSED.style.backgroundColor = 'white' 

var last = Date.now()
var current = Date.now()
var dT = current - last

function doSomething () {
  if (state.global.left.mode.JUST_UP) {
    console.log(state.global.left.downDuration)
    if (state.global.left.downDuration > 2000) {
      console.log('You held that thing like a boss') 
    }
    else {
      console.log('held for ' + state.global.left.downDuration)  
    }
  }
}

for (var key in state.global.eventListeners) {
  document.body.addEventListener(key, state.global.eventListeners[key])
}

requestAnimationFrame(function update () {
  last = current
  current = Date.now()
  dT = current - last

  MouseSignal.update(dT, state.global)
  doSomething()

  GLOBAL.innerText = state.global.toString()
  //LOCAL.innerText = JSON.stringify(state.local, replacer, 2)

  requestAnimationFrame(update)
})
window.state = state
