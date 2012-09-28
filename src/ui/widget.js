define(function(require) {

	var Lang = require('core/lang');
	var Base = require('core/base');
	var Element = require('dom/element');

	return Base.extend({

		name: 'Widget',

		init: function(deps) {
			this.base(deps);

		},

		dispose: function() {
			this.base();
		},

		render: function(parent) {
			var dom = Lang.is(parent, Element) ? parent.dom() : parent;
			dom.appendChild(this._base.dom());
		}
	});
});
