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
    console.log('SVG element:', this.svg.svgElement)
    console.log('SVG innerHTML:', this.svg.svgElement.innerHTML.substring(0, 500) + '...')
    
    // Récupérer tous les éléments du SVG
    const allElements = this.svg.svgElement.querySelectorAll('*')
    console.log('Éléments SVG trouvés:', allElements.length)
    
    // Afficher tous les éléments trouvés
    allElements.forEach((element, index) => {
      console.log(`Élément ${index}: ${element.tagName} - textContent: "${element.textContent}"`)
    })
    
    allElements.forEach((element, index) => {
      // 1. Remplacer dans le contenu texte des éléments (text, tspan, etc.)
      // MAIS PAS dans les éléments <g> qui contiennent d'autres éléments
      if (element.textContent && element.textContent.trim() && 
          !(element.tagName === 'g' && element.children.length > 0)) {
        const originalText = element.textContent
        let newText = originalText
        
        console.log(`TRAITEMENT TEXTE - Élément ${index} (${element.tagName}) - Texte: "${originalText}"`)
        
        // Remplacer chaque nom de colonne par sa valeur dans le texte
        for (let caractName in this.caractDict) {
          const caractValue = this.caractDict[caractName]
          console.log(`Vérification "${caractName}" (${caractValue}) dans "${newText}"`)
          
          if (newText.includes(caractName)) {
            const regex = new RegExp(caractName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
            const beforeReplace = newText
            newText = newText.replace(regex, caractValue)
            console.log(`✅ Texte remplacé: "${caractName}" → "${caractValue}"`)
            console.log(`Avant: "${beforeReplace}" → Après: "${newText}"`)
          }
        }
        
        // Mettre à jour le texte si il y a eu des changements
        if (newText !== originalText) {
          element.textContent = newText
          console.log(`✅ Texte final mis à jour: "${originalText}" → "${newText}"`)
        } else {
          console.log(`❌ Aucun changement pour: "${originalText}"`)
        }
      } else if (element.tagName === 'g' && element.children.length > 0) {
        console.log(`⏭️ Élément ${index} (${element.tagName}) ignoré car il contient ${element.children.length} enfants`)
      }
      
      // 2. Remplacer dans tous les attributs de l'élément
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i]
        const originalValue = attr.value
        let newValue = originalValue
        
        console.log(`TRAITEMENT ATTRIBUT - Élément ${index} - ${attr.name}: "${originalValue}"`)
        
        // Remplacer chaque nom de colonne par sa valeur dans l'attribut
        for (let caractName in this.caractDict) {
          const caractValue = this.caractDict[caractName]
          
          if (newValue.includes(caractName)) {
            const regex = new RegExp(caractName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
            const beforeReplace = newValue
            newValue = newValue.replace(regex, caractValue)
            console.log(`✅ Attribut remplacé: "${caractName}" → "${caractValue}"`)
            console.log(`Avant: "${beforeReplace}" → Après: "${newValue}"`)
          }
        }
        
        // Mettre à jour l'attribut si il y a eu des changements
        if (newValue !== originalValue) {
          element.setAttribute(attr.name, newValue)
          console.log(`✅ Attribut ${attr.name} mis à jour: "${originalValue}" → "${newValue}"`)
        }
      }
    })
    
    console.log('=== FIN replaceAllTextsInSVG ===')
    console.log('SVG final innerHTML:', this.svg.svgElement.innerHTML.substring(0, 500) + '...')
    console.log('SVG final outerHTML:', this.svg.svgElement.outerHTML.substring(0, 500) + '...')
    
    // Vérifier spécifiquement le contenu du groupe g1056
    const groupElement = this.svg.svgElement.querySelector('#g1056')
    if (groupElement) {
      console.log('Groupe g1056 trouvé:', groupElement)
      console.log('Contenu du groupe g1056:', groupElement.innerHTML)
      console.log('TextContent du groupe g1056:', groupElement.textContent)
    } else {
      console.log('❌ Groupe g1056 non trouvé !')
    }
    
    // Vérifier les éléments text et tspan
    const textElements = this.svg.svgElement.querySelectorAll('text, tspan')
    console.log('Éléments text/tspan trouvés:', textElements.length)
    textElements.forEach((el, index) => {
      console.log(`Élément ${index}: ${el.tagName} - textContent: "${el.textContent}"`)
    })
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
      // Utiliser directement l'élément modifié (pas de clonage pour l'instant)
      result = this.svg.svgElement.outerHTML
      console.log('SVG final (premiers 500 caractères):', result.substring(0, 500) + '...')
    }
    
    console.log('Résultat getSvgText:', result ? 'Contenu trouvé' : 'Vide ou undefined')
    console.log('=== FIN getSvgText ===')
    return result
  }
}
