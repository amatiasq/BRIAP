// This is key!

var profile = false;
var coverage = false;

require.config({
	baseUrl: coverage ? '../src-cov' : '../src',

	paths: {
		'SystemInternals': '../lib/dummy/m1',
		'SystemInternalTests': '../lib/dummy/m2',
		'Polyfill': '../lib/es5-shim',
		'Underscore': '../lib/underscore-require',

		'mocha_adapter': '../lib/test/mocha_adapter',
		'expect': '../lib/test/expect',
		'expect-sinon': '../lib/test/expectSinon',
		'sinon': '../lib/test/sinon-1.3.4',
		'mocha': '../lib/test/mocha',

		'test': '../test'
	},

	shim: {
		'SystemInternals': {
			deps: [ 'Polyfill', 'core/lang' ]
		},
		'SystemInternalTests': {
			deps: [ 'SystemInternals', 'test/core/lang.spec' ]
		},
		'core/lang': {
			deps: [ 'Polyfill' ]
		},

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
	mocha.setup({
		ui: "bdd",
		globals: [
			'setTimeout',
			'setInterval',
			'clearTimeout',
			'clearInterval'
		]
	});

	require([
		/// LEVEL 0 ///
		'test/core/tools.spec',
		'test/core/lang.spec',

		/// LEVEL 1 ///
		'test/core/base.spec',
		'test/core/error.spec',
		'test/core/callable.spec',

		/// LEVEL 2 ///
		'test/core/emitter.spec',
		'test/core/emitter_mixin.spec',

		/// LEVEL 3 ///
		'test/core/pool.spec',
		'test/core/schedule.spec',
		'test/core/promise.spec',

		/// LEVEL 4 ///
		'test/dom/element.spec',
	], function() {

		if (profile)
			console.profile("Testing..." + Date.now())
		mocha.run(function() {
			if (profile)
				console.profileEnd();

			if (!hideMochaSuccess() && coverage)
				htmlcov();
		});
	});
});
