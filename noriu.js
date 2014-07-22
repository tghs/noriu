var fs = require('fs')

var cache_mtime_property_name = '_noriu_mtime'

module.exports= function(module_name) {
	var full_module_name = module_name
	
	var start = module_name.substring(0, 2)
	if (start === './' || start === '..') {
		// If we use a relative path, the require would be evaluated relative to this module!
		// To get around this, we make it an absolute path
		full_module_name = process.env['PWD'] + '/' + module_name
		// FIXME This probably doesn't work if noriu is a grandchild dependency
	}
	
	var module = require.resolve(full_module_name)
	// Throws 'MODULE_NOT_FOUND'
	
	var module_ref = null
	
	if (module.substring(0, 1) === '/') {
		// Cachable module
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
		
		module_ref = require(full_module_name)
		
		// Add our property to track modification time
		require.cache[module][cache_mtime_property_name] = module_timestamp
	} else {
		// Standard library module
		module_ref = require(full_module_name)
	}
	
	return module_ref
}
