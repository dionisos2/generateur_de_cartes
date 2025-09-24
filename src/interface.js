
// EXTENSION DES IFRAMES AU SURVOL

function activate (domElement) {
  domElement.width = '90%'
  domElement.height = '700px'
}

function desactivate (domElement) {
  domElement.width = '30%'  // Augmenté de 5% à 30%
  domElement.height = '400px'  // Augmenté de 250px à 400px
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

  // Comportement de repli désactivé - les iframes gardent leur taille fixe
  // frameCalc.addEventListener('mouseover', function () { activateCalc(frameCalc, frameSvg) })
  // frameSvg.addEventListener('mouseover', function () { activateSvg(frameCalc, frameSvg) })
  
  // Taille fixe pour les deux iframes - layout 50/50
  frameCalc.width = '100%'
  frameCalc.height = '600px'
  frameSvg.width = '100%'
  frameSvg.height = '600px'
}

