/* global alert */
import setFrames from './interface.js'
import Svg from './svg.js'
import Carte from './carte.js'

var sampleSVG1
var sampleSVG2
var framacalcUrlTextBox
var svgTextBox
var calcUrl
var CsvUrl
var svgFileInput
var currentSVGContent

// Variables pour la gestion des modèles
var modelNameInput
var saveModelButton
var modelsList
var savedModels = {} // Stockage des modèles en mémoire

// Variables pour la génération de cartes
var cardLineInput
var generateCardButton
var generatedCardsList
var modelSelector
var generatedCards = {} // Stockage des cartes générées en mémoire
var csvData = null // Données CSV chargées
var csvHeaders = [] // En-têtes des colonnes CSV
var cardCounter = 0 // Compteur pour les cartes générées

// Variables pour la planche de cartes
var sheetGrid
var sheetSelectors
var sheetNameInput
var saveSheetButton
var sheetsList
var savedSheets = {} // Stockage des planches sauvegardées
var currentSheet = new Array(9).fill(null) // Planche actuelle (9 cartes)
var currentModel = null // Modèle actuellement affiché
var currentCard = null // Carte actuellement affichée

function validateCalcButtonCallback () {
  updateCalc(getCalcUrl())
  // Charger les données CSV pour la génération de cartes
  setTimeout(() => {
    loadCSVData()
  }, 1000) // Attendre un peu que l'iframe se charge
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
  // Fonctionnalité désactivée - à implémenter
  alert('Fonctionnalité à venir : Sauvegarde locale depuis l\'API de Framacalc')
}

function initForm () {
  // Attendre que le DOM soit chargé
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initForm)
    return
  }

  framacalcUrlTextBox = document.getElementById('framacalcUrlTextBox')
  if (!framacalcUrlTextBox) {
    console.error('framacalcUrlTextBox not found')
    return
  }
  framacalcUrlTextBox.value = 'https://framacalc.org/test-minipen'

  svgTextBox = document.getElementById('svgTextBox')
  if (!svgTextBox) {
    console.error('svgTextBox not found')
    return
  }
  svgTextBox.value = sampleSVG1
  svgTextBox.readOnly = false  // S'assurer que le textarea n'est pas en lecture seule

  svgFileInput = document.getElementById('svgFileInput')
  if (svgFileInput) {
    svgFileInput.addEventListener('change', handleSVGFileSelect)
  }

  // Initialisation des éléments des onglets
  initTabs()
  initModelsManagement()
  initCardGeneration()
  initSheetManagement()

  var validateCalcButton = document.getElementById('validateCalcButton')
  if (validateCalcButton) {
  validateCalcButton.addEventListener('click', validateCalcButtonCallback)
  } else {
    console.error('validateCalcButton not found')
  }

  var validateSVGButton = document.getElementById('validateSVGButton')
  if (validateSVGButton) {
  validateSVGButton.addEventListener('click', validateSVGButtonCallback)
  }

  var loadSVGButton = document.getElementById('loadSVGButton')
  if (loadSVGButton) {
    loadSVGButton.addEventListener('click', loadSelectedSVGFile)
  }

  var csvButton = document.getElementById('CSVbutton')
  if (csvButton) {
  csvButton.addEventListener('click', printCSVtoConsole)
  }

  // Les éléments de génération de cartes seront initialisés dans initCardGeneration

  console.log('Form initialized successfully')
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
  
  // Ajouter un modèle par défaut si aucun n'existe
  setTimeout(() => {
    if (Object.keys(savedModels).length === 0) {
      savedModels['Modèle par défaut'] = sampleSVG1
      localStorage.setItem('savedModels', JSON.stringify(savedModels))
      updateModelSelector()
      console.log('Modèle par défaut ajouté')
    }
  }, 500)
  
  // Chargement automatique du Framacalc au démarrage
  setTimeout(() => {
    console.log('Chargement automatique du Framacalc...')
    validateCalcButtonCallback()
  }, 2000) // Attendre 2 secondes que tout soit initialisé
  
  // Exposer les fonctions au scope global pour les onclick
  window.viewSVG = viewSVG
  window.downloadSVG = downloadSVG
  window.viewModel = viewModel
  window.downloadModel = downloadModel
  window.viewGeneratedCard = viewGeneratedCard
  window.downloadGeneratedCard = downloadGeneratedCard
  window.loadModel = loadModel
  window.deleteModel = deleteModel
  window.loadGeneratedCard = loadGeneratedCard
  window.deleteGeneratedCard = deleteGeneratedCard
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

