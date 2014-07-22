var noriu = require('noriu')
var utility = require('./utility')

exports.test = function (test) {
	return utility.testErrorCachedDeletedAfterNoriu(noriu, test, './')
}
