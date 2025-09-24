import SvgInterface from './svg-interface.js'
import {TEXTPREFIX, BOXPOSTFIX} from './const.js'

export default class Carte {

  constructor (columnsHeaders, csvLine, svgTemplate) {
    if (!(svgTemplate instanceof SvgInterface)) {
      throw new TypeError('svgTemplate should implement SvgInterface')
    }
    this.columnsHeaders = columnsHeaders
    this.parsedCsv = csvLine
    this.caractDict = this.createCaractDict(columnsHeaders, csvLine)
    this.svgTemplate = svgTemplate.clone()

    // this.createSvg(templateSvg);
  }

  createCaractDict (headers, csvLine) {
    const dict = {}
    for (let i = 0; i < headers.length; i++) {
      dict[headers[i]] = csvLine[i]
    }
    return dict
  }

  createSvg () {
    console.log('=== DÉBUT createSvg ===')
    console.log('this.svgTemplate:', this.svgTemplate)
    console.log('this.svgTemplate.svgElement:', this.svgTemplate ? this.svgTemplate.svgElement : 'undefined')
    
    // Cloner le SVG template
    this.svg = this.svgTemplate.clone()
    console.log('this.svg après clonage:', this.svg)
    console.log('this.svg.svgElement après clonage:', this.svg ? this.svg.svgElement : 'undefined')
    
    if (!this.svg || !this.svg.svgElement) {
      console.error('Erreur: Impossible de cloner le SVG template')
      return
    }

    // Méthode 1: Remplacement par tspan (méthode existante) - DÉSACTIVÉE TEMPORAIREMENT
    // pour éviter les doubles remplacements
    /*
    for (let caractName in this.caractDict) {
      console.log('Traitement de la colonne:', caractName, '=', this.caractDict[caractName])
      
      let svgTspan = this.svg.getElementByValue(caractName)
      let svgRect = this.svg.getElementById(TEXTPREFIX + caractName + BOXPOSTFIX)
      let caractValue = this.caractDict[caractName]
      
      if (svgTspan) {
        console.log('Tspan trouvé pour:', caractName)
        if (svgRect != null) {
          let svgText = svgTspan.parent()
          svgTspan.remove()
          svgText.wrapTextInRect(caractValue, svgRect)
        } else {
          svgTspan.replaceText(caractValue)
        }
      } else {
        console.log('Aucun tspan trouvé pour:', caractName)
      }
    }
    */
    
    // Méthode 2: Remplacement global de tous les textes dans le SVG
    this.replaceAllTextsInSVG()
  }
  
  replaceAllTextsInSVG() {
    if (!this.svg || !this.svg.svgElement) return
    
    console.log('=== DÉBUT replaceAllTextsInSVG ===')
    console.log('Données disponibles:', this.caractDict)
    
    // Récupérer tous les éléments de texte
    const textElements = this.svg.svgElement.querySelectorAll('text, tspan')
    console.log('Éléments de texte trouvés:', textElements.length)
    
    textElements.forEach((textElement, index) => {
      const originalText = textElement.textContent
      let newText = originalText
      
      console.log(`Élément ${index}: "${originalText}"`)
      
      // Remplacer chaque nom de colonne par sa valeur
      for (let caractName in this.caractDict) {
        const caractValue = this.caractDict[caractName]
        console.log(`Recherche de "${caractName}" dans "${newText}"`)
        
        // Vérifier si le nom de colonne est présent dans le texte actuel
        if (newText.includes(caractName)) {
          // Remplacement global (toutes les occurrences)
          const regex = new RegExp(caractName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
          const beforeReplace = newText
          newText = newText.replace(regex, caractValue)
          console.log(`Remplacement effectué: "${caractName}" → "${caractValue}"`)
          console.log(`Avant: "${beforeReplace}" → Après: "${newText}"`)
        }
      }
      
      // Mettre à jour le texte si il y a eu des changements
      if (newText !== originalText) {
        textElement.textContent = newText
        console.log(`Texte final: "${originalText}" → "${newText}"`)
      } else {
        console.log(`Aucun changement pour: "${originalText}"`)
      }
    })
    
    console.log('=== FIN replaceAllTextsInSVG ===')
  }

  showCartes () {
    for (var i = 0; i < this.columnsHeaders.length; i++) {
      console.log(this.columnsHeaders[i] + ' = ' + this.parsedCsv[i])
    }
  }

  getSvgText () {
    console.log('=== DÉBUT getSvgText ===')
    console.log('this.svg:', this.svg)
    console.log('this.svg.svgElement:', this.svg ? this.svg.svgElement : 'this.svg is null')
    
    // Créer le SVG avec les données
    this.createSvg()
    
    console.log('Après createSvg - this.svg:', this.svg)
    console.log('Après createSvg - this.svg.svgElement:', this.svg ? this.svg.svgElement : 'this.svg is null')
    
    // Retourner le contenu HTML du SVG
    let result = ''
    if (this.svg && this.svg.svgElement) {
      // Cloner l'élément pour éviter de modifier l'original
      const clonedElement = this.svg.svgElement.cloneNode(true)
      result = clonedElement.outerHTML
    }
    
    console.log('Résultat getSvgText:', result ? 'Contenu trouvé' : 'Vide ou undefined')
    console.log('=== FIN getSvgText ===')
    return result
  }
}
