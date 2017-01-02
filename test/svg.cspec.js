/* globals describe, it */
import Svg from '../src/svg'
var chai = require('chai')
var expect = chai.expect

/** @test {Svg} */
describe('Svg', function () {
  /** @test {Svg#constructor} */
  describe('#constructor()', function () {
    it('Should create a empty svg', function () {
      var svg = new Svg()
      expect(svg.getElementById('none')).to.equal(null)
    })
    it('Should load a svg file', function () {
      var svg = new Svg('./templates/test.svg')
      expect(svg.getElementById('tspan1').value()).to.equal('theFirstSpan')
    })
  })
  describe('#load()', function () {
    var svg = new Svg()
    it('Should load a svg file', function () {
      svg.load('./templates/test.svg')
      expect(svg.getElementById('tspan1').value()).to.equal('theFirstSpan')
    })
  })
})
