var rerequire = require('rerequire')
var utility = require('./utility')

exports.test = function (test) {
	return utility.testErrorCachedDeletedAfterRerequire(rerequire, test, '')
}
