
// EXTENSION DES IFRAMES AU SURVOL

var frameCalc
var frameSvg

function activate (cible) {
  cible.width = '90%'
  cible.height = '700px'
}

function desactivate (cible) {
  cible.width = '5%'
  cible.height = '250px'
}

function activateCalc () {
  activate(frameCalc)
  desactivate(frameSvg)
}

function activateSvg () {
  activate(frameSvg)
  desactivate(frameCalc)
}

function setFrames () {
  frameCalc = document.getElementById('calcPage')
  frameSvg = document.getElementById('svgPage')

  frameCalc.addEventListener('mouseover', activateCalc)
  frameSvg.addEventListener('mouseover', activateSvg)
}

