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
		//'test/core/polyfill.spec',
		'test/core/tools.spec',
		'test/core/lang.spec',

		/// LEVEL 1 ///
		'test/core/base.spec',
		'test/core/callable.spec',

		/// LEVEL 2 ///
		'test/core/emitter.spec',
		'test/core/emitter_mixin.spec',

		/// LEVEL 3 ///
		'test/core/pool.spec',
		'test/core/scheduled.spec',
		'test/core/promise.spec',
	], function() {
		console.profile("Testing..." + Date.now());
		mocha.run(function() {
			console.profileEnd();
			hideSuccess();

			function select(selector) {
				return Array.prototype.slice.call(document.querySelectorAll(selector));
			}

			function hideSuccess() {
				select('#mocha .suite').concat(select('#mocha .test')).forEach(function(el) { el.style.display = 'none'; });

				select('#mocha .fail').forEach(function(current) {
					current.style.display = 'block';
					while (current.parentNode) {
						current = current.parentNode;
						if (current.className && current.className === 'suite')
							current.className += " suiteFail";
					}
				});
				select('#mocha .suiteFail').forEach(function(el) { el.style.display = 'block'; });
			}

		});
	});
});
