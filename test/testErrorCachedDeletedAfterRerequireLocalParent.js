var noriu = require('noriu')
var utility = require('./utility')

exports.test = function (test) {
	return utility.testErrorCachedDeletedAfternoriu(noriu, test, '../test/')
}
