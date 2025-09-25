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

// Template SVG pour la planche 3x3
var sheetTemplate = `
<svg width="300" height="450" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450">
  <defs>
    <style>
      .card-slot { fill: #f8f9fa; stroke: #dee2e6; stroke-width: 2; }
      .card-slot.empty { fill: #e9ecef; stroke: #adb5bd; stroke-dasharray: 5,5; }
      .card-content { transform-origin: center; }
    </style>
  </defs>
  
  <!-- Grille 3x3 des cartes -->
  <g id="sheet-grid">
    <!-- Ligne 1 -->
    <rect id="slot-0" class="card-slot empty" x="10" y="10" width="63" height="88" rx="4"/>
    <rect id="slot-1" class="card-slot empty" x="90" y="10" width="63" height="88" rx="4"/>
    <rect id="slot-2" class="card-slot empty" x="170" y="10" width="63" height="88" rx="4"/>
    
    <!-- Ligne 2 -->
    <rect id="slot-3" class="card-slot empty" x="10" y="120" width="63" height="88" rx="4"/>
    <rect id="slot-4" class="card-slot empty" x="90" y="120" width="63" height="88" rx="4"/>
    <rect id="slot-5" class="card-slot empty" x="170" y="120" width="63" height="88" rx="4"/>
    
    <!-- Ligne 3 -->
    <rect id="slot-6" class="card-slot empty" x="10" y="230" width="63" height="88" rx="4"/>
    <rect id="slot-7" class="card-slot empty" x="90" y="230" width="63" height="88" rx="4"/>
    <rect id="slot-8" class="card-slot empty" x="170" y="230" width="63" height="88" rx="4"/>
  </g>
  
  <!-- Zone pour les cartes -->
  <g id="cards-container">
    <!-- Les cartes seront insérées ici dynamiquement -->
  </g>
</svg>`
var currentModel = null // Modèle actuellement affiché
var currentCard = null // Carte actuellement affichée
var currentImage = null // Image actuellement affichée
var currentText = null // Texte actuellement affiché

// Variables pour les images sources
var imageFileInput
var imageNameInput
var uploadImageButton
var imagesList
var savedImages = {} // Stockage des images en mémoire (IndexedDB)

// Variables pour les textes sources
var textFileInput
var textNameInput
var uploadTextButton
var textsList
var savedTexts = {} // Stockage des textes en mémoire (IndexedDB)

// IndexedDB
var db = null

