/* globals describe, it */
import Carte from '../src/carte'
import SvgInterface from '../src/svg-interface'
var chai = require('chai')
var sinon = require('sinon')
var sinonChai = require('sinon-chai')
var expect = chai.expect
var spy = sinon.spy
chai.use(sinonChai)

class MockSvg extends SvgInterface {
  clone () {
    return new MockSvg()
  }

  getElementByValue () {
    return new MockSvg()
  }

  getElementById () {
    return new MockSvg()
  }

  replaceText () {
  }
}

/** @test {Carte} */
describe('Carte', function () {
  /** @test {Carte#constructor} */
  describe('#constructor()', function () {
    var caractDict = {'name': 'test', 'cost': '10'}
    it('Should create a card', function () {
      var svg = new MockSvg()
      spy(svg, 'clone')
      var carte = new Carte(caractDict, svg)
      expect(carte.caractDict['name']).to.equal('test')
      expect(svg.clone).to.have.been.calledOnce
    })
    it('Should throw a type error', function () {
      var createCarte = function () { new Carte(caractDict, {}) }// eslint-disable-line no-new
      expect(createCarte).throws(TypeError, 'svgTemplate should implement SvgInterface')
    })
  })
  describe('#createSvg()', function () {
    var caractDict = {'name': 'test', 'cost': '10'}
    it('Should create a svg', function () {
      var svg = new MockSvg()
      var carte = new Carte(caractDict, svg)
      carte.createSvg()
      expect(carte).to.have.property('svg')
      expect(carte.svg).to.be.an.instanceOf(SvgInterface)
    })
    it('Should call getElementByValue for name and cost', function () {
      var svg = new MockSvg()
      spy(MockSvg.prototype, 'getElementByValue')
      var carte = new Carte(caractDict, svg)
      carte.createSvg()

      expect(svg)
      expect(MockSvg.prototype.getElementByValue).to.have.been.calledTwice
      expect(MockSvg.prototype.getElementByValue).to.have.been.calledWith('name')
      expect(MockSvg.prototype.getElementByValue).to.have.been.calledWith('cost')
    })
  })
})
