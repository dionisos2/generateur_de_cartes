/**
 * Interface of what we need to manipulate svg image in this project
 */
export default class SvgInterface {
  /**
   * Create a svg image
   * @abstract
   */
  constructor () {
    if (this.constructor === SvgInterface) {
      throw new TypeError('SvgInterface can’t be instantiated.')
    }
    if (this.clone === SvgInterface.prototype.clone) {
      throw new TypeError('Please implement abstract method "clone".')
    }
    if (this.load === SvgInterface.prototype.load) {
      throw new TypeError('Please implement abstract method "load".')
    }
    if (this.getElementByValue === SvgInterface.prototype.getElementByValue) {
      throw new TypeError('Please implement abstract method "getElementByValue".')
    }
    if (this.getElementById === SvgInterface.prototype.getElementById) {
      throw new TypeError('Please implement abstract method "getElementById".')
    }
    if (this.replaceText === SvgInterface.prototype.replaceText) {
      throw new TypeError('Please implement abstract method "replaceText".')
    }
    if (this.wrapTextInRect === SvgInterface.prototype.wrapTextInRect) {
      throw new TypeError('Please implement abstract method "wrapTextInRect".')
    }
    if (this.remove === SvgInterface.prototype.remove) {
      throw new TypeError('Please implement abstract method "remove".')
    }
  }

  /**
   * Clone a svg image
   * @abstract
   */
  clone () {
    throw new TypeError('Do not call abstract method "clone" from child.')
  }

  /**
   * Load a svg image from filePath.
   * @param {string} filePath - Path to the svg file to load.
   * @abstract
   */
  load (filePath) {
    throw new TypeError('Do not call abstract method "load" from child.')
  }

  /**
   * Get a svg element by its value.
   *
   * Modifying or removing(see {@link SvgInterface.remove}) the returned svg element will modify this svg element.
   * @param {string} value - The value of the svg element.
   * @return {?SvgInterface} Return the first svg element found, return null if no element is found.
   * @abstract
   */
  getElementByValue (value) {
    throw new TypeError('Do not call abstract method "getElementByValue" from child.')
  }

  /**
   * Get a svg element by its id.
   *
   * Modifying or removing(see {@link SvgInterface.remove}) the returned svg element will modify this svg element.
   * @param {string} id - The id of the svg element.
   * @return {?SvgInterface} Return the svg element if found, null otherwise.
   * @abstract
   */
  getElementById (id) {
    throw new TypeError('Do not call abstract method "getElementById" from child.')
  }

  /**
   * Replace the value of this svg element if it contain only text.
   * @param {string} text - The text with what to replace the value of this element.
   * All special chars will be escaped.
   * @throws {TypeError} Throw a error if this svg element don’t contain only text.
   * @abstract
   */
  replaceText (text) {
    throw new TypeError('Do not call abstract method "replaceText" from child.')
  }

  /**
   * Wrap text inside a svg <rect>.
   *
   * The parent of the created <tspan> will be this element,
   * it should be a <text> element.
   * @param {string} text - The text to wrap.
   * @param {SvgInterface} svgRect - The rect which delimite the text.
   * @throws {TypeError} Throw a error if this svg element isn’t a <text>.
   * @abstract
   */
  wrapTextInRect (text, svgRect) {
    throw new TypeError('Do not call abstract method "wrapText" from child.')
  }

  /**
   * Remove this svg element.
   * If this svg element have a parent, it is removed from its parent as well.
   * @abstract
   */
  remove () {
    throw new TypeError('Do not call abstract method "remove" from child.')
  }
}