function validateCalcButtonCallback () {
  console.log('=== DÉBUT validateCalcButtonCallback ===')
  const calcUrl = getCalcUrl()
  console.log('URL Framacalc:', calcUrl)
  
  updateCalc(calcUrl)
  
  // Charger les données CSV pour la génération de cartes
  setTimeout(() => {
    console.log('Chargement des données CSV depuis validateCalcButtonCallback...')
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

  var reloadDataButton = document.getElementById('reloadDataButton')
  if (reloadDataButton) {
    reloadDataButton.addEventListener('click', function() {
      console.log('=== RECHARGEMENT MANUEL DES DONNÉES ===')
      loadCSVData()
    })
  } else {
    console.error('reloadDataButton not found')
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
  
  // Initialiser IndexedDB et les nouveaux onglets
  initIndexedDB().then(() => {
    console.log('IndexedDB initialisé avec succès')
    initImagesManagement()
    initTextsManagement()
    
    // Initialiser le redimensionnement des colonnes
    initResizeHandle()
    
    // Initialiser les contrôles de zoom
    initZoomControls()
  }).catch(e => {
    console.error('Erreur initialisation IndexedDB:', e)
    showDataStatus('❌ Erreur initialisation base de données', 'error')
  })
  
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
    
    // Charger les données CSV après le chargement de l'iframe
    setTimeout(() => {
      console.log('Chargement des données CSV...')
      loadCSVData()
    }, 3000) // Attendre 3 secondes supplémentaires pour que l'iframe se charge
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

// Fonction pour charger un SVG directement dans le conteneur
function loadSVGInIframe(svgContent) {
  const contentDisplay = document.getElementById('contentDisplay')
  const container = document.getElementById('svgContainer')
  if (!contentDisplay || !container) {
    console.error('Éléments de contenu non trouvés')
    return
  }
  
  // Créer le contenu HTML directement
  const htmlContent = `
    <div class="svg-container" style="background: white; border: 2px solid #ddd; border-radius: 8px; padding: 20px; text-align: center; box-shadow: 0 4px 8px rgba(0,0,0,0.1); max-width: 100%; max-height: 100%;">
      ${svgContent}
    </div>
  `
  
  // Charger le contenu directement
  contentDisplay.innerHTML = htmlContent
  
  // Centrer le contenu après chargement
  setTimeout(() => {
    centerContentInContainer(container)
  }, 100)
  
  currentSVGContent = svgContent
  console.log('SVG chargé directement dans le conteneur')
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
  const svgTitleText = document.getElementById('svgTitleText')
  if (!svgTitleText) return
  
  switch(tabName) {
    case 'models':
      if (currentModel && savedModels[currentModel]) {
        loadSVGInIframe(savedModels[currentModel])
        svgTitleText.textContent = `Modèle : ${currentModel}`
      } else {
        svgTitleText.textContent = 'Modèle : Aucun'
        loadSVGInIframe('')
      }
      break
    case 'generation':
      if (currentCard && generatedCards[currentCard]) {
        // Gérer les objets complexes dans generatedCards
        const cardData = generatedCards[currentCard]
        const svgContent = typeof cardData === 'string' ? cardData : cardData.svgContent
        loadSVGInIframe(svgContent)
        svgTitleText.textContent = `Carte : ${currentCard}`
      } else {
        svgTitleText.textContent = 'Carte : Aucune'
        loadSVGInIframe('')
      }
      break
    case 'sheet':
      svgTitleText.textContent = 'Planche de cartes'
      updateSheetDisplay()
      break
    case 'images':
      if (currentImage && savedImages[currentImage]) {
        loadImageInSVGArea(savedImages[currentImage], currentImage)
        svgTitleText.textContent = `Image : ${currentImage}`
      } else {
        svgTitleText.textContent = 'Image : Aucune'
        loadSVGInIframe('')
      }
      break
    case 'texts':
      if (currentText && savedTexts[currentText]) {
        loadTextInSVGArea(savedTexts[currentText], currentText)
        svgTitleText.textContent = `Texte : ${currentText}`
      } else {
        svgTitleText.textContent = 'Texte : Aucun'
        loadSVGInIframe('')
      }
      break
    default:
      svgTitleText.textContent = 'Aucun contenu sélectionné'
      loadSVGInIframe('')
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
  const svgNode = svgElement.querySelector('svg')
  
  console.log('Modèle sélectionné:', selectedModel)
  console.log('Contenu du modèle:', savedModels[selectedModel].substring(0, 200) + '...')
  console.log('SVG trouvé:', svgNode)
  
  if (!svgNode) {
    alert('Erreur: Le modèle sélectionné ne contient pas de SVG valide')
    return
  }
  
  svgTemplate.svgElement = svgNode
  
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
  console.log('=== DÉBUT loadCSVData ===')
  console.log('URL Framacalc actuelle:', framacalcUrlTextBox ? framacalcUrlTextBox.value : 'undefined')
  
  // Essayer d'abord l'API Framacalc
  tryLoadFromFramacalcAPI()
}

function tryLoadFromFramacalcAPI() {
  try {
    // Récupérer l'URL de Framacalc
    const framacalcUrl = framacalcUrlTextBox.value.trim()
    console.log('URL Framacalc détectée:', framacalcUrl)
    
    if (!framacalcUrl || framacalcUrl === ' ' || framacalcUrl === '') {
      console.log('Aucune URL Framacalc fournie, utilisation des données de test')
      loadTestData()
      return
    }
    
    // Même pour l'URL de test, essayer de charger les vraies données
    console.log('Tentative de chargement des données depuis:', framacalcUrl)
    
    // Construire l'URL de l'API CSV
    const csvUrl = framacalcUrl.replace(/\/$/, '') + '.csv'
    console.log('Tentative de chargement depuis:', csvUrl)
    
    // Charger les données CSV via fetch
    console.log('Début du fetch vers:', csvUrl)
    fetch(csvUrl)
      .then(function(response) {
        console.log('Réponse reçue:', response.status, response.statusText)
        if (!response.ok) {
          throw new Error('HTTP ' + response.status + ': ' + response.statusText)
        }
        return response.text()
      })
      .then(function(csvText) {
        console.log('Données CSV récupérées (premiers 200 caractères):', csvText.substring(0, 200) + '...')
        console.log('Longueur totale du CSV:', csvText.length)
        parseCSVData(csvText)
      })
      .catch(function(error) {
        console.error('Erreur lors du chargement via API Framacalc:', error)
        console.log('Tentative de chargement manuel...')
        showManualDataInput()
      })
    
  } catch (error) {
    console.error('Erreur lors du chargement via API Framacalc:', error)
    console.log('Tentative de chargement manuel...')
    showManualDataInput()
  }
}

function parseCSVData(csvText) {
  try {
    console.log('=== DÉBUT parseCSVData ===')
    console.log('Texte CSV reçu (premiers 500 caractères):', csvText.substring(0, 500))
    
    const lines = csvText.split('\n').filter(line => line.trim().length > 0)
    console.log('Lignes après filtrage:', lines.length)
    console.log('Lignes:', lines)
    
    if (lines.length < 2) {
      throw new Error('Pas assez de lignes dans le CSV')
    }
    
    // Première ligne = en-têtes
    csvHeaders = lines[0].split(',').map(header => header.trim().replace(/"/g, ''))
    console.log('En-têtes extraits:', csvHeaders)
    
    // Lignes suivantes = données
    csvData = lines.slice(1).map(line => {
      return line.split(',').map(cell => cell.trim().replace(/"/g, ''))
    }).filter(row => row.some(cell => cell.length > 0))
    
    console.log('=== DONNÉES CSV PARSÉES ===')
    console.log('En-têtes:', csvHeaders)
    console.log('Données:', csvData)
    console.log('Nombre de lignes disponibles:', csvData.length)
    
    // Mettre à jour l'input de ligne
    if (cardLineInput) {
      cardLineInput.max = csvData.length
      cardLineInput.placeholder = `1-${csvData.length}`
    }
    
    // Afficher le succès
    if (csvData.length > 0) {
      console.log(`✅ ${csvData.length} lignes chargées depuis Framacalc`)
      showDataStatus(`✅ ${csvData.length} lignes chargées depuis Framacalc`, 'success')
    } else {
      throw new Error('Aucune donnée valide trouvée')
    }
    
  } catch (error) {
    console.error('Erreur lors du parsing CSV:', error)
    showManualDataInput()
  }
}

function showManualDataInput() {
  console.log('Affichage de l\'interface de saisie manuelle...')
  
  // Créer une interface pour saisir les données manuellement
  const manualDiv = document.createElement('div')
  manualDiv.id = 'manualDataInput'
  manualDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border: 2px solid #007bff;
    border-radius: 10px;
    padding: 20px;
    z-index: 2000;
    max-width: 80vw;
    max-height: 80vh;
    overflow: auto;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  `
  
  manualDiv.innerHTML = `
    <h3>📊 Saisie des Données CSV</h3>
    <p>Impossible de charger automatiquement depuis Framacalc. Veuillez coller vos données CSV :</p>
    <textarea id="csvTextarea" placeholder="Collez ici vos données CSV (en-têtes sur la première ligne)..." 
              style="width: 100%; height: 200px; font-family: monospace; font-size: 12px; margin: 10px 0;"></textarea>
    <div style="text-align: right; margin-top: 10px;">
      <button onclick="loadFromManualInput()" style="background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-right: 10px;">Charger les Données</button>
      <button onclick="closeManualInput()" style="background: #6c757d; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Annuler</button>
    </div>
  `
  
  document.body.appendChild(manualDiv)
  
  // Exposer les fonctions globalement
  window.loadFromManualInput = loadFromManualInput
  window.closeManualInput = closeManualInput
}

function loadFromManualInput() {
  const csvText = document.getElementById('csvTextarea').value.trim()
  if (!csvText) {
    alert('Veuillez saisir des données CSV')
    return
  }
  
  parseCSVData(csvText)
  closeManualInput()
}

function closeManualInput() {
  const manualDiv = document.getElementById('manualDataInput')
  if (manualDiv) {
    manualDiv.remove()
  }
}

function loadTestData() {
  console.log('Chargement des données de test en fallback...')
  
  // Données de test simulées
  csvHeaders = ['Titre carte', 'type animal', 'habitat']
  csvData = [
    ['Carte 1', 'Lion', 'Savane'],
    ['Carte 2', 'Tigre', 'Jungle'],
    ['Carte 3', 'Ours', 'Forêt'],
    ['Carte 4', 'Pingouin', 'Antarctique'],
    ['Carte 5', 'Dauphin', 'Océan']
  ]
  
  console.log('Données de test chargées:', csvHeaders, csvData)
  console.log('Nombre de lignes disponibles:', csvData.length)
  
  // Mettre à jour l'input de ligne avec la valeur maximale
  if (cardLineInput) {
    cardLineInput.max = csvData.length
    cardLineInput.placeholder = `1-${csvData.length}`
  }
}

function showDataStatus(message, type) {
  // Créer ou mettre à jour l'indicateur de statut
  let statusDiv = document.getElementById('dataStatus')
  if (!statusDiv) {
    statusDiv = document.createElement('div')
    statusDiv.id = 'dataStatus'
    statusDiv.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      padding: 10px 15px;
      border-radius: 5px;
      font-weight: bold;
      z-index: 1000;
      max-width: 300px;
      word-wrap: break-word;
    `
    document.body.appendChild(statusDiv)
  }
  
  // Appliquer le style selon le type
  if (type === 'success') {
    statusDiv.style.backgroundColor = '#d4edda'
    statusDiv.style.color = '#155724'
    statusDiv.style.border = '1px solid #c3e6cb'
  } else if (type === 'warning') {
    statusDiv.style.backgroundColor = '#fff3cd'
    statusDiv.style.color = '#856404'
    statusDiv.style.border = '1px solid #ffeaa7'
  } else if (type === 'error') {
    statusDiv.style.backgroundColor = '#f8d7da'
    statusDiv.style.color = '#721c24'
    statusDiv.style.border = '1px solid #f5c6cb'
  }
  
  statusDiv.textContent = message
  
  // Faire disparaître le message après 5 secondes
  setTimeout(() => {
    if (statusDiv) {
      statusDiv.style.opacity = '0'
      statusDiv.style.transition = 'opacity 0.5s'
      setTimeout(() => {
        if (statusDiv && statusDiv.parentNode) {
          statusDiv.parentNode.removeChild(statusDiv)
        }
      }, 500)
    }
  }, 5000)
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
    
    // Mettre à jour l'affichage de la planche si on est sur l'onglet sheet
    const activeTab = document.querySelector('.tab-button.active')
    if (activeTab && activeTab.dataset.tab === 'sheet') {
      updateSheetDisplay()
    }
  }
}

// Fonction pour mettre à jour l'affichage de la planche
function updateSheetDisplay() {
  const contentDisplay = document.getElementById('contentDisplay')
  const container = document.getElementById('svgContainer')
  if (!contentDisplay || !container) {
    console.error('Éléments de contenu non trouvés')
    return
  }
  
  // Créer une copie du template
  let sheetSVG = sheetTemplate
  
  // Remplacer les slots vides par des slots occupés et ajouter les cartes
  for (let i = 0; i < 9; i++) {
    const cardName = currentSheet[i]
    const slotId = `slot-${i}`
    
    console.log(`Slot ${i}: cardName="${cardName}", slotId="${slotId}"`)
    
    if (cardName && generatedCards[cardName]) {
      // Remplacer la classe "empty" par "filled"
      sheetSVG = sheetSVG.replace(
        `id="${slotId}" class="card-slot empty"`,
        `id="${slotId}" class="card-slot"`
      )
      
      // Récupérer le contenu SVG de la carte
      const cardData = generatedCards[cardName]
      const cardSVG = typeof cardData === 'string' ? cardData : cardData.svgContent
      
      if (cardSVG) {
        // Extraire le contenu SVG (sans les balises <svg>)
        const svgMatch = cardSVG.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
        const svgContent = svgMatch ? svgMatch[1] : cardSVG
        
        // Calculer la position et la taille pour cette carte
        const x = 10 + (i % 3) * 80 // Position exacte du slot
        const y = 10 + Math.floor(i / 3) * 110 // Position exacte du slot
        const width = 63 // Largeur exacte du slot
        const height = 88 // Hauteur exacte du slot
        
        console.log(`Carte ${i} (${cardName}): position=(${x}, ${y}), dimensions=${width}x${height}`)
        
        // Ajouter la carte dans le conteneur
        // Extraire les dimensions réelles du SVG
        const widthMatch = cardSVG.match(/width="([^"]*)"/)
        const heightMatch = cardSVG.match(/height="([^"]*)"/)
        const viewBoxMatch = cardSVG.match(/viewBox="([^"]*)"/)
        
        let svgWidth = 640 // Valeur par défaut
        let svgHeight = 480 // Valeur par défaut
        
        if (widthMatch && heightMatch) {
          svgWidth = parseFloat(widthMatch[1])
          svgHeight = parseFloat(heightMatch[1])
        } else if (viewBoxMatch) {
          const viewBox = viewBoxMatch[1].split(/\s+/)
          if (viewBox.length >= 4) {
            svgWidth = parseFloat(viewBox[2])
            svgHeight = parseFloat(viewBox[3])
          }
        }
        
        console.log(`Dimensions SVG détectées: ${svgWidth}x${svgHeight}`)
        
        // Positionner et redimensionner la carte en préservant l'aspect ratio
        const scaleX = width / svgWidth
        const scaleY = height / svgHeight
        const uniformScale = Math.min(scaleX, scaleY) // Utiliser le plus petit scale pour préserver l'aspect ratio
        
        console.log(`Scale calculé: scaleX=${scaleX}, scaleY=${scaleY}, uniformScale=${uniformScale}`)
        
        const cardElement = `
          <g id="card-${i}" class="card-content" transform="translate(${x}, ${y})">
            <g transform="scale(${uniformScale})">
              ${svgContent}
            </g>
          </g>`
        
        // Insérer la carte avant la fermeture du conteneur
        sheetSVG = sheetSVG.replace('</g>\n</svg>', `${cardElement}\n  </g>\n</svg>`)
      }
    }
  }
  
  // Créer le contenu HTML avec le SVG de la planche
  const htmlContent = `
    <div class="sheet-container" style="max-width: 100%; max-height: 100%; text-align: center;">
      ${sheetSVG}
    </div>
  `
  
  // Charger le contenu
  contentDisplay.innerHTML = htmlContent
  
  // Centrer le contenu après chargement
  setTimeout(() => {
    centerContentInContainer(container)
  }, 100)
  
  console.log('Planche mise à jour avec les cartes sélectionnées')
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
    
    // Mettre à jour l'affichage de la planche si on est sur l'onglet sheet
    const activeTab = document.querySelector('.tab-button.active')
    if (activeTab && activeTab.dataset.tab === 'sheet') {
      updateSheetDisplay()
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
      <div class="model-actions">
        <button class="view-svg" onclick="event.stopPropagation(); viewSheet('${sheetName}')" title="Voir la planche">👁️</button>
        <button class="download-svg" onclick="event.stopPropagation(); downloadSheet('${sheetName}')" title="Télécharger la planche">💾</button>
        <button class="delete-model" onclick="deleteSheet('${sheetName}')" title="Supprimer la planche">🗑️</button>
      </div>
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

// Voir une planche dans la zone SVG
function viewSheet(sheetName) {
  if (savedSheets[sheetName]) {
    // Charger la planche dans currentSheet
    currentSheet = [...savedSheets[sheetName]]
    
    // Mettre à jour les sélecteurs
    for (let i = 0; i < 9; i++) {
      const selector = document.getElementById(`sheet-selector-${i}`)
      if (selector) {
        const cardName = currentSheet[i]
        selector.value = cardName || ''
      }
    }
    
    // Afficher la planche
    updateSheetDisplay()
    
    // Mettre à jour le titre
    updateSVGTitle('sheet', sheetName)
    
    console.log('Planche chargée dans la zone SVG:', sheetName)
  }
}

// Ouvrir une planche dans un nouvel onglet
function openSheetInNewTab(sheetName) {
  if (savedSheets[sheetName]) {
    // Créer une copie temporaire de currentSheet
    const tempSheet = [...savedSheets[sheetName]]
    
    // Générer le SVG de la planche
    let sheetSVG = sheetTemplate
    
    // Remplacer les slots vides par des slots occupés et ajouter les cartes
    for (let i = 0; i < 9; i++) {
      const cardName = tempSheet[i]
      const slotId = `slot-${i}`
      
      if (cardName && generatedCards[cardName]) {
        // Remplacer la classe "empty" par "filled"
        sheetSVG = sheetSVG.replace(
          `id="${slotId}" class="card-slot empty"`,
          `id="${slotId}" class="card-slot"`
        )
        
        // Récupérer le contenu SVG de la carte
        const cardData = generatedCards[cardName]
        const cardSVG = typeof cardData === 'string' ? cardData : cardData.svgContent
        
        if (cardSVG) {
          // Extraire le contenu SVG (sans les balises <svg>)
          const svgMatch = cardSVG.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
          const svgContent = svgMatch ? svgMatch[1] : cardSVG
          
          // Calculer la position et la taille pour cette carte
          const x = 20 + (i % 3) * 180 // Position exacte du slot
          const y = 20 + Math.floor(i / 3) * 280 // Position exacte du slot
          const width = 150 // Largeur exacte du slot
          const height = 250 // Hauteur exacte du slot
          
        // Ajouter la carte dans le conteneur
        // Positionner et redimensionner la carte pour remplir le slot
        const scaleX = width / 640
        const scaleY = height / 480
        
        const cardElement = `
          <g id="card-${i}" class="card-content" transform="translate(${x}, ${y})">
            <g transform="scale(${uniformScale})">
              ${svgContent}
            </g>
          </g>`
          
          // Insérer la carte avant la fermeture du conteneur
          sheetSVG = sheetSVG.replace('</g>\n</svg>', `${cardElement}\n  </g>\n</svg>`)
        }
      }
    }
    
    // Créer un blob et ouvrir dans un nouvel onglet
    const blob = new Blob([sheetSVG], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.document.title = `Planche: ${sheetName}`
    }
  }
}

// Télécharger une planche
function downloadSheet(sheetName) {
  if (savedSheets[sheetName]) {
    // Créer une copie temporaire de currentSheet
    const tempSheet = [...savedSheets[sheetName]]
    
    // Générer le SVG de la planche (même logique que openSheetInNewTab)
    let sheetSVG = sheetTemplate
    
    // Remplacer les slots vides par des slots occupés et ajouter les cartes
    for (let i = 0; i < 9; i++) {
      const cardName = tempSheet[i]
      const slotId = `slot-${i}`
      
      if (cardName && generatedCards[cardName]) {
        // Remplacer la classe "empty" par "filled"
        sheetSVG = sheetSVG.replace(
          `id="${slotId}" class="card-slot empty"`,
          `id="${slotId}" class="card-slot"`
        )
        
        // Récupérer le contenu SVG de la carte
        const cardData = generatedCards[cardName]
        const cardSVG = typeof cardData === 'string' ? cardData : cardData.svgContent
        
        if (cardSVG) {
          // Extraire le contenu SVG (sans les balises <svg>)
          const svgMatch = cardSVG.match(/<svg[^>]*>([\s\S]*)<\/svg>/)
          const svgContent = svgMatch ? svgMatch[1] : cardSVG
          
          // Calculer la position et la taille pour cette carte
          const x = 20 + (i % 3) * 180 // Position exacte du slot
          const y = 20 + Math.floor(i / 3) * 280 // Position exacte du slot
          const width = 150 // Largeur exacte du slot
          const height = 250 // Hauteur exacte du slot
          
        // Ajouter la carte dans le conteneur
        // Positionner et redimensionner la carte pour remplir le slot
        const scaleX = width / 640
        const scaleY = height / 480
        
        const cardElement = `
          <g id="card-${i}" class="card-content" transform="translate(${x}, ${y})">
            <g transform="scale(${uniformScale})">
              ${svgContent}
            </g>
          </g>`
          
          // Insérer la carte avant la fermeture du conteneur
          sheetSVG = sheetSVG.replace('</g>\n</svg>', `${cardElement}\n  </g>\n</svg>`)
        }
      }
    }
    
    // Télécharger le fichier
    const blob = new Blob([sheetSVG], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `planche_${sheetName}.svg`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    console.log('Planche téléchargée:', sheetName)
  }
}

function updateSVGTitle(tabType, itemName) {
  const svgTitleText = document.getElementById('svgTitleText')
  if (!svgTitleText) return
  
  switch(tabType) {
    case 'models':
      svgTitleText.textContent = `Modèle : ${itemName}`
      break
    case 'generation':
      svgTitleText.textContent = `Carte : ${itemName}`
      break
    case 'sheet':
      svgTitleText.textContent = itemName ? `Planche : ${itemName}` : 'Planche de cartes'
      break
    case 'images':
      svgTitleText.textContent = `Image : ${itemName}`
      break
    case 'texts':
      svgTitleText.textContent = `Texte : ${itemName}`
      break
    default:
      svgTitleText.textContent = 'Aucun contenu sélectionné'
      break
  }
}

// ===== FONCTIONS INDEXEDDB =====

// Initialiser IndexedDB
function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CardGeneratorDB', 1)
    
    request.onerror = () => {
      console.error('Erreur IndexedDB:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = () => {
      db = request.result
      console.log('IndexedDB initialisé')
      resolve(db)
    }
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      
      // Store pour les images
      if (!db.objectStoreNames.contains('images')) {
        const imageStore = db.createObjectStore('images', { keyPath: 'name' })
        imageStore.createIndex('type', 'type', { unique: false })
      }
      
      // Store pour les textes
      if (!db.objectStoreNames.contains('texts')) {
        const textStore = db.createObjectStore('texts', { keyPath: 'name' })
        textStore.createIndex('type', 'type', { unique: false })
      }
    }
  })
}

// Sauvegarder une image dans IndexedDB
function saveImageToIndexedDB(name, file, type) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('IndexedDB non initialisé'))
      return
    }
    
    const transaction = db.transaction(['images'], 'readwrite')
    const store = transaction.objectStore('images')
    
    const imageData = {
      name: name,
      type: type,
      data: file,
      size: file.size,
      lastModified: file.lastModified
    }
    
    const request = store.put(imageData)
    
    request.onsuccess = () => {
      console.log('Image sauvegardée:', name)
      resolve()
    }
    
    request.onerror = () => {
      console.error('Erreur sauvegarde image:', request.error)
      reject(request.error)
    }
  })
}

