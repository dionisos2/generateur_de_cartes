
// EXTENSION DES IFRAMES AU SURVOL

function activate (domElement) {
  domElement.width = '90%'
  domElement.height = '700px'
}

function desactivate (domElement) {
  domElement.width = '5%'
  domElement.height = '250px'
}

function activateCalc (frameCalc, frameSvg) {
  activate(frameCalc)
  desactivate(frameSvg)
}

function activateSvg (frameCalc, frameSvg) {
  activate(frameSvg)
  desactivate(frameCalc)
}

export default function setFrames () {
  var frameCalc
  var frameSvg

  frameCalc = document.getElementById('calcPage')
  frameSvg = document.getElementById('svgPage')

  frameCalc.addEventListener('mouseover', function () { activateCalc(frameCalc, frameSvg) })
  frameSvg.addEventListener('mouseover', function () { activateSvg(frameCalc, frameSvg) })
}

