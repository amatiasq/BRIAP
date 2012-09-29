define(function(require) {

	var Lang = require('core/lang');
	var Base = require('core/base');
	var Element = require('dom/element');

	return Base.extend({

		name: 'Widget',

		init: function(deps) {
			this.base(deps);
			this._root = Element.create();
		},

		dispose: function() {
			this._root.dispose();
			this._root = null;
			this.base();
		},

		getContainer: function() {
			return this._root;
		},

		render: function(parent) {
			parent.add(this._root);
		}
	});
});
