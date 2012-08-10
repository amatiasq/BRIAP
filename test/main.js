// This is key!
require.config({
	baseUrl: '../src',

	paths: {
		'Underscore': '../lib/underscore-require',
		'mocha_adapter': '../lib/test/mocha_adapter',
		'expect': '../lib/test/expect',
		'expect-sinon': '../lib/test/expectSinon',
		'sinon': '../lib/test/sinon-1.3.4',
		'mocha': '../lib/test/mocha',
		'test': '../test'
	},

	shim: {
		'mocha': {
			deps: [ 'expect', 'sinon', 'mocha_adapter' ]
		},
		'sinon': {
			deps: [ 'expect-sinon' ]
		},
		'expect-sinon': {
			deps: [ 'expect' ]
		}
	}
});

require([ 'mocha' ], function() {

	mocha.setup("bdd");

	require([
		'test/core/polyfill.spec',
		//'test/core/base.spec',
		/*
		'test/core/lang.spec',
		'test/core/pool.spec',
		'test/core/emitter.spec',
		'test/core/memitter.spec',
		*/
	], function() {
		mocha.run();
	});
});