// Charger toutes les images depuis IndexedDB
function loadImagesFromIndexedDB() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('IndexedDB non initialisé'))
      return
    }
    
    const transaction = db.transaction(['images'], 'readonly')
    const store = transaction.objectStore('images')
    const request = store.getAll()
    
    request.onsuccess = () => {
      savedImages = {}
      request.result.forEach(image => {
        savedImages[image.name] = image
      })
      console.log('Images chargées:', Object.keys(savedImages).length)
      resolve(savedImages)
    }
    
    request.onerror = () => {
      console.error('Erreur chargement images:', request.error)
      reject(request.error)
    }
  })
}

// Supprimer une image de IndexedDB
function deleteImageFromIndexedDB(name) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('IndexedDB non initialisé'))
      return
    }
    
    const transaction = db.transaction(['images'], 'readwrite')
    const store = transaction.objectStore('images')
    const request = store.delete(name)
    
    request.onsuccess = () => {
      console.log('Image supprimée:', name)
      resolve()
    }
    
    request.onerror = () => {
      console.error('Erreur suppression image:', request.error)
      reject(request.error)
    }
  })
}

// Sauvegarder un texte dans IndexedDB
function saveTextToIndexedDB(name, content, type) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('IndexedDB non initialisé'))
      return
    }
    
    const transaction = db.transaction(['texts'], 'readwrite')
    const store = transaction.objectStore('texts')
    
    const textData = {
      name: name,
      type: type,
      content: content,
      size: content.length,
      lastModified: Date.now()
    }
    
    const request = store.put(textData)
    
    request.onsuccess = () => {
      console.log('Texte sauvegardé:', name)
      resolve()
    }
    
    request.onerror = () => {
      console.error('Erreur sauvegarde texte:', request.error)
      reject(request.error)
    }
  })
}

