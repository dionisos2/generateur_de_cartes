/* globals describe, it */
import Carte from '../src/carte'
var expect = require('chai').expect

/** @test {Carte} */
describe('Carte', function () {
  /** @test {Carte#constructor} */
  describe('#constructor()', function () {
    it('Should create a card', function () {
      var carte = new Carte(['a', 'b'], ['a', 'b'], 'plop')
      expect(carte.textPrefix).to.equal('GDCBOX')
    })
    it('Should throw a error', function () {
      var createCarte = function () { new Carte(['a', 'b'], ['a'], 'plop') }// eslint-disable-line no-new
      expect(createCarte).throws(Error, 'columnsHeaders and parsedCsv doesn’t have the same length')
    })
    it('Should ')
  })
})
