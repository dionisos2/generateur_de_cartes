import Svg from './svg'
import {copy} from './tools'
import {TEXTPREFIX, BOXPOSTFIX, TEMPLATEHEADERNAME} from './const.js'

export default class Carte {

  constructor (caractDict, svgTemplateDict) {
    this.caractDict = caractDict
    this.svgTemplateDict = svgTemplateDict

    if (!(TEMPLATEHEADERNAME in caractDict)) {
      throw new Error(TEMPLATEHEADERNAME + ' should be a key of the CaractDict. (maybe it is missing as a header in the CSV table ?)')
    }
    var templateFileName = this.caractDict[TEMPLATEHEADERNAME]
    if (templateFileName in svgTemplateDict) {
      this.svgTemplate = svgTemplateDict[templateFileName]
    } else {
      throw new Error(templateFileName + ' key not found in svgTemplateDict (this key is the file name of the svg template file)')
    }
    // this.createSvg(templateSvg);
  }

  createSvg () {
    this.svg = new Svg(this.svgTemplate) // copy by value ? (should be)
    var svgText, boxId, svgBox

    for (var i = 0; i < this.columnsHeaders.length; i++) {
      // replace all entries by their associated values
      svgText = this.svg.getElementByValue(this.columnsHeaders[i])
      if (svgText.id.match('$' + TEXTPREFIX + '.*') != null) {
        boxId = svgText.id + BOXPOSTFIX
        svgBox = this.svg.getElementById(boxId)
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
