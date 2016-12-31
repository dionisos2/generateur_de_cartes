import SvgInterface from './svg-interface'
import {TEXTPREFIX, BOXPOSTFIX} from './const.js'

export default class Carte {

  constructor (caractDict, svgTemplate) {
    if (!(svgTemplate instanceof SvgInterface)) {
      throw new TypeError('svgTemplate should implement SvgInterface')
    }
    this.caractDict = caractDict
    this.svgTemplate = svgTemplate
    this.svgTemplate = svgTemplate.clone()

    // this.createSvg(templateSvg);
  }

  createSvg () {
    this.svg = this.svgTemplate.clone()

    for (let caractName in this.caractDict) {
      // replace all entries by their associated values
      let svgTspan = this.svg.getElementByValue(caractName)
      let svgRect = this.svg.getElementById(TEXTPREFIX + caractName + BOXPOSTFIX)

      let caractValue = this.caractDict[caractName]
      if (svgRect != null) {
        let svgText = svgTspan.parent()
        svgTspan.remove()
        svgText.wrapTextInRect(caractValue, svgRect)
      } else {
        this.svgText.replaceText(caractValue)
      }
    }
  }

  showCartes () {
    for (var i = 0; i < this.columnsHeaders.length; i++) {
      console.log(this.columnsHeaders[i] + ' = ' + this.parsedCsv[i])
    }
  }
}
