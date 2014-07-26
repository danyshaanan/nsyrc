'use strict';

var rek = require('rekuire')
var linksDataUtils = rek('linksDataUtils')

var linkData = {
    'source': __dirname,
    'target': 'user@server:/directory/anotherdirectory'
}

describe('linksDataUtils:', function() {
    var formattedLinkData

    describe('varify:', function() {
        it('should return true of the example data', function() {
            var formattedLinkData = linksDataUtils.format(linkData)
            var varifyResult = linksDataUtils.varify(formattedLinkData)
            expect(varifyResult).toBeTruthy()
        })
    })

})