// Charger tous les textes depuis IndexedDB
function loadTextsFromIndexedDB() {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('IndexedDB non initialisé'))
      return
    }
    
    const transaction = db.transaction(['texts'], 'readonly')
    const store = transaction.objectStore('texts')
    const request = store.getAll()
    
    request.onsuccess = () => {
      savedTexts = {}
      request.result.forEach(text => {
        savedTexts[text.name] = text
      })
      console.log('Textes chargés:', Object.keys(savedTexts).length)
      resolve(savedTexts)
    }
    
    request.onerror = () => {
      console.error('Erreur chargement textes:', request.error)
      reject(request.error)
    }
  })
}

// Supprimer un texte de IndexedDB
function deleteTextFromIndexedDB(name) {
  return new Promise((resolve, reject) => {
    if (!db) {
      reject(new Error('IndexedDB non initialisé'))
      return
    }
    
    const transaction = db.transaction(['texts'], 'readwrite')
    const store = transaction.objectStore('texts')
    const request = store.delete(name)
    
    request.onsuccess = () => {
      console.log('Texte supprimé:', name)
      resolve()
    }
    
    request.onerror = () => {
      console.error('Erreur suppression texte:', request.error)
      reject(request.error)
    }
  })
}

// ===== FONCTIONS DE REDIMENSIONNEMENT =====

