define(function(require) {

	var Lang = require('core/lang');
	var BaseSpec = require('test/core/base.spec');
	var Element = require('dom/element');
	var Widget = require('ui/widget');

	function WidgetSpec(Type) {

		BaseSpec(Type);

		var sut, element;
		beforeEach(function() {
			sut = Type.create();
			element = sut.getContainer();
		});

		describe('#getContainer method', function() {
			it('should return a element representing the full widget', function() {
				expect(Lang.is(element, Element)).toBeTrue();
			});
		});

		describe('#render method', function() {
			it('should append a element to the element passed as argument', function() {
				var parent = Element.create();

				var mock = sinon.mock(parent);
				mock.expects('add').once().withExactArgs(element);

				sut.render(parent);
				mock.verify();
			});

			it('should append a element to the passed widget\'s container', function() {
				var parent = Widget.create();

				var mock = sinon.mock(parent.getContainer());
				mock.expects('add').once().withExactArgs(element);

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
