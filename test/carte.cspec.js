/* globals describe, it */
import Carte from '../src/carte'
var assert = require('assert')

describe('Carte', function () {
  describe('#constructor()', function () {
    it('Should create a card', function () {
      var carte = new Carte(['a', 'b'], ['a', 'b'], 'plop')
      assert.equal(carte.textPrefix, 'GDCBOX')
    })
    it('Should throw a error', function () {
      assert.throws(
        function () { new Carte(['a', 'b'], ['a'], 'plop') }, // eslint-disable-line no-new
        Error
      )
    })
  })
})
