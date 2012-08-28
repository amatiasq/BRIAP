define(function(require) {

	var BaseSpec = require('test/core/base.spec');
	var Widget = require('ui/widget');

	function WidgetSpec(Type) {

		BaseSpec(Type);

	}

	describe('Widget type', function() {
		WidgetSpec(Widget);
	});

	return WidgetSpec;

});
