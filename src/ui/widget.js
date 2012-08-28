define(function(require) {

	var Base = require('core/base');

	return Base.extend({

		name: 'Widget',

		init: function(deps) {
			this.base(deps);
		}
	});

});
