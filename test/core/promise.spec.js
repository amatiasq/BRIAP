define(function(require) {
	"use strict";

	var ScheduledSpec = require('test/core/schedule.spec');
	var BaseSpec = require('test/core/base.spec');

	var Schedule = require('core/schedule');
	var Promise = require('core/promise');
	var funct = require('core/tools').funct;

	describe('Promise type', function() {
		var scope = {};
		var spy, sut, future, schedule;

		function createPromise() {
			return Promise.create({ schedule: schedule });
		}

		function resetSut() {
			spy = sinon.spy();
			schedule = Schedule.create();
			sut = createPromise();
			future = sut.getFuture();
		}

		BaseSpec(Promise);

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
			});

			it('should call any callback passed to #onComplete after #fulfill is called', function() {
				sut.fulfill();
				schedule.flush();
				future.onComplete(spy);
				schedule.flush();
				expect(spy).called.once();
			});
		});

		describe('#fail method', function() {

			beforeEach(resetSut);

			it('should fail if the Future is already completed', function() {
				sut.fail();
				schedule.flush();
				expect(function() { sut.fail(); }).toThrowError();
			});

			it('should change Future\'s #isCompleted and #hasFailed methods to return true', function() {
				sut.fail();
				expect(future.isCompleted()).toBeFalse();
				expect(future.hasFailed()).toBeFalse();
				schedule.flush();
				expect(future.isCompleted()).toBeTrue();
				expect(future.hasFailed()).toBeTrue();
			});

			it('should call a callback added to the Future by the #onFail method', function() {
				future.onFail(spy);
				sut.fail();
				expect(spy).called.exactly(0);
				schedule.flush();
				expect(spy).called.once();
			});

			it('should pass the second argument I give to #onFail as scope', function() {
				future.onFail(spy, scope);
				sut.fail();
				schedule.flush();
				expect(spy).called.on(scope);
			});

			it('should recive as arguments anything I pass to #fail', function() {
				var error = {};
				future.onFail(spy);
				sut.fail(error);
				schedule.flush();
				expect(spy).called.withExactly(error);
			});

			it('should call any callback passed to #onFail after #fail is called', function() {
				sut.fail();
				schedule.flush();
				future.onFail(spy);
				schedule.flush();
				expect(spy).called.once();
			});
		});

		describe('#onFinally method...', function() {

			function testFinally(methodName, success) {
				beforeEach(resetSut);

				it('should execute the listener after the promise has failed or its fulfilled', function() {
					future.onFinally(spy);
					sut[methodName]();
					schedule.flush();
					expect(spy).called.once();
				});

				it('should call the listeners added after the promise has failed or its fulfilled', function() {
					sut[methodName]();
					schedule.flush();
					future.onFinally(spy);
					schedule.flush();
					expect(spy).called.once();
				});

				it('should recive if the promise has succeed as first argument', function() {
					future.onFinally(spy);
					sut[methodName]();
					schedule.flush();
					expect(spy.lastCall.args[0]).toBe(success)
				});

				it('should recive the error if the promise has failed or a array with the arguments if the promise has succeed as second argument', function() {
					var thing = {};
					future.onFinally(spy);
					sut[methodName](thing);
					schedule.flush();
					var args = spy.lastCall.args;
					if (success) {
						expect(args[1]).toBeArray()
						expect(args[1][0]).toBe(thing);
					} else {
						expect(args[1]).toBe(thing);
					}
				});
			}

			describe('... with #fulfill', function() {
				testFinally('fulfill', true);
			})
			describe('... with #fail', function() {
				testFinally('fail', false);
			});
		});

		describe('#then method', function() {
			beforeEach(resetSut);

			it('should delegate first argument to #onComplete, second to #onFail and thirth to #onFinally', function() {
				var spy1 = sinon.spy();
				var spy2 = sinon.spy();
				var spy3 = sinon.spy();

				var mock = sinon.mock(future);
				mock.expects('onComplete').once().withExactArgs(spy1);
				mock.expects('onFail').once().withExactArgs(spy2);
				mock.expects('onFinally').once().withExactArgs(spy3);

				future.then(spy1, spy2, spy3);
			});
		});

		describe('#parallel static method', function() {

			it('should delegate into #all static method passing arguments as array', function() {
				var promises = [
					createPromise(),
					createPromise()
				];
				var futures = promises.map(funct('getFuture'));

				var mock = sinon.mock(Promise);
				mock.expects('all').once().withArgs(futures);

				Promise.parallel(futures[0], futures[1]);
				mock.restore();
				mock.verify();
			});

		});

		describe('#all static method', function() {

			var promises, futures, clock, all;
			beforeEach(function() {
				resetSut();
				promises = [
					createPromise(),
					createPromise(),
					createPromise()
				];
				futures = promises.map(funct('getFuture'));
				clock = sinon.useFakeTimers();
				all = Promise.all(futures);
			});

			afterEach(function() {
				clock.restore();
				clock.tick(20);
			});

			it('should return a new promise to be acomplished when every passed futures are completed', function() {
				all.then(spy);
				promises.forEach(funct('fulfill'));
				schedule.flush();

				clock.restore();
				clock.tick(20);
				expect(spy).called.once();
			});

			it('should call error handlers if a single future fails', function() {
				all.then(null, spy);
				promises[0].fulfill();
				promises[1].fail();
				schedule.flush();

				clock.tick(20);
				expect(spy).called.once();
			});
		});

		describe('#serial static method', function() {

			var clock, handler;
			beforeEach(function() {
				clock = sinon.useFakeTimers();
				handler = sinon.spy();
			});
			afterEach(function() {
				clock.restore();
				clock.tick(20);
			});

			it('should recive a array of functions and call them secuentially on a new thread', function() {
				var spies = [
					sinon.spy(),
					sinon.spy(),
					sinon.spy()
				];

				Promise.serial(spies).then(handler);
				clock.tick(20);

				spies.forEach(function(spy) {
					expect(spy).called.once();
				});

				expect(handler).called.once();
			});

			it('should wait if the returned value is a future and pass the futures value to the next function', function() {
				var spy = sinon.spy();
				var promise = createPromise();
				var arg1 = {},
					arg2 = 'hi';

				Promise.serial([
					function() {
						return promise.getFuture();
					},
					spy
				]).then(handler);

				clock.tick(20);
				promise.fulfill(arg1, arg2);
				schedule.flush();
				clock.tick(20);

				expect(spy).called.once()
				expect(spy).called.withExactly(arg1, arg2);
				expect(handler).called.once();
			});

			it('should return the value returned by the last function', function() {
				var result = {};

				Promise.serial([
					function() {
						return result;
					}
				]).then(handler);

				clock.tick(20);
				expect(handler).called.withExactly(result);
			});

			it('should pass the second argument as the scope of the functions', function() {
				var spy = sinon.spy();
				var scope = {};

				Promise.serial([ spy ], scope);

				clock.tick(20);
				expect(spy).called.on(scope);
			});
		});
	});
});
