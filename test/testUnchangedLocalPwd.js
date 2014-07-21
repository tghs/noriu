var rerequire = require('rerequire').rerequire
var utility = require('./utility')

exports.test = function (test) {
	return utility.testUnchanged(rerequire, test, './')
}