// ===== GESTION DES ONGLETS =====

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button')
  const tabContents = document.querySelectorAll('.tab-content')
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab')
      
      // Désactiver tous les onglets
      tabButtons.forEach(btn => btn.classList.remove('active'))
      tabContents.forEach(content => content.classList.remove('active'))
      
      // Activer l'onglet sélectionné
      this.classList.add('active')
      document.getElementById(targetTab + '-tab').classList.add('active')
      
      // Changer le contenu SVG selon l'onglet
      switchTabContent(targetTab)
    })
  })
}

function switchTabContent(tabName) {
  const svgTitle = document.getElementById('svgTitle')
  
  switch(tabName) {
    case 'models':
      if (currentModel && savedModels[currentModel]) {
        loadSVGInIframe(savedModels[currentModel])
        svgTitle.textContent = `Modèle : ${currentModel}`
      } else {
        svgTitle.textContent = 'Modèle : Aucun'
        loadSVGInIframe('')
      }
      break
    case 'generation':
      if (currentCard && generatedCards[currentCard]) {
        loadSVGInIframe(generatedCards[currentCard])
        svgTitle.textContent = `Carte : ${currentCard}`
      } else {
        svgTitle.textContent = 'Carte : Aucune'
        loadSVGInIframe('')
      }
      break
    case 'sheet':
      svgTitle.textContent = 'Planche de cartes'
      loadSVGInIframe('')
      break
  }
}

// ===== GESTION DES MODÈLES =====

function initModelsManagement() {
  modelNameInput = document.getElementById('modelNameInput')
  saveModelButton = document.getElementById('saveModelButton')
  modelsList = document.getElementById('modelsList')
  
  // Événements pour la gestion des modèles
  saveModelButton.addEventListener('click', saveModel)
  
  // Charger les modèles sauvegardés depuis localStorage
  loadSavedModels()
}

function saveModel() {
  const modelName = modelNameInput.value.trim()
  const svgContent = svgTextBox.value.trim()
  
  if (!modelName) {
    alert('Veuillez entrer un nom pour le modèle')
    return
  }
  
  if (!svgContent) {
    alert('Veuillez d\'abord charger ou saisir du code SVG')
    return
  }
  
  // Sauvegarder le modèle
  savedModels[modelName] = svgContent
  localStorage.setItem('savedModels', JSON.stringify(savedModels))
  
  // Mettre à jour l'affichage
  updateModelsList()
  
  // Mettre à jour le sélecteur de modèles dans l'onglet génération
  updateModelSelector()
  
  // Vider le champ nom
  modelNameInput.value = ''
  
  console.log('Modèle sauvegardé:', modelName)
}

function loadModel(modelName) {
  if (savedModels[modelName]) {
    svgTextBox.value = savedModels[modelName]
    currentModel = modelName
    loadSVGInIframe(savedModels[modelName])
    updateSVGTitle('models', modelName)
    console.log('Modèle chargé:', modelName)
  }
}

function deleteModel(modelName) {
  if (confirm('Êtes-vous sûr de vouloir supprimer le modèle "' + modelName + '" ?')) {
    delete savedModels[modelName]
    localStorage.setItem('savedModels', JSON.stringify(savedModels))
    updateModelsList()
    console.log('Modèle supprimé:', modelName)
  }
}

