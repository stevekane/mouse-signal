var MouseSignal = require('../src')
var utils = require('./utils')

var TARGETS = document.getElementsByClassName('target')
var GLOBAL = document.getElementById('global')
var LOCAL = document.getElementById('local')
var FOCUSED = TARGETS[5]
var global = new MouseSignal(document.body)
var local = new MouseSignal(FOCUSED)
var state = {
  global: global,
  local: local
}

for (var i = 0, T; T = TARGETS[i++];) {
  T.style.backgroundColor = utils.randColor(150, 256, 150, 256, 150, 256, 1)
}

FOCUSED.style.backgroundColor = 'white' 

var subChild = document.createElement('div')
subChild.style.width = '100px'
subChild.style.height = '100px'
subChild.style.backgroundColor = 'black'

FOCUSED.id = 'FOCUSED'
FOCUSED.appendChild(subChild)

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

for (var key in state.local.eventListeners) {
  FOCUSED.addEventListener(key, state.local.eventListeners[key])
}

requestAnimationFrame(function update () {
  last = current
  current = Date.now()
  dT = current - last

  MouseSignal.update(dT, state.global)
  MouseSignal.update(dT, state.local)
  doSomething()

  GLOBAL.innerText = state.global
  LOCAL.innerText = state.local

  requestAnimationFrame(update)
})
