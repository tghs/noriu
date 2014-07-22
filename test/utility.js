var fs = require('fs')
var touch = require('touch')
var cp = require('cp')

function test_module(module_name) {
	var module_prefix = 'target/'
	
	return module_prefix + module_name
}

exports.copyModule = function (src_mod_name, dest_mod_name, touch_time) {
	var src_name = test_module(src_mod_name) + '.js'
	var dest_name = test_module(dest_mod_name) + '.js'
	
	if (fs.existsSync(dest_name)) {
		fs.unlinkSync(dest_name)
	}
	cp.sync(src_name, dest_name)
	touch.sync(dest_name, {mtime: touch_time})
}

exports.deleteModule = function (mod_name) {
	var filename = test_module(mod_name) + '.js'
	if (fs.existsSync(filename)) {
		fs.unlinkSync(filename)
	}
}

exports.testAfterRequire = function (noriu, test, target_prefix) {
	var touch_time = new Date()
	
	exports.copyModule('target_1', 'target', touch_time)
	var target_1 = null
	if (target_prefix === undefined) {
		target_1 = require('target')
	} else {
		target_1 = require(target_prefix + test_module('target'))
	}
	test.ok(target_1.target_1)
	test.ok(! target_1.target_2)
	
	exports.copyModule('target_2', 'target', touch_time)
	var target_2 = null
	if (target_prefix === undefined) {
		target_2 = noriu(target_prefix + 'target')
	} else {
		target_2 = noriu(target_prefix + test_module('target'))
	}
	test.ok(target_2.target_2)
	test.ok(! target_2.target_1)
	
	test.done()
}

exports.testChanged = function (noriu, test, target_prefix) {
	var touch_time_1 = new Date()
	var touch_time_2 = touch_time_1 + 10
	
	exports.copyModule('target_1', 'target', touch_time_2)
	var target_1 = null
	if (target_prefix === undefined) {
		target_1 = noriu('target')
	} else {
		target_1 = noriu(target_prefix + test_module('target'))
	}
	test.ok(target_1.target_1)
	test.ok(! target_1.target_2)
	
	exports.copyModule('target_2', 'target', touch_time_2)
	var target_2 = null
	if (target_prefix === undefined) {
		target_2 = noriu(target_prefix + 'target')
	} else {
		target_2 = noriu(target_prefix + test_module('target'))
	}
	test.ok(target_2.target_2)
	test.ok(! target_2.target_1)
	
	test.done()
}

exports.testUnchanged = function (noriu, test, target_prefix) {
	var touch_time = new Date()
	
	exports.copyModule('target_1', 'target', touch_time)
	var target_1 = null
	if (target_prefix === undefined) {
		target_1 = noriu('target')
	} else {
		target_1 = noriu(target_prefix + test_module('target'))
	}
	test.ok(target_1.target_1)
	test.ok(! target_1.target_2)
	
	exports.copyModule('target_2', 'target', touch_time)
	var target_2 = null
	if (target_prefix === undefined) {
		target_2 = noriu(target_prefix + 'target') // TODO fix these
	} else {
		target_2 = noriu(target_prefix + test_module('target'))
	}
	test.ok(target_2.target_1)
	test.ok(! target_2.target_2)
	
	test.done()
}

// Testing errors

exports.testErrorInvalidModule = function (noriu, test, target_prefix) {
	try {
		noriu(target_prefix + '_noriu_nonexistent_module')
		test.fail()
	} catch (err) {
		// TODO compare with require()'s return
		if (err.code !== 'MODULE_NOT_FOUND') {
			test.fail()
		}
	}
	
	test.done()
}

exports.testErrorCachedDeletedAfterRequire = function (noriu, test, target_prefix) {
	exports.copyModule('target_1', 'target', new Date())
	var mod_1 = require(target_prefix + test_module('target'))
	
	exports.deleteModule('target')
	try {
		var mod_2 = noriu(target_prefix + test_module('target'))
		
		// require() gets here, but noriu() shouldn't
		test.fail()
	 } catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') {
			test.fail()
		}
	}
	
	test.done()
}

exports.testErrorCachedDeletedAfternoriu = function (noriu, test, target_prefix) {
	exports.copyModule('target_1', 'target', new Date())
	var mod_1 = noriu(target_prefix + test_module('target'))
	
	exports.deleteModule('target')
	try {
		var mod_2 = noriu(target_prefix + test_module('target'))
		
		// require() gets here, but noriu() shouldn't
		test.fail()
	 } catch (err) {
		if (err.code !== 'MODULE_NOT_FOUND') {
			test.fail()
		}
	}
	
	test.done()
}

