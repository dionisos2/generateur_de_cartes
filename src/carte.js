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
    this.svg = this.svgTemplate.clone()

    for (let caractName in this.caractDict) {
      // replace all entries by their associated values
      let svgTspan = this.svg.getElementByValue(caractName)
      let svgRect = this.svg.getElementById(TEXTPREFIX + caractName + BOXPOSTFIX)

      let caractValue = this.caractDict[caractName]
      if (svgTspan) {
        if (svgRect != null) {
          let svgText = svgTspan.parent()
          svgTspan.remove()
          svgText.wrapTextInRect(caractValue, svgRect)
        } else {
          svgTspan.replaceText(caractValue)
        }
      }
    }
  }

  showCartes () {
    for (var i = 0; i < this.columnsHeaders.length; i++) {
      console.log(this.columnsHeaders[i] + ' = ' + this.parsedCsv[i])
    }
  }
}
