module.exports.randInt = randInt
module.exports.randColor = randColor

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