function updateModelsList() {
  const models = Object.keys(savedModels)
  
  if (models.length === 0) {
    modelsList.innerHTML = '<p style="color: #666; font-style: italic;">Aucun modèle sauvegardé</p>'
    return
  }
  
  modelsList.innerHTML = models.map(modelName => `
    <div class="model-item" data-model="${modelName}">
      <span class="model-name" onclick="loadModel('${modelName}')">${modelName}</span>
      <div class="model-actions">
        <button class="view-svg" onclick="viewModel('${modelName}')" title="Voir le SVG dans un nouvel onglet">👁️</button>
        <button class="download-svg" onclick="downloadModel('${modelName}')" title="Télécharger le fichier SVG">💾</button>
        <button class="delete-model" onclick="deleteModel('${modelName}')" title="Supprimer le modèle">🗑️</button>
      </div>
    </div>
  `).join('')
}

function loadSavedModels() {
  const saved = localStorage.getItem('savedModels')
  if (saved) {
    try {
      savedModels = JSON.parse(saved)
      updateModelsList()
      // Mettre à jour le sélecteur de modèles dans l'onglet génération
      updateModelSelector()
    } catch (e) {
      console.error('Erreur lors du chargement des modèles:', e)
      savedModels = {}
    }
  }
}

// ===== GÉNÉRATION DE CARTES =====

function initCardGeneration() {
  generatedCardsList = document.getElementById('generatedCardsList')
  modelSelector = document.getElementById('modelSelector')
  
  // Initialiser les éléments de génération de cartes
  cardLineInput = document.getElementById('cardLineInput')
  generateCardButton = document.getElementById('generateCardButton')
  
  if (generateCardButton) {
    generateCardButton.addEventListener('click', generateCard)
    console.log('Bouton de génération de cartes initialisé')
  } else {
    console.error('generateCardButton not found')
  }
  
  // Charger les cartes générées depuis localStorage
  loadGeneratedCards()
  
  // Mettre à jour le sélecteur de modèles après chargement des modèles
  setTimeout(() => {
    updateModelSelector()
  }, 100)
}

function updateModelSelector() {
  if (!modelSelector) return
  
  // Vider le sélecteur
  modelSelector.innerHTML = '<option value="">Sélectionner un modèle</option>'
  
  // Ajouter les modèles disponibles
  Object.keys(savedModels).forEach(modelName => {
    const option = document.createElement('option')
    option.value = modelName
    option.textContent = modelName
    modelSelector.appendChild(option)
  })
  
  console.log('Sélecteur de modèles mis à jour:', Object.keys(savedModels).length, 'modèles')
}

function generateCard() {
  console.log('=== DÉBUT GÉNÉRATION CARTE ===')
  const lineNumber = parseInt(cardLineInput.value)
  const selectedModel = modelSelector.value
  
  console.log('Ligne sélectionnée:', lineNumber)
  console.log('Modèle sélectionné:', selectedModel)
  console.log('Données CSV disponibles:', !!csvData, csvData ? csvData.length : 0)
  console.log('En-têtes CSV:', csvHeaders)
  console.log('Modèles sauvegardés:', Object.keys(savedModels))
  
  if (!csvData || !csvHeaders.length) {
    alert('Veuillez d\'abord charger des données CSV en cliquant sur "VALIDER CSV"')
    return
  }
  
  if (!selectedModel) {
    alert('Veuillez sélectionner un modèle')
    return
  }
  
  if (lineNumber < 1 || lineNumber > csvData.length) {
    alert('Numéro de ligne invalide. Veuillez choisir entre 1 et ' + csvData.length)
    return
  }
  
  // Récupérer la ligne CSV
  const csvLine = csvData[lineNumber - 1]
  
  // Utiliser le modèle sélectionné - créer directement l'élément DOM
  const svgTemplate = new Svg()
  const svgElement = document.createElement('div')
  svgElement.innerHTML = savedModels[selectedModel]
  svgTemplate.svgElement = svgElement.querySelector('svg')
  
  // Créer la carte
  const carte = new Carte(csvHeaders, csvLine, svgTemplate)
  
  // Générer un nom unique pour la carte
  cardCounter++
  const cardName = `${selectedModel} - Ligne ${lineNumber} (${cardCounter})`
  
  // Sauvegarder la carte
  generatedCards[cardName] = {
    name: cardName,
    svgContent: carte.getSvgText(),
    lineNumber: lineNumber,
    csvLine: csvLine,
    modelName: selectedModel
  }
  
  // Sauvegarder dans localStorage
  localStorage.setItem('generatedCards', JSON.stringify(generatedCards))
  
  // Mettre à jour l'affichage
  updateGeneratedCardsList()
  
  // Charger la carte générée dans l'iframe
  loadGeneratedCard(cardName)
  
  console.log('Carte générée:', cardName, 'avec modèle:', selectedModel)
}