// Initialiser le redimensionnement des colonnes
function initResizeHandle() {
  const resizeHandle = document.getElementById('resizeHandle')
  const leftColumn = document.getElementById('leftColumn')
  const rightColumn = document.getElementById('rightColumn')
  
  if (!resizeHandle || !leftColumn || !rightColumn) {
    console.error('Éléments de redimensionnement non trouvés')
    return
  }
  
  let isDragging = false
  let startX = 0
  let startLeftWidth = 0
  let startRightWidth = 0
  let mouseMoveHandler = null
  let mouseUpHandler = null
  
  // Fonction pour gérer le mousemove
  function handleMouseMove(e) {
    if (!isDragging) return
    
    const deltaX = e.clientX - startX
    const containerWidth = leftColumn.parentElement.getBoundingClientRect().width
    const handleWidth = 10 // Largeur de la poignée
    
    // Calculer les nouvelles largeurs
    let newLeftWidth = startLeftWidth + deltaX
    let newRightWidth = startRightWidth - deltaX
    
    // Appliquer les contraintes de largeur minimale
    const minWidth = 200
    if (newLeftWidth < minWidth) {
      newLeftWidth = minWidth
      newRightWidth = containerWidth - newLeftWidth - handleWidth
    }
    if (newRightWidth < minWidth) {
      newRightWidth = minWidth
      newLeftWidth = containerWidth - newRightWidth - handleWidth
    }
    
    // Appliquer les nouvelles largeurs
    const leftPercentage = (newLeftWidth / containerWidth) * 100
    const rightPercentage = (newRightWidth / containerWidth) * 100
    
    leftColumn.style.flex = `0 0 ${leftPercentage}%`
    rightColumn.style.flex = `0 0 ${rightPercentage}%`
  }
  
  // Fonction pour arrêter le redimensionnement
  function handleMouseUp() {
    if (!isDragging) return
    
    console.log('Arrêt du redimensionnement')
    
    isDragging = false
    resizeHandle.classList.remove('dragging')
    
    // Restaurer les styles
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    
    // Sauvegarder les proportions dans localStorage
    const leftPercentage = parseFloat(leftColumn.style.flex.split(' ')[2])
    const rightPercentage = parseFloat(rightColumn.style.flex.split(' ')[2])
    
    localStorage.setItem('leftColumnWidth', leftPercentage.toString())
    localStorage.setItem('rightColumnWidth', rightPercentage.toString())
    
    console.log(`Colonnes redimensionnées: Gauche ${leftPercentage.toFixed(1)}%, Droite ${rightPercentage.toFixed(1)}%`)
    
    // Supprimer les événements globaux
    if (mouseMoveHandler) {
      document.removeEventListener('mousemove', mouseMoveHandler)
      mouseMoveHandler = null
    }
    if (mouseUpHandler) {
      document.removeEventListener('mouseup', mouseUpHandler)
      window.removeEventListener('blur', mouseUpHandler)
      mouseUpHandler = null
    }
  }
  
  // Démarrer le redimensionnement
  resizeHandle.addEventListener('mousedown', function(e) {
    // Vérifier qu'aucun redimensionnement n'est déjà en cours
    if (isDragging) {
      console.log('Redimensionnement déjà en cours, ignoré')
      return
    }
    
    console.log('Début du redimensionnement')
    
    isDragging = true
    startX = e.clientX
    
    // Récupérer les largeurs actuelles
    const leftRect = leftColumn.getBoundingClientRect()
    const rightRect = rightColumn.getBoundingClientRect()
    startLeftWidth = leftRect.width
    startRightWidth = rightRect.width
    
    // Ajouter la classe de redimensionnement
    resizeHandle.classList.add('dragging')
    
    // Empêcher la sélection de texte
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
    
    // Créer les handlers avec des références pour pouvoir les supprimer
    mouseMoveHandler = handleMouseMove
    mouseUpHandler = handleMouseUp
    
    // Ajouter les événements globaux
    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
    window.addEventListener('blur', mouseUpHandler) // Arrêter si la fenêtre perd le focus
    
    e.preventDefault()
    e.stopPropagation()
  })
  
  // Empêcher le redimensionnement si on survole la poignée sans cliquer
  resizeHandle.addEventListener('mouseenter', function() {
    if (!isDragging) {
      resizeHandle.style.cursor = 'col-resize'
    }
  })
  
  resizeHandle.addEventListener('mouseleave', function() {
    if (!isDragging) {
      resizeHandle.style.cursor = 'col-resize'
    }
  })
  
  // Charger les proportions sauvegardées
  loadSavedColumnWidths()
}

