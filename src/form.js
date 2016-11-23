/* global alert,EmbeddedSVGEdit */
import setFrames from './interface'

var sampleSVG1
var sampleSVG2
var framacalcUrlTextBox
var svgTextBox
var calcUrl
var CsvUrl
var svgEdit
var tmpSVG

function validateCalcButtonCallback () {
  updateCalc(getCalcUrl())
}

function validateSVGButtonCallback () {
  var svgCode = getSVGCode()
  // updateSVGPreview(leSVG);
  console.log(svgEdit)

  console.log('=== before ===')
  svgEdit.svgToString()(handleSvgData)
  console.log(tmpSVG)

  console.log('=== after ===')
  svgEdit.setSvgString(sampleSVG2)
  svgEdit.svgToString()(handleSvgData)
  console.log(tmpSVG)
  return svgCode
}

function updateCalc (laUrl) {
  if (document.getElementById('calcPage') != null) {
    document.getElementById('calcPage').src = laUrl
    console.log('Framacalc charg� : ' + laUrl)
  } else {
    console.log('iframe null')
  }
}

function updateSVGPreview (leCodeSVG) {
  if (document.getElementById('svgPreview') != null) {
    document.getElementById('svgPreview').innerHTML = leCodeSVG
    console.log('SVG preview charg�')
  } else { console.log('svgPreview null') }
}

function printCSVtoConsole () {
  CsvUrl = calcUrl + '.csv'
  console.log(CsvUrl)
}

function initForm () {
  framacalcUrlTextBox = document.getElementById('framacalcUrlTextBox')
  framacalcUrlTextBox.value = 'https://framacalc.org/test-minipen'

  svgTextBox = document.getElementById('svgTextBox')
  svgTextBox.value = sampleSVG1

  var validateCalcButton = document.getElementById('validateCalcButton')
  validateCalcButton.addEventListener('click', validateCalcButtonCallback)

  var validateSVGButton = document.getElementById('validateSVGButton')
  validateSVGButton.addEventListener('click', validateSVGButtonCallback)

  var csvButton = document.getElementById('CSVbutton')
  csvButton.addEventListener('click', printCSVtoConsole)
}

function getCalcUrl () {
  return framacalcUrlTextBox.value
}

function getSVGCode () {
  return svgTextBox.value
}

function handleSvgData (data, error) {
  if (error) {
    alert('error ' + error)
  } else {
    tmpSVG = data
  }
}

export function main () {
  sampleSVG1 = '<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><!-- Created with SVG-edit - http://svg-edit.googlecode.com/ --><g><title>Layer 1</title><rect id="svg_1" height="3" width="0" y="77" x="169" stroke-width="5" stroke="#000000" fill="#FF0000"/><rect id="svg_2" height="289" width="200" y="78" x="168" stroke-width="5" stroke="#000000" fill="#FF0000"/><text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="24" id="svg_3" y="110" x="266" stroke-width="0" stroke="#000000" fill="#000000">Titre carte</text></g></svg>'

  sampleSVG2 = '<svg width="640" height="480" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><title>Layer 1</title><rect stroke-width="5" stroke="#000000" fill="#FF0000" id="svg_1" height="35" width="51" y="35" x="32"/><ellipse ry="15" rx="24" stroke-width="5" stroke="#000000" fill="#0000ff" id="svg_2" cy="60" cx="66"/></g></svg>'

  setFrames()
  initForm()
  console.log(window.frames)
  if (window.frames[1] != null) {
    svgEdit = new EmbeddedSVGEdit(window.frames[1])
    console.log(svgEdit)
  } else {
    console.log('svgedit null')
  }
}

