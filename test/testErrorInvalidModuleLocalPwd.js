var rerequire = require('rerequire')
var utility = require('./utility')

exports.test = function (test) {
	return utility.testErrorInvalidModule(rerequire, test, './')
}

