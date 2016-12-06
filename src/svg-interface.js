export default class SvgInterface {
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
  }

  clone () {
    throw new TypeError('Do not call abstract method "clone" from child.')
  }

  load () {
    throw new TypeError('Do not call abstract method "load" from child.')
  }
}
