define(function(require) {

	var Base = require('core/base');
	var Element = require('dom/element');

	return Base.extend({

		name: 'Widget',

		init: function(deps) {
			this.base(deps);
		},

		dispose: function() {
			this.base();
		}
	});
});
