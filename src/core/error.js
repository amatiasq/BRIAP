define(function(require) {

	var _ = require('Underscore');
	require('core/base');

	return _.extendNative(Error, {

		name: 'Error',

		init: function(deps, message) {
			this.base(deps);
			this.description = this.message = message;
		}
	});

});
