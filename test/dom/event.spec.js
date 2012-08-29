define(function(require) {

	var BaseSpec = require('test/core/base.spec');
	var Event = require('dom/event');

	function fakeNativeEvent() {
		return {
			altKey: false,
			ctrlKey: true,
			shiftKey: true,
			metaKey: true,

			clientX: 0,
			clientY: 0,
			screenX: 0,
			screenY: 0,

			button: 0,
			type: 'click',

			// GECKO OPERA KHTML

			which: 0,

			stopPropagation: function() { },
			preventDefault: function() { },

			relatedTarget: document.createElement('div'),
			target: document.createElement('div'),
			currentTarget: document.createElement('div'),

			// IE OPERA KHTML

			wheelDelta: 0.0,

			// IE

			keyCode: 0,

			cancelBubble: false,
			returnValue: false,

			fromElement: document.createElement('div'),
			srcElement: document.createElement('div'),
			toElement: document.createElement('div'),

			// GECKO

			detail: 0.0
		};
	}

	function EventSpec(Type) {

		BaseSpec(Type);

		var sut, event;
		beforeEach(function() {
			event = fakeNativeEvent();
			sut = Type.create(event);
		});

		function testGetter(name, prop) {
			prop = prop || name;
			describe('#' + name + ' method', function() {
				it('should return the property native #' + prop, function() {
					expect(sut[name]()).toBe(event[prop]);
				});
			});
		}

		function testFunct(name) {
			describe('#' + name + ' method', function() {
				it('should call the native #' + name, function() {
					var mock = sinon.mock(event);
					mock.expects(name).once();
					sut[name]();
					mock.verify();
				});
			});
		}

		testGetter('getType', 'type');
		testGetter('button');
		testGetter('keyCode');
		testGetter('wheelDelta');

		testGetter('altKey');
		testGetter('ctrlKey');
		testGetter('metaKey');
		testGetter('shiftKey');

		testGetter('clientX');
		testGetter('clientY');
		testGetter('screenX');
		testGetter('screenY');

		testGetter('relatedTarget');
		testGetter('target');
		testGetter('currentTarget');

		testFunct('stopPropagation');
		testFunct('preventDefault');
	}

	describe('Event type', function() {
		EventSpec(Event);
	});

	return EventSpec;

});
