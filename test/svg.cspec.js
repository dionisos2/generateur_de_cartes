/* globals describe, it, beforeEach */
import Svg from '../src/svg'
var chai = require('chai')
var expect = chai.expect

/** @test {Svg} */
describe('Svg', function () {
  /** @test {Svg.constructor} */
  describe('.constructor()', function () {
    it('Should create a empty svg', function () {
      var svg = new Svg()
      expect(svg.getElementById('none')).to.equal(null)
    })
    it('Should load a svg file', function () {
      var svg = new Svg('./templates/test.svg')
      expect(svg.getElementById('tspan1').getValue()).to.equal('theFirstSpan')
    })
  })

  describe('.load()', function () {
    it('Should load a svg file', function () {
      var svg = new Svg()
      svg.load('./templates/test.svg')
      expect(svg.getElementById('tspan1').getValue()).to.equal('theFirstSpan')
    })
  })

  describe('.getElementByValue(value)', function () {
    it('Should get the first tspan', function () {
      var svg = new Svg('./templates/test.svg')
      var firstTpsan = svg.getElementByValue('theFirstSpan')
      expect(firstTpsan.id()).to.equal('tspan1')
    })
  })

  describe('.getElementById(id)', function () {
    it('Should get the first tspan', function () {
      var svg = new Svg('./templates/test.svg')
      var firstTpsan = svg.getElementById('tspan1')
      expect(firstTpsan.getValue()).to.equal('theFirstSpan')
    })
  })

  describe('.clone', function () {
    beforeEach(function () {
      this.svg = new Svg('./templates/test.svg')
    })

    it('Should copy the tspan1 tspan', function () {
      var svgClone = this.svg.clone()
      expect(svgClone.getElementById('tspan1').getValue()).to.equal('theFirstSpan')
    })

    it('Should not modify cloned tspan1', function () {
      var svgClone = this.svg.clone()
      svgClone.getElementById('tspan1').replaceText('replacedText')
      expect(svgClone.getElementById('tspan1').getValue()).to.equal('replacedText')
      expect(this.svg.getElementById('tspan1').getValue()).to.equal('theFirstSpan')
    })
  })

  describe('.replaceText()', function () {
    it('Should modify tspan1', function () {
      var svg = new Svg('./templates/test.svg')
      var tspan1 = svg.getElementById('tspan1')
      tspan1.replaceText('modifiedFirstSpan')
      expect(tspan1.getValue()).to.equal('modifiedFirstSpan')
      expect(svg.getElementById('tspan1').getValue()).to.equal('modifiedFirstSpan')
    })

    it('Should escape special chars', function () {
      var svg = new Svg('./templates/test.svg')
      var tspan1 = svg.getElementById('tspan1')
      tspan1.replaceText('text with special char: <>\'"&')
      expect(svg.getElementById('tspan1').getValue()).to.equal('text with special char: &lt;&gt;&apos;&quot;&amp;')
    })

    it('Should throw a TypeError when the element doesn’t contain only text', function () {
      var svg = new Svg('./templates/test.svg')
      var text = svg.getElementById('text1')

      var modifyText = function () {
        text.replaceText('plop')
      }
      expect(modifyText).throws(TypeError)
    })
  })

  describe('.remove()', function () {
    it('Should remove tspan2', function () {
      var svg = new Svg('./templates/test.svg')
      var tspan2 = svg.getElementById('tspan2')
      tspan2.remove()
      expect(tspan2).to.equal(null)
      expect(svg.getElementById('tspan2')).to.equal(null)
    })
  })
})