// ===== FONCTIONS D'EXPORT SVG =====

function viewSVG(svgContent, title) {
  // Extraire seulement le contenu SVG (sans les balises HTML)
  let pureSVG = svgContent
  if (svgContent.includes('<svg')) {
    // Extraire le SVG depuis le contenu HTML
    const svgMatch = svgContent.match(/<svg[^>]*>[\s\S]*<\/svg>/i)
    if (svgMatch) {
      pureSVG = svgMatch[0]
    }
  }
  
  // Créer un blob avec le SVG pur
  const blob = new Blob([pureSVG], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  
  // Ouvrir directement le SVG dans un nouvel onglet
  const newWindow = window.open(url, '_blank', 'width=800,height=600')
  
  // Nettoyer l'URL après un délai
  setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 1000)
}

function downloadSVG(svgContent, filename) {
  // Créer un blob avec le contenu SVG
  const blob = new Blob([svgContent], { type: 'image/svg+xml' })
  
  // Créer un lien de téléchargement
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename.endsWith('.svg') ? filename : filename + '.svg'
  
  // Déclencher le téléchargement
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Libérer l'URL
  URL.revokeObjectURL(url)
}

function viewGeneratedCard(cardName) {
  if (generatedCards[cardName]) {
    const cardData = generatedCards[cardName]
    const svgContent = typeof cardData === 'string' ? cardData : cardData.svgContent
    viewSVG(svgContent, cardName)
  }
}

function downloadGeneratedCard(cardName) {
  if (generatedCards[cardName]) {
    const cardData = generatedCards[cardName]
    const svgContent = typeof cardData === 'string' ? cardData : cardData.svgContent
    const filename = cardName.replace(/[^a-zA-Z0-9\s-]/g, '_') // Nettoyer le nom de fichier
    downloadSVG(svgContent, filename)
  }
}

function viewModel(modelName) {
  if (savedModels[modelName]) {
    viewSVG(savedModels[modelName], `Modèle: ${modelName}`)
  }
}

function downloadModel(modelName) {
  if (savedModels[modelName]) {
    const filename = `Modele_${modelName.replace(/[^a-zA-Z0-9\s-]/g, '_')}`
    downloadSVG(savedModels[modelName], filename)
  }
}

function loadGeneratedCard(cardName) {
  if (generatedCards[cardName]) {
    currentCard = cardName
    const cardData = generatedCards[cardName]
    // Si c'est un objet avec svgContent, utiliser svgContent, sinon utiliser directement
    const svgContent = typeof cardData === 'string' ? cardData : cardData.svgContent
    loadSVGInIframe(svgContent)
    updateSVGTitle('generation', cardName)
    console.log('Carte générée chargée:', cardName)
  }
}

function deleteGeneratedCard(cardName) {
  if (confirm('Êtes-vous sûr de vouloir supprimer la carte "' + cardName + '" ?')) {
    delete generatedCards[cardName]
    localStorage.setItem('generatedCards', JSON.stringify(generatedCards))
    updateGeneratedCardsList()
    console.log('Carte générée supprimée:', cardName)
  }
}

