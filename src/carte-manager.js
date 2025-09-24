import Carte from './carte.js'
import getTextFromUrl from './utils.js'

export default class CarteManager {
  constructor () {
    this.listOfCartes = []
    this.svgLoaded = false
    this.csvLoaded = false
  }
  loadTemplateSvg (svgId) {
    this.svgLoaded = true
    const element = document.getElementById(svgId)
    if (element) {
      element.style.display = 'none'
    }
    this.templateSvg = ''
  }

  loadCsv (csvFile) {
    this.csvLoaded = true
    var csvText = getTextFromUrl(csvFile)
    if (!csvText) {
      throw new Error('Failed to load CSV file: ' + csvFile)
    }
    // console.log(csvText);
    // CONSTANTS
    var separationChar = ','
    var endOfLineChar = '\n'
    var quotationMarks = '"'

    // INITIALIZATION
    var entries = []
    var entry = []
    var textField = ''
    var depth = 0

    // CONTROL OF ALL CHARS OF THE DATABASE TEXT TO SEPARATE THE FIELDS (;)
    // console.log("[order_csv] Verifying chars to separate the fields into " + csvText);
    for (var i = 0; i < csvText.length; i++) {
      var letter = csvText.charAt(i)

      // Separation
      if (letter === separationChar && depth === 0) {
        entry.push(textField)
        textField = ''
        // console.log(i+' '+letter+' séparation');
      } else {
        // End of the line
        if (letter === endOfLineChar) {
          entry.push(textField)
          entries.push(entry)
          textField = ''
          entry = []
          // console.log(i+' '+letter+' end of line');
        } else {
          // Quotation marks
          if (letter === quotationMarks) {
            if (depth === 0) {
              depth++
            } else {
              depth--
            }
            textField += "'"
            // console.log(i+' '+letter+' guillemets');
          } else {
            // Normal letter
            textField += letter
            // console.log(i+' '+letter);
          }
        }
      }
    }
    this.columnsHeaders = entries.slice(0, 1)[0]
    this.parsedCsv = entries.slice(1, entries.length)
  }

  createCartes () {
    if (!this.svgLoaded) {
      throw Error('You should call loadTemplateSvg before createCartes')
    }

    if (!this.csvLoaded) {
      throw Error('You should call loadCsv before createCartes')
    }

    for (let csvLine of this.parsedCsv) {
      let carte = new Carte(this.columnsHeaders, csvLine, this.templateSvg)
      this.listOfCartes.push(carte)
    }
  }

  showCartes () {
    console.log('show the cards')
    for (let carte of this.listOfCartes) {
      carte.showCartes()
      console.log('--------------------------------')
    }
  }
}
