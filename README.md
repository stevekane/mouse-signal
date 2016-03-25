# MouseSignal

Wrap mouse events emitted by the browser and transform them into a data structure that can be queried in an intuitive way.

## Queries

Queries are simple.  Ask the mouse signal instance for their mode and duration that a button has been held down for. 

## API

This package exports a single constructor.  You can create a global listener and attach it to the body or create a local listener and attach it only to some specific dom node or both!  The module also exports a function that you will need to call yourself in your "update-loop" for this system to behave as expected.

```javascript
var ms = new MouseSignal(HTMLElement) // This is most often your document body

function update () {
  MouseSignal.update(dT, kbs) // dT is determined by you.  pass 0 if you don't care about downDuration for keys
  requestAnimationFrame(update)
}
```

## Example usage

```javascript
var ms = new MouseSignal(document.body)
var last = Date.now()
var current = Date.now()
var dT = current - last

for (var key in ms.eventListeners) {
  document.body.addEventListener(key, ms.eventListeners[key])
}

return function update (dT) {
  last = current
  current = Date.now()
  dT = current - last

  MouseSignal.update(dT, ms)

  if (ms.left.mode.JUST_UP && ms.left.downDuration >= 0) console.log('fire the missiles')

  requestAnimationFrame(update)
}
```

## FAQ
### Is there a similar module for handling the keyboard?
Yes there is.  The sister module [KeyboardSignal ](https://github.com/stevekane/keyboard-signal) will handle keyboard events.

### Why do I have to provide a dT parameter myself?
This application assumes you're running your code with a run-loop.  It also assumes you likely already have a clock-like mechanism defined according to your preferences.  Thus, you are expected to proude and provide the dT parameter if you would like to be able to track the duration a key has been held down.  If you don't care about that feature, just pass 0 and the system will not track downDuration for keys.

### Why do I have to bind the eventListeners myself?
I do not want to require you to tear this system down using a custom destructor or any other adhoc system like that.  JS has no standardized approach to freeing resources and I don't wish to impose one on you.  Finally, and more importantly, I want you to be free to choose HOW and WHEN to bind your event listeners.  For example, in React.js or a similar Virtual DOM library, you may want to bind them in your React components and allow React itself to unbind them when that component is no longer being rendered.  An example of this common case is included below.

```javascript
import React from 'react'
import DOM from 'react-dom'

const ms = new MouseSignal(document.body)

DOM.render(<div {...ms.eventListeners} id="app-root"></div>, document.body)
```