function updateGeneratedCardsList() {
  const cards = Object.keys(generatedCards)
  
  if (cards.length === 0) {
    generatedCardsList.innerHTML = '<p style="color: #666; font-style: italic;">Aucune carte générée</p>'
  } else {
    generatedCardsList.innerHTML = cards.map(cardName => `
      <div class="model-item" data-card="${cardName}">
        <span class="model-name" onclick="loadGeneratedCard('${cardName}')">${cardName}</span>
        <div class="model-actions">
          <button class="view-svg" onclick="viewGeneratedCard('${cardName}')" title="Voir le SVG dans un nouvel onglet">👁️</button>
          <button class="download-svg" onclick="downloadGeneratedCard('${cardName}')" title="Télécharger le fichier SVG">💾</button>
          <button class="delete-model" onclick="deleteGeneratedCard('${cardName}')" title="Supprimer la carte">🗑️</button>
        </div>
      </div>
    `).join('')
  }
  
  // Mettre à jour les sélecteurs de la planche
  updateSheetSelectors()
}

function loadGeneratedCards() {
  const saved = localStorage.getItem('generatedCards')
  if (saved) {
    try {
      generatedCards = JSON.parse(saved)
      updateGeneratedCardsList()
    } catch (e) {
      console.error('Erreur lors du chargement des cartes générées:', e)
      generatedCards = {}
    }
  }
}

// Fonction pour charger les données CSV (à appeler depuis validateCalcButtonCallback)
function loadCSVData() {
  // Toujours charger les données de test pour l'instant
  console.log('Chargement des données CSV de test...')
  
  // Données de test simulées
  csvHeaders = ['Titre carte', 'type animal', 'habitat']
  csvData = [
    ['Carte 1', 'Lion', 'Savane'],
    ['Carte 2', 'Tigre', 'Jungle'],
    ['Carte 3', 'Ours', 'Forêt'],
    ['Carte 4', 'Pingouin', 'Antarctique'],
    ['Carte 5', 'Dauphin', 'Océan']
  ]
  
  console.log('Données CSV chargées:', csvHeaders, csvData)
  console.log('Nombre de lignes disponibles:', csvData.length)
  
  // Mettre à jour l'input de ligne avec la valeur maximale
  if (cardLineInput) {
    cardLineInput.max = csvData.length
    cardLineInput.placeholder = `1-${csvData.length}`
  }
}

// ===== GESTION DE LA PLANCHE DE CARTES =====

function initSheetManagement() {
  sheetSelectors = document.getElementById('sheetSelectors')
  sheetNameInput = document.getElementById('sheetNameInput')
  saveSheetButton = document.getElementById('saveSheetButton')
  sheetsList = document.getElementById('sheetsList')
  
  // Événements pour la gestion des planches
  saveSheetButton.addEventListener('click', saveSheet)
  
  // Initialiser la grille 3x3
  initSheetGrid()
  
  // Charger les planches sauvegardées
  loadSavedSheets()
}

function initSheetGrid() {
  // Créer la grille 3x3 des sélecteurs
  sheetSelectors.innerHTML = ''
  for (let i = 0; i < 9; i++) {
    const selectDiv = document.createElement('div')
    selectDiv.innerHTML = `
      <select class="sheet-selector" id="sheet-selector-${i}" onchange="updateSheetCard(${i})">
        <option value="">Sélectionner une carte</option>
      </select>
    `
    sheetSelectors.appendChild(selectDiv)
  }
  
  // Mettre à jour les options des sélecteurs
  updateSheetSelectors()
}

