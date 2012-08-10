define(function(require) {
	"use strict";

	var Emitter = require('core/emitter');
	var BaseSpecs = require('test/core/base.spec');

	describe('Emitter class', function() {

		BaseSpecs(Emitter);

		var sampleEvent = 'dummy';
		var anotherEvent = 'another';
		var scope = {};
		var sut;

		function resetSut() {
			sut = Emitter.create();
		}

		function addListener() {
			var spy = sinon.spy();
			sut.on(sampleEvent, spy, scope);
			return spy;
		}

		function emit() {
			sut.emit(sampleEvent);
		}

		beforeEach(resetSut);

		it('should return 0 listeners for some random signal on a new created emitter', function() {
			expect(sut.listenersCount(sampleEvent)).toBe(0);
		});

		describe('When I add a listener...', function() {
			var spy;

			function resetSpy() {
				resetSut();
				spy = addListener();
			}
			beforeEach(resetSpy);

			it('should return 1 listeners for some random signal after on method is called with this random signal and a handler', function() {
				expect(sut.listenersCount(sampleEvent)).toBe(1);
			});

			it('another signal should have no listeners', function() {
				expect(sut.listenersCount(anotherEvent)).toBe(0);
			});

			it('should call as many listeners as I add', function() {
				var spy2 = addListener();
				emit();

				expect(spy).called.once();
				expect(spy2).called.once();
			});

			describe('... and emit it...', function() {

				beforeEach(function() {
					resetSpy();
					emit();
				})

				it('should call a listener binded to a signal when the emit method is called with this signal', function() {
					expect(spy).called.once();
				});

				it('should be called with the scope given as the thirth argument for the .on() method', function() {
					expect(spy).called.on(scope);
				});

				it('should call the listeners as many times as I call .emit() method', function() {
					emit();
					expect(spy).called.twice();
				});
			});

			describe('... I should be able to remove it', function() {

				beforeEach(resetSpy);

				it('should remove a listener added by the .on() method calling the .off() with the same arguments', function() {
					sut.off(sampleEvent, spy, scope);
					expect(sut.listenersCount(sampleEvent)).toBe(0);
				});
			});
		});
	});
});