// Charger les largeurs de colonnes sauvegardées
function loadSavedColumnWidths() {
  const leftPercentage = localStorage.getItem('leftColumnWidth')
  const rightPercentage = localStorage.getItem('rightColumnWidth')
  
  const leftColumn = document.getElementById('leftColumn')
  const rightColumn = document.getElementById('rightColumn')
  
  if (leftColumn && rightColumn) {
    if (leftPercentage && rightPercentage) {
      // Restaurer les largeurs sauvegardées
      leftColumn.style.flex = `0 0 ${leftPercentage}%`
      rightColumn.style.flex = `0 0 ${rightPercentage}%`
      console.log(`Largeurs restaurées: Gauche ${leftPercentage}%, Droite ${rightPercentage}%`)
    } else {
      // Utiliser les valeurs par défaut (40% gauche, 60% droite)
      leftColumn.style.flex = '0 0 40%'
      rightColumn.style.flex = '0 0 60%'
      console.log('Largeurs par défaut appliquées: Gauche 40%, Droite 60%')
    }
  }
}

// ===== FONCTIONS CHARGEMENT DANS LA ZONE SVG =====

// Variables globales pour le zoom
let currentZoomLevel = 1
const minZoom = 0.1
const maxZoom = 5
const zoomStep = 0.1

// Initialiser les contrôles de zoom
function initZoomControls() {
  const zoomOut = document.getElementById('zoomOut')
  const zoomIn = document.getElementById('zoomIn')
  const zoomReset = document.getElementById('zoomReset')
  const zoomLevel = document.getElementById('zoomLevel')
  const svgContainer = document.getElementById('svgContainer')
  
  if (!zoomOut || !zoomIn || !zoomReset || !zoomLevel || !svgContainer) {
    console.error('Contrôles de zoom non trouvés')
    return
  }
  
  // Fonction pour mettre à jour l'affichage du zoom
  function updateZoomDisplay() {
    zoomLevel.textContent = Math.round(currentZoomLevel * 100) + '%'
  }
  
  // Fonction pour appliquer le zoom
  function applyZoom() {
    const contentDisplay = svgContainer.querySelector('#contentDisplay')
    if (contentDisplay) {
      contentDisplay.style.transform = `scale(${currentZoomLevel})`
      contentDisplay.style.transformOrigin = 'center center'
      
      // Ajuster la taille du conteneur pour le zoom
      const containerWidth = svgContainer.clientWidth
      const containerHeight = svgContainer.clientHeight
      
      // Calculer les nouvelles dimensions
      const newWidth = Math.max(500, containerWidth * currentZoomLevel)
      const newHeight = Math.max(500, containerHeight * currentZoomLevel)
      
      contentDisplay.style.width = newWidth + 'px'
      contentDisplay.style.height = newHeight + 'px'
      
      // Centrer le contenu après zoom
      setTimeout(() => {
        centerContentInContainer(svgContainer)
      }, 50)
    }
    updateZoomDisplay()
  }
  
  // Événements pour les boutons de zoom
  zoomOut.addEventListener('click', function() {
    if (currentZoomLevel > minZoom) {
      currentZoomLevel = Math.max(minZoom, currentZoomLevel - zoomStep)
      applyZoom()
      console.log('Zoom out:', currentZoomLevel)
    }
  })
  
  zoomIn.addEventListener('click', function() {
    if (currentZoomLevel < maxZoom) {
      currentZoomLevel = Math.min(maxZoom, currentZoomLevel + zoomStep)
      applyZoom()
      console.log('Zoom in:', currentZoomLevel)
    }
  })
  
  zoomReset.addEventListener('click', function() {
    currentZoomLevel = 1
    applyZoom()
    console.log('Zoom reset:', currentZoomLevel)
  })
  
  // Zoom avec la molette de la souris
  svgContainer.addEventListener('wheel', function(e) {
    if (e.ctrlKey) {
      e.preventDefault()
      
      if (e.deltaY < 0) {
        // Zoom in
        if (currentZoomLevel < maxZoom) {
          currentZoomLevel = Math.min(maxZoom, currentZoomLevel + zoomStep)
          applyZoom()
        }
      } else {
        // Zoom out
        if (currentZoomLevel > minZoom) {
          currentZoomLevel = Math.max(minZoom, currentZoomLevel - zoomStep)
          applyZoom()
        }
      }
    }
  })
  
  // Initialiser l'affichage
  updateZoomDisplay()
  console.log('Contrôles de zoom initialisés')
}

// Centrer le contenu dans le conteneur avec scrollbars
function centerContentInContainer(container) {
  if (!container) return
  
  // Attendre que l'iframe soit chargé
  const iframe = container.querySelector('iframe')
  if (!iframe) return
  
  // Calculer la position de scroll pour centrer le contenu
  const containerRect = container.getBoundingClientRect()
  const scrollWidth = container.scrollWidth
  const scrollHeight = container.scrollHeight
  
  // Centrer horizontalement et verticalement
  const centerX = Math.max(0, (scrollWidth - containerRect.width) / 2)
  const centerY = Math.max(0, (scrollHeight - containerRect.height) / 2)
  
  // Appliquer le scroll avec animation
  container.scrollTo({
    left: centerX,
    top: centerY,
    behavior: 'smooth'
  })
  
  console.log(`Contenu centré: scrollX=${centerX.toFixed(0)}, scrollY=${centerY.toFixed(0)}`)
}

