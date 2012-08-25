define(function(require) {
	"use strict";

	// var ScheduledSpec = require('test/core/scheduled.spec');
	var Schedule = require('core/schedule');
	var Promise = require('core/promise');

	describe('Promise type', function() {
		var scope = {};
		var spy, sut, future, schedule;
		function resetSut() {
			spy = sinon.spy();
			schedule = Schedule.create();
			sut = Promise.create({ schedule: schedule });
			future = sut.getFuture();
		}

		beforeEach(resetSut);

		describe('#fulfill method', function() {

			beforeEach(resetSut);

			it('should fail if the Future is already completed', function() {
				sut.fulfill();
				schedule.flush();
				expect(function() { sut.fulfill(); }).toThrowError();
			});

			it('should change Future\'s #isCompleted method to return true', function() {
				sut.fulfill();
				expect(future.isCompleted()).toBeFalse();
				schedule.flush();
				expect(future.isCompleted()).toBeTrue();
			});

			it('should call a callback added to the Future by the #onComplete method', function() {
				future.onComplete(spy);
				sut.fulfill();
				expect(spy).called.exactly(0);
				schedule.flush();
				expect(spy).called.once();
			});

			it('should pass the second argument I give to #onComplete as scope', function() {
				future.onComplete(spy, scope);
				sut.fulfill();
				schedule.flush();
				expect(spy).called.on(scope);
			});

			it('should recive as arguments anything I pass to #fulfill', function() {
				var arg1 = 34,
					arg2 = 'hi',
					arg3 = {};

				future.onComplete(spy);
				sut.fulfill(arg1, arg2, arg3);
				schedule.flush();
				expect(spy).called.withExactly(arg1, arg2, arg3);
			})
		});
	});
});
