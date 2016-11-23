export default class Carte {

  construtor (columnsHeaders, parsedCsv, templateSvg) {
    if (columnsHeaders.length !== parsedCsv.length) {
      throw new Error('columnsHeaders and parsedCsv doesn’t have the same length')
    }
    this.columnsHeaders = columnsHeaders
    this.parsedCsv = parsedCsv
    this.textPrefix = 'GDCBOX'
    this.boxPostfix = 'BOX'
    // this.createSvg(templateSvg);
  }

  createSvg (templateSvg) {
    this.svg = templateSvg // copy by value ? (should be)
    var svgText, boxId, svgBox

    for (var i = 0; i < this.columnsHeaders.length; i++) {
      // replace all entries by their associated values
      svgText = getElementByValue(this.svg, this.columnsHeaders[i])
      if (svgText.id.match('$' + this.textPrefix + '.*') != null) {
        boxId = svgText.id + this.boxPostfix
        svgBox = getElementById(this.svg, boxId)
        this.addTextInBox(svgText, svgBox, this.parsedCsv[i])
      } else {
        this.svg.replace(this.columnsHeaders[i], this.parsedCsv[i])
      }
    }
  }

  showCartes () {
    for (var i = 0; i < this.columnsHeaders.length; i++) {
      console.log(this.columnsHeaders[i] + ' = ' + this.parsedCsv[i])
    }
  }

  addTextInBox (svgText, svgBox, text) {
    var lineSpacing = 1
    svgText.move(svgBox.x, svgBox.y)
    var boxWidth = svgBox.width
    var newSvgText
    for (let character of text) {
      svgText.setText(svgText.text + character)
      svgText.update()
      if (svgText.width > boxWidth) {
        newSvgText = copy(svgText)
        newSvgText.y += svgText.height + lineSpacing
        newSvgText.setText('')
        svgText = newSvgText
      }
    }
  }
}