function updateSheetSelectors() {
  const allCards = Object.keys(generatedCards)
  
  for (let i = 0; i < 9; i++) {
    const selector = document.getElementById(`sheet-selector-${i}`)
    if (selector) {
      // Garder la première option vide
      const emptyOption = selector.querySelector('option[value=""]')
      selector.innerHTML = ''
      selector.appendChild(emptyOption)
      
      // Ajouter toutes les cartes générées
      allCards.forEach(cardName => {
        const option = document.createElement('option')
        option.value = cardName
        option.textContent = cardName
        selector.appendChild(option)
      })
    }
  }
}

function updateSheetCard(index) {
  const selector = document.getElementById(`sheet-selector-${index}`)
  
  if (selector) {
    const selectedCard = selector.value
    currentSheet[index] = selectedCard || null
    console.log(`Position ${index} mise à jour avec:`, selectedCard)
  }
}

function saveSheet() {
  const sheetName = sheetNameInput.value.trim()
  
  if (!sheetName) {
    alert('Veuillez entrer un nom pour la planche')
    return
  }
  
  // Vérifier qu'il y a au moins une carte
  const hasCards = currentSheet.some(card => card !== null)
  if (!hasCards) {
    alert('Veuillez sélectionner au moins une carte pour la planche')
    return
  }
  
  // Sauvegarder la planche
  savedSheets[sheetName] = [...currentSheet]
  localStorage.setItem('savedSheets', JSON.stringify(savedSheets))
  
  // Mettre à jour l'affichage
  updateSheetsList()
  
  // Vider le champ nom
  sheetNameInput.value = ''
  
  console.log('Planche sauvegardée:', sheetName)
}

function loadSheet(sheetName) {
  if (savedSheets[sheetName]) {
    currentSheet = [...savedSheets[sheetName]]
    
    // Mettre à jour les sélecteurs
    for (let i = 0; i < 9; i++) {
      const selector = document.getElementById(`sheet-selector-${i}`)
      
      if (selector) {
        const cardName = currentSheet[i]
        selector.value = cardName || ''
      }
    }
    
    console.log('Planche chargée:', sheetName)
  }
}

function deleteSheet(sheetName) {
  if (confirm('Êtes-vous sûr de vouloir supprimer la planche "' + sheetName + '" ?')) {
    delete savedSheets[sheetName]
    localStorage.setItem('savedSheets', JSON.stringify(savedSheets))
    updateSheetsList()
    console.log('Planche supprimée:', sheetName)
  }
}

function updateSheetsList() {
  const sheets = Object.keys(savedSheets)
  
  if (sheets.length === 0) {
    sheetsList.innerHTML = '<p style="color: #666; font-style: italic;">Aucune planche sauvegardée</p>'
    return
  }
  
  sheetsList.innerHTML = sheets.map(sheetName => `
    <div class="model-item" data-sheet="${sheetName}">
      <span class="model-name" onclick="loadSheet('${sheetName}')">${sheetName}</span>
      <button class="delete-model" onclick="deleteSheet('${sheetName}')" title="Supprimer la planche">🗑️</button>
    </div>
  `).join('')
}

function loadSavedSheets() {
  const saved = localStorage.getItem('savedSheets')
  if (saved) {
    try {
      savedSheets = JSON.parse(saved)
      updateSheetsList()
    } catch (e) {
      console.error('Erreur lors du chargement des planches:', e)
      savedSheets = {}
    }
  }
}

function updateSVGTitle(tabType, itemName) {
  const svgTitle = document.getElementById('svgTitle')
  
  switch(tabType) {
    case 'models':
      svgTitle.textContent = `Modèle : ${itemName}`
      break
    case 'generation':
      svgTitle.textContent = `Carte : ${itemName}`
      break
    case 'sheet':
      svgTitle.textContent = 'Planche de cartes'
      break
  }
}

// Exposer les fonctions globalement pour les événements onclick
window.loadModel = loadModel
window.deleteModel = deleteModel
window.loadGeneratedCard = loadGeneratedCard
window.deleteGeneratedCard = deleteGeneratedCard
window.loadSheet = loadSheet
window.deleteSheet = deleteSheet
window.updateSheetCard = updateSheetCard

