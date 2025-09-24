/* global alert */
import setFrames from './interface.js'

var sampleSVG1
var sampleSVG2
var framacalcUrlTextBox
var svgTextBox
var calcUrl
var CsvUrl
var svgFileInput
var currentSVGContent

function validateCalcButtonCallback () {
  updateCalc(getCalcUrl())
}

function validateSVGButtonCallback () {
  var svgCode = getSVGCode()
  
  if (svgCode && svgCode.trim()) {
    console.log('=== Chargement du code SVG depuis la zone de texte ===')
    console.log(svgCode)
    loadSVGInIframe(svgCode)
  } else {
    alert('Veuillez saisir du code SVG dans la zone de texte')
  }
  
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

// function updateSVGPreview (leCodeSVG) {
//   if (document.getElementById('svgPreview') != null) {
//     document.getElementById('svgPreview').innerHTML = leCodeSVG
//     console.log('SVG preview charg�')
//   } else { console.log('svgPreview null') }
// }

function printCSVtoConsole () {
  CsvUrl = calcUrl + '.csv'
  console.log(CsvUrl)
}

function initForm () {
  framacalcUrlTextBox = document.getElementById('framacalcUrlTextBox')
  framacalcUrlTextBox.value = 'https://framacalc.org/test-minipen'

  svgTextBox = document.getElementById('svgTextBox')
  svgTextBox.value = sampleSVG1
  svgTextBox.readOnly = false  // S'assurer que le textarea n'est pas en lecture seule

  svgFileInput = document.getElementById('svgFileInput')
  svgFileInput.addEventListener('change', handleSVGFileSelect)

  var validateCalcButton = document.getElementById('validateCalcButton')
  validateCalcButton.addEventListener('click', validateCalcButtonCallback)

  var validateSVGButton = document.getElementById('validateSVGButton')
  validateSVGButton.addEventListener('click', validateSVGButtonCallback)

  var loadSVGButton = document.getElementById('loadSVGButton')
  loadSVGButton.addEventListener('click', loadSelectedSVGFile)

  var csvButton = document.getElementById('CSVbutton')
  csvButton.addEventListener('click', printCSVtoConsole)
}

function getCalcUrl () {
  return framacalcUrlTextBox.value
}

function getSVGCode () {
  return svgTextBox.value
}


export function main () {
  sampleSVG1 = '<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><!-- Created with SVG-edit - http://svg-edit.googlecode.com/ --><g><title>Layer 1</title><rect id="svg_1" height="3" width="0" y="77" x="169" stroke-width="5" stroke="#000000" fill="#FF0000"/><rect id="svg_2" height="289" width="200" y="78" x="168" stroke-width="5" stroke="#000000" fill="#FF0000"/><text xml:space="preserve" text-anchor="middle" font-family="serif" font-size="24" id="svg_3" y="110" x="266" stroke-width="0" stroke="#000000" fill="#000000">Titre carte</text></g></svg>'

  sampleSVG2 = '<svg width="640" height="480" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><g><title>Layer 1</title><rect stroke-width="5" stroke="#000000" fill="#FF0000" id="svg_1" height="35" width="51" y="35" x="32"/><ellipse ry="15" rx="24" stroke-width="5" stroke="#000000" fill="#0000ff" id="svg_2" cy="60" cx="66"/></g></svg>'

  setFrames()
  initForm()
  
  // Load default SVG
  loadSVGInIframe(sampleSVG1)
}

// Fonction pour charger un SVG dans l'iframe
function loadSVGInIframe(svgContent) {
  const iframe = document.getElementById('svgPage')
  if (!iframe) {
    console.error('SVG iframe not found')
    return
  }
  
  // Créer un document HTML avec le SVG
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>SVG Viewer</title>
        <style>
            body {
                margin: 0;
                padding: 10px;
                background: #f0f0f0;
                font-family: Arial, sans-serif;
            }
            .svg-container {
                background: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 10px;
                text-align: center;
            }
            svg {
                max-width: 100%;
                max-height: 100%;
                border: 1px solid #ddd;
            }
        </style>
    </head>
    <body>
        <div class="svg-container">
            <h3>Fichier SVG</h3>
            ${svgContent}
        </div>
    </body>
    </html>
  `
  
  // Écrire le contenu dans l'iframe
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
  iframeDoc.open()
  iframeDoc.write(htmlContent)
  iframeDoc.close()
  
  currentSVGContent = svgContent
  console.log('SVG loaded in iframe')
}

// Gestionnaire pour la sélection de fichier SVG
function handleSVGFileSelect(event) {
  const file = event.target.files[0]
  if (file && file.type === 'image/svg+xml') {
    const reader = new FileReader()
    reader.onload = function(e) {
      const svgContent = e.target.result
      console.log('=== Chargement du fichier SVG ===')
      console.log('Fichier:', file.name)
      console.log('Taille:', file.size, 'bytes')
      
      // Charger dans l'iframe
      loadSVGInIframe(svgContent)
      
      // Aussi mettre à jour la zone de texte
      svgTextBox.value = svgContent
    }
    reader.readAsText(file)
  } else {
    alert('Veuillez sélectionner un fichier SVG valide (.svg)')
  }
}

// Fonction pour charger le fichier SVG sélectionné
function loadSelectedSVGFile() {
  if (svgFileInput.files.length > 0) {
    console.log('=== Chargement du fichier SVG sélectionné ===')
    handleSVGFileSelect({ target: svgFileInput })
  } else {
    alert('Veuillez d\'abord sélectionner un fichier SVG en cliquant sur "Choisir un fichier"')
  }
}

