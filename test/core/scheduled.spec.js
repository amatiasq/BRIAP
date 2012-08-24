define(function(require) {
	"use strict";

	var CallableSpec = require('test/core/callable.spec');
	var Scheduled = require('core/scheduled');
	var tick = 20;

	describe('Scheduled helper', function() {
		var scope = {},
			sut, spy, clock;

		CallableSpec(Scheduled);

		beforeEach(function() {
			clock = sinon.useFakeTimers();
			spy = sinon.spy();
			sut = Scheduled.create(null, spy, scope);
		});
		afterEach(function() {
			clock.tick(tick);
			clock.restore();
		});

		function tickAndExpectCalled(times) {
			clock.tick(tick);
			expect(spy).called.exactly(times);
		}

		it('should not call the spy if I call it', function() {
			sut();
			expect(spy).called.exactly(0);
		});

		it('should call the spy after I call it and javascript timer dispatches', function() {
			sut();
			tickAndExpectCalled(1);
		});

		it('should call only once, no matter how many times I call it on a thread', function() {
			sut();
			sut();
			tickAndExpectCalled(1);
		});

		it('should call once per each thread where the scheduled is executed', function() {
			sut();
			tickAndExpectCalled(1);
			sut();
			tickAndExpectCalled(2);
		});

		it('should not call if after execute it I call #cancel method', function() {
			sut();
			sut.cancel();
			tickAndExpectCalled(0);
		});

		it('should cancel itself if I dispose the object', function() {
			sut();
			sut.dispose();
			tickAndExpectCalled(0);
		})
	});
});
