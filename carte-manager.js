function getTextFromUrl (Url) {
  var req = new XMLHttpRequest()
  req.open('GET', Url, false)
  req.send(null)
  if (req.status === 200) {
    return req.responseText
  }
}

function CarteManager () {
  this.listOfCartes = []
  this.svgLoaded = false
  this.csvLoaded = false
}

CarteManager.prototype.loadTemplateSvg = function (svgId) {
  this.svgLoaded = true
  $('#' + svgId).hide()
  this.templateSvg = ''
}

CarteManager.prototype.loadCsv = function (csvFile) {
  this.csvLoaded = true
  var csvText = getTextFromUrl(csvFile)
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

CarteManager.prototype.createCartes = function () {
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

CarteManager.prototype.showCartes = function () {
  console.log('show the cards')
  for (let carte of this.listOfCartes) {
    carte.showCartes()
    console.log('--------------------------------')
  }
}