// Redimensionner l'iframe selon le contenu
function resizeIframeToContent(iframe) {
  if (!iframe) return
  
  try {
    // Attendre que le contenu soit chargé
    iframe.onload = function() {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document
        if (doc) {
          const body = doc.body
          if (body) {
            // Calculer la taille nécessaire
            const minWidth = 500
            const minHeight = 800
            
            // Obtenir la taille du contenu
            const contentWidth = Math.max(minWidth, body.scrollWidth)
            const contentHeight = Math.max(minHeight, body.scrollHeight)
            
            // Redimensionner l'iframe
            iframe.style.width = contentWidth + 'px'
            iframe.style.height = contentHeight + 'px'
            
            console.log(`Iframe redimensionnée: ${contentWidth}x${contentHeight}`)
          }
        }
      } catch (e) {
        console.log('Impossible d\'accéder au contenu de l\'iframe (CORS)')
      }
    }
  } catch (e) {
    console.log('Erreur lors du redimensionnement de l\'iframe:', e)
  }
}

// Charger une image dans la zone SVG
function loadImageInSVGArea(image, name) {
  const contentDisplay = document.getElementById('contentDisplay')
  const container = document.getElementById('svgContainer')
  if (!contentDisplay || !container) {
    console.error('Éléments de contenu non trouvés')
    return
  }
  
  // Créer un blob URL pour l'image
  const blob = new Blob([image.data], { type: `image/${image.type}` })
  const imageUrl = URL.createObjectURL(blob)
  
  // Créer le contenu HTML directement
  const htmlContent = `
    <div class="image-container" style="max-width: 100%; max-height: 100%; text-align: center;">
      <img src="${imageUrl}" alt="${name}" style="max-width: 100%; max-height: 100%; object-fit: contain; border: 2px solid #ddd; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" />
      <div class="image-info" style="margin-top: 10px; color: #666; font-family: Arial, sans-serif;">
        <strong>${name}</strong><br>
        Type: ${image.type.toUpperCase()} | Taille: ${Math.round(image.size / 1024)} KB
      </div>
    </div>
  `
  
  // Charger le contenu directement
  contentDisplay.innerHTML = htmlContent
  
  // Centrer le contenu après chargement
  setTimeout(() => {
    centerContentInContainer(container)
  }, 100)
}

// Charger un texte dans la zone SVG
function loadTextInSVGArea(text, name) {
  const contentDisplay = document.getElementById('contentDisplay')
  const container = document.getElementById('svgContainer')
  if (!contentDisplay || !container) {
    console.error('Éléments de contenu non trouvés')
    return
  }
  
  // Créer le contenu HTML directement
  const htmlContent = `
    <div class="text-container" style="max-width: 100%; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); white-space: pre-wrap; word-wrap: break-word; overflow-x: auto;">
      <div class="text-info" style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ddd; color: #666; font-family: Arial, sans-serif;">
        <strong>${name}</strong><br>
        Type: ${text.type.toUpperCase()} | Taille: ${Math.round(text.size / 1024)} KB
      </div>
      <div class="text-content" style="line-height: 1.6; color: #333; font-family: 'Courier New', monospace;">${text.content}</div>
    </div>
  `
  
  // Charger le contenu directement
  contentDisplay.innerHTML = htmlContent
  
  // Centrer le contenu après chargement
  setTimeout(() => {
    centerContentInContainer(container)
  }, 100)
}

// ===== FONCTIONS GESTION IMAGES =====

// Initialiser la gestion des images
function initImagesManagement() {
  imageFileInput = document.getElementById('imageFileInput')
  imageNameInput = document.getElementById('imageNameInput')
  uploadImageButton = document.getElementById('uploadImageButton')
  imagesList = document.getElementById('imagesList')
  
  if (!imageFileInput || !imageNameInput || !uploadImageButton || !imagesList) {
    console.error('Éléments de gestion des images non trouvés')
    return
  }
  
  // Événements
  uploadImageButton.addEventListener('click', uploadImage)
  
  // Charger les images sauvegardées
  loadImagesFromIndexedDB().then(() => {
    updateImagesList()
  }).catch(e => {
    console.error('Erreur chargement images:', e)
    savedImages = {}
  })
}

// Uploader une image
function uploadImage() {
  const file = imageFileInput.files[0]
  const name = imageNameInput.value.trim()
  
  if (!file) {
    alert('Veuillez sélectionner un fichier image')
    return
  }
  
  if (!name) {
    alert('Veuillez entrer un nom pour l\'image')
    return
  }
  
  if (savedImages[name]) {
    if (!confirm(`Une image nommée "${name}" existe déjà. Voulez-vous la remplacer ?`)) {
      return
    }
  }
  
  const fileExtension = file.name.split('.').pop().toLowerCase()
  const supportedTypes = ['png', 'jpg', 'jpeg', 'gif', 'svg']
  
  if (!supportedTypes.includes(fileExtension)) {
    alert('Type de fichier non supporté. Formats acceptés: PNG, JPG, GIF, SVG')
    return
  }
  
  saveImageToIndexedDB(name, file, fileExtension).then(() => {
    savedImages[name] = {
      name: name,
      type: fileExtension,
      data: file,
      size: file.size,
      lastModified: file.lastModified
    }
    
    updateImagesList()
    imageNameInput.value = ''
    imageFileInput.value = ''
    
    showDataStatus(`✅ Image "${name}" uploadée avec succès`, 'success')
  }).catch(e => {
    console.error('Erreur upload image:', e)
    showDataStatus(`❌ Erreur upload image: ${e.message}`, 'error')
  })
}

// Mettre à jour la liste des images
function updateImagesList() {
  if (!imagesList) return
  
  const imageNames = Object.keys(savedImages)
  
  if (imageNames.length === 0) {
    imagesList.innerHTML = '<p style="color: #666; font-style: italic;">Aucune image uploadée</p>'
    return
  }
  
  imagesList.innerHTML = imageNames.map(name => {
    const image = savedImages[name]
    const iconClass = getFileIconClass(image.type)
    const sizeKB = Math.round(image.size / 1024)
    
    return `
      <div class="model-item" onclick="viewImage('${name}')">
        <span class="file-icon ${iconClass}"></span>
        <span class="model-name">${name} (${sizeKB} KB)</span>
        <div class="model-actions">
          <button class="view-svg" onclick="event.stopPropagation(); openImageInNewTab('${name}')" title="Ouvrir dans un nouvel onglet">👁️</button>
          <button class="download-svg" onclick="event.stopPropagation(); downloadImage('${name}')" title="Télécharger l'image">💾</button>
          <button class="delete-model" onclick="event.stopPropagation(); deleteImage('${name}')" title="Supprimer l'image">🗑️</button>
        </div>
      </div>
    `
  }).join('')
}

// Obtenir la classe CSS pour l'icône de fichier
function getFileIconClass(type) {
  switch(type.toLowerCase()) {
    case 'png': return 'png'
    case 'jpg':
    case 'jpeg': return 'jpg'
    case 'gif': return 'gif'
    case 'svg': return 'svg'
    case 'txt': return 'txt'
    default: return 'txt'
  }
}

