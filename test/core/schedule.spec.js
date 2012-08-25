define(function(require) {
	"use strict";

	var CallableSpec = require('test/core/callable.spec');
	var Schedule = require('core/schedule');
	var tick = 20;

	describe('Schedule helper', function() {
		var scope = {},
			sut, spy, clock;

		CallableSpec(Schedule);

		beforeEach(function() {
			spy = sinon.spy();
			clock = sinon.useFakeTimers();
			sut = Schedule.create();
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
			sut(spy);
			expect(spy).called.exactly(0);
		});

		it('should call the spy after I call it and javascript timer dispatches', function() {
			sut(spy);
			tickAndExpectCalled(1);
		});

		it('should call as many times as I add it', function() {
			sut(spy);
			sut(spy);
			tickAndExpectCalled(2);
		});

		it('should call per each thread where the scheduled is executed', function() {
			sut(spy);
			tickAndExpectCalled(1);
			sut(spy);
			tickAndExpectCalled(2);
		});

		it('should call using the scope given as secon argument', function() {
			sut(spy, scope);
			clock.tick(tick);
			expect(spy).called.on(scope);
		});

		it('should pass arguments given as thirth argument', function() {
			var arg1 = 64,
				arg2 = 'pepe',
				arg3 = {};

			sut(spy, scope, [ arg1, arg2, arg3 ]);
			clock.tick(tick);
			expect(spy).called.withExactly(arg1, arg2, arg3);
		});

		it('should work if inside a callback I schedule again', function() {
			sut(function() {
				sut(spy);
			});
			clock.tick(tick);
			expect(spy).called.once();
		});
	});
});
