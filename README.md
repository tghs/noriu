# rerequire

A wrapper for Node.js' <tt>require()</tt> with cache invalidation.

The Node.js runtime caches modules as you <tt>require()</tt> them. This is not always desirable. By using <tt>rerequire()</tt> instead, if the module has changed since it was last loaded, you'll get the new module rather than an old cached copy that you'd get from <tt>require()</tt>.

## Usage

```js
var rerequire = require('rerequire')

function callback() {
	var http = rerequire('http')
	var plugin = rerequire('./plugin')
}
```

## Installation

TODO

## Development

```sh
$ npm install -g nodeunit
$ ./test.sh
```