// Voir une image dans la zone SVG
function viewImage(name) {
  const image = savedImages[name]
  if (!image) return
  
  // Mettre à jour la variable currentImage
  currentImage = name
  
  // Charger l'image dans la zone de visualisation SVG
  loadImageInSVGArea(image, name)
  
  // Mettre à jour le titre
  updateSVGTitle('images', name)
  
  console.log('Image chargée dans la zone SVG:', name)
}

// Ouvrir une image dans un nouvel onglet
function openImageInNewTab(name) {
  const image = savedImages[name]
  if (!image) return
  
  const blob = new Blob([image.data], { type: `image/${image.type}` })
  const url = URL.createObjectURL(blob)
  
  const newWindow = window.open(url, '_blank')
  if (newWindow) {
    newWindow.document.title = `Image: ${name}`
  }
}

// Télécharger une image
function downloadImage(name) {
  const image = savedImages[name]
  if (!image) return
  
  const blob = new Blob([image.data], { type: `image/${image.type}` })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.${image.type}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Supprimer une image
function deleteImage(name) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer l'image "${name}" ?`)) {
    return
  }
  
  deleteImageFromIndexedDB(name).then(() => {
    delete savedImages[name]
    updateImagesList()
    console.log('Image supprimée:', name)
  }).catch(e => {
    console.error('Erreur suppression image:', e)
    showDataStatus(`❌ Erreur suppression image: ${e.message}`, 'error')
  })
}

// ===== FONCTIONS GESTION TEXTES =====

// Initialiser la gestion des textes
function initTextsManagement() {
  textFileInput = document.getElementById('textFileInput')
  textNameInput = document.getElementById('textNameInput')
  uploadTextButton = document.getElementById('uploadTextButton')
  textsList = document.getElementById('textsList')
  
  if (!textFileInput || !textNameInput || !uploadTextButton || !textsList) {
    console.error('Éléments de gestion des textes non trouvés')
    return
  }
  
  // Événements
  uploadTextButton.addEventListener('click', uploadText)
  
  // Charger les textes sauvegardés
  loadTextsFromIndexedDB().then(() => {
    updateTextsList()
  }).catch(e => {
    console.error('Erreur chargement textes:', e)
    savedTexts = {}
  })
}

// Uploader un texte
function uploadText() {
  const file = textFileInput.files[0]
  const name = textNameInput.value.trim()
  
  if (!file) {
    alert('Veuillez sélectionner un fichier texte')
    return
  }
  
  if (!name) {
    alert('Veuillez entrer un nom pour le texte')
    return
  }
  
  if (savedTexts[name]) {
    if (!confirm(`Un texte nommé "${name}" existe déjà. Voulez-vous le remplacer ?`)) {
      return
    }
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const content = e.target.result
    
    saveTextToIndexedDB(name, content, 'txt').then(() => {
      savedTexts[name] = {
        name: name,
        type: 'txt',
        content: content,
        size: content.length,
        lastModified: Date.now()
      }
      
      updateTextsList()
      textNameInput.value = ''
      textFileInput.value = ''
      
      showDataStatus(`✅ Texte "${name}" uploadé avec succès`, 'success')
    }).catch(e => {
      console.error('Erreur upload texte:', e)
      showDataStatus(`❌ Erreur upload texte: ${e.message}`, 'error')
    })
  }
  
  reader.readAsText(file, 'UTF-8')
}

// Mettre à jour la liste des textes
function updateTextsList() {
  if (!textsList) return
  
  const textNames = Object.keys(savedTexts)
  
  if (textNames.length === 0) {
    textsList.innerHTML = '<p style="color: #666; font-style: italic;">Aucun texte uploadé</p>'
    return
  }
  
  textsList.innerHTML = textNames.map(name => {
    const text = savedTexts[name]
    const iconClass = getFileIconClass(text.type)
    const sizeKB = Math.round(text.size / 1024)
    const preview = text.content.substring(0, 50) + (text.content.length > 50 ? '...' : '')
    
    return `
      <div class="model-item" onclick="viewText('${name}')">
        <span class="file-icon ${iconClass}"></span>
        <span class="model-name">${name} (${sizeKB} KB) - ${preview}</span>
        <div class="model-actions">
          <button class="view-svg" onclick="event.stopPropagation(); openTextInNewTab('${name}')" title="Ouvrir dans un nouvel onglet">👁️</button>
          <button class="download-svg" onclick="event.stopPropagation(); downloadText('${name}')" title="Télécharger le texte">💾</button>
          <button class="delete-model" onclick="event.stopPropagation(); deleteText('${name}')" title="Supprimer le texte">🗑️</button>
        </div>
      </div>
    `
  }).join('')
}

// Voir un texte dans la zone SVG
function viewText(name) {
  const text = savedTexts[name]
  if (!text) return
  
  // Mettre à jour la variable currentText
  currentText = name
  
  // Charger le texte dans la zone de visualisation SVG
  loadTextInSVGArea(text, name)
  
  // Mettre à jour le titre
  updateSVGTitle('texts', name)
  
  console.log('Texte chargé dans la zone SVG:', name)
}

// Ouvrir un texte dans un nouvel onglet
function openTextInNewTab(name) {
  const text = savedTexts[name]
  if (!text) return
  
  const newWindow = window.open('', '_blank')
  if (newWindow) {
    newWindow.document.title = `Texte: ${name}`
    newWindow.document.body.innerHTML = `
      <div style="padding: 20px; font-family: monospace; white-space: pre-wrap; background: #f5f5f5;">
        <h2>${name}</h2>
        <hr>
        ${text.content}
      </div>
    `
  }
}

// Télécharger un texte
function downloadText(name) {
  const text = savedTexts[name]
  if (!text) return
  
  const blob = new Blob([text.content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `${name}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Supprimer un texte
function deleteText(name) {
  if (!confirm(`Êtes-vous sûr de vouloir supprimer le texte "${name}" ?`)) {
    return
  }
  
  deleteTextFromIndexedDB(name).then(() => {
    delete savedTexts[name]
    updateTextsList()
    console.log('Texte supprimé:', name)
  }).catch(e => {
    console.error('Erreur suppression texte:', e)
    showDataStatus(`❌ Erreur suppression texte: ${e.message}`, 'error')
  })
}

// Exposer les fonctions globalement pour les événements onclick
window.loadModel = loadModel
window.deleteModel = deleteModel
window.loadGeneratedCard = loadGeneratedCard
window.deleteGeneratedCard = deleteGeneratedCard
window.loadSheet = loadSheet
window.deleteSheet = deleteSheet
window.updateSheetCard = updateSheetCard
window.viewSheet = viewSheet
window.openSheetInNewTab = openSheetInNewTab
window.downloadSheet = downloadSheet
window.viewImage = viewImage
window.openImageInNewTab = openImageInNewTab
window.downloadImage = downloadImage
window.deleteImage = deleteImage
window.viewText = viewText
window.openTextInNewTab = openTextInNewTab
window.downloadText = downloadText
window.deleteText = deleteText

