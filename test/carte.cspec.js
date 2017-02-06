/* globals describe, it */
import Carte from '../src/carte'
import Svg from '../src/svg'
import SvgInterface from '../src/svg-interface'
var chai = require('chai')
var sinon = require('sinon')
// var sinonChai = require('sinon-chai')
var expect = chai.expect
var spy = sinon.spy
// chai.use(sinonChai)

require('./svg.cspec.js')

/** @test {Carte} */
describe('Carte', function () {
  /** @test {Carte#constructor} */
  describe('#constructor()', function () {
    var caractDict = {'name': 'test', 'cost': '10'}
    it('Should create a card', function () {
      var svg = new Svg()
      spy(svg, 'clone')
      var carte = new Carte(caractDict, svg)
      expect(carte.caractDict['name']).to.equal('test')
      expect(svg.clone).to.have.been.calledOnce
    })
    it('Should throw a TypeError when the second parameter doesn’t implement SvgInterface', function () {
      var createCarte = function () { new Carte(caractDict, {}) }// eslint-disable-line no-new
      expect(createCarte).throws(TypeError, 'svgTemplate should implement SvgInterface')
    })
  })
  describe('#createSvg()', function () {
    var caractDict = {'name': 'test', 'cost': '10'}
    it('Should inject the caracts in the correct place in the svg', function () {
      var svg = new Svg()
      svg.load('./templates/test.svg')
      var carte = new Carte(caractDict, svg)
      carte.createSvg()
      expect(carte).to.have.property('svg')
      expect(carte.svg).to.be.an.instanceOf(SvgInterface)
      expect(carte.svg.getElementById('name_id')).to.equal('test')
      expect(carte.svg.getElementById('cost_id')).to.equal('10')
    })
  })
})
