define(function(require) {

	var Lang = require('core/lang');
	var BaseSpec = require('test/core/base.spec');
	var Element = require('dom/element');
	var Widget = require('ui/widget');

	function WidgetSpec(Type) {

		BaseSpec(Type);

		var sut;
		beforeEach(function() {
			sut = Type.create();
		});

		describe('#getContainer method', function() {
			it('should return a element representing the full widget', function() {
				var container = sut.getContainer();
				expect(Lang.is(container, Element)).toBeTrue();
			});
		});

		describe('#render method', function() {
			it('should append a element to the element passed as argument', function() {
				var child = sut.getContainer();
				var parent = Element.create();

				var mock = sinon.mock(parent);
				mock.expects('add').once().withExactArgs(child);

				sut.render(parent);
				mock.verify();
			});
		});

	}

	describe('Widget type', function() {
		WidgetSpec(Widget);
	});

	return WidgetSpec;

});
