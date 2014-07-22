var fs = require('fs')

var cache_mtime_property_name = '_rerequire_mtime'

module.exports= function(filename) {
	var module_name = filename
	var start = filename.substring(0, 2)
	if (start === './' || start === '..') {
		// If we use a relative path, the require would be evaluated relative to this module!
		// To get around this, we make it an absolute path
		module_name = process.env['PWD'] + '/' + filename
		// FIXME This probably doesn't work if rerequire is a grandchild dependency
	}

	var module = require.resolve(module_name)
	// Throws 'MODULE_NOT_FOUND'
	
	try {
		var module_stat = fs.statSync(module)
	} catch (err) {
		if (err.code === 'ENOENT') {
			// Cached entry in module path table still exists
			// But it's been deleted
			var e = new Error('Error: Cannot find module \'' + module_name + '\'')
			e.code = 'MODULE_NOT_FOUND'
			throw e
		}
	}
	
	var module_timestamp = module_stat.mtime.getTime()

	if (module in require.cache) {
		var cache_timestamp = require.cache[module][cache_mtime_property_name]

		if (module_timestamp != cache_timestamp) {
			delete require.cache[module]
		}
	}
	
	var module_ref = require(process.env['PWD'] + '/' + filename)
	
	// Add our property to track modification time
	require.cache[module][cache_mtime_property_name] = module_timestamp
	
	return module_ref
}
