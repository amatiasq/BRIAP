define(function(require) {
	"use strict";

	var BaseSpec = require('test/core/base.spec');
	var Lang = require('core/lang');
	var Base = require('core/base');
	var Pool = require('core/pool');

	describe('Pool type', function() {

		BaseSpec(Pool);

		var sut;
		var SampleClass;
		var instance;

		beforeEach(function() {
			SampleClass = Base.extend();
			sut = Pool.create(SampleClass);
		});

		describe('#create method', function() {

			it('should return a instance the pool\'s class', function() {
				expect(Lang.is(sut.create(), SampleClass)).toBeTrue();
			});

			it('should return a different instance on each sequential call', function() {
				expect(sut.create()).not.toBe(sut.create());
			});

			it('should call instance\'s init method', function() {
				var called = false;
				SampleClass.include({
					init:function() {
						this.base();
						this.initialized = true;
						called = true;
					}
				});

				var instance = sut.create()

				expect(called).toBeTrue();
				expect(instance.initialized).toBeTrue();
			});

			it('should pass every argument to the object\'s #init method', function() {
				var arg1 = 1;
				var arg2 = function() {};
				var arg3 = {};
				var received = [];

				SampleClass.include({
					init:function(a, b, c, d) {
						this.base();
						received.push(a, b, c, d);
					}
				});

				sut.create(arg1, arg2, arg3);

				expect(received[0]).toBe(null);
				expect(received[1]).toBe(arg1);
				expect(received[2]).toBe(arg2);
				expect(received[3]).toBe(arg3);
			});
		});

		describe('#createWithDependencies method', function() {

			it('should return a instance the pool\'s class', function() {
				expect(Lang.is(sut.createWithDependencies(null), SampleClass)).toBeTrue();
			});

			it('should return a different instance on each sequential call', function() {
				expect(sut.createWithDependencies(null)).not.toBe(sut.create());
			});

			it('should call instance\'s init method', function() {
				var called = false;
				SampleClass.include({
					init:function() {
						this.base();
						this.initialized = true;
						called = true;
					}
				});

				var instance = sut.createWithDependencies(null)

				expect(called).toBeTrue();
				expect(instance.initialized).toBeTrue();
			});

			it('should pass every argument to the object\'s #init method', function() {
				var deps = {};
				var arg1 = 1;
				var arg2 = function() {};
				var arg3 = {};
				var received = [];

				SampleClass.include({
					init:function(a, b, c, d) {
						this.base();
						received.push(a, b, c, d);
					}
				});

				sut.createWithDependencies(deps, arg1, arg2, arg3);

				expect(received[0]).toBe(deps);
				expect(received[1]).toBe(arg1);
				expect(received[2]).toBe(arg2);
				expect(received[3]).toBe(arg3);
			});
		});

		describe('#destruct method', function() {

			beforeEach(function() {
				instance = sut.create();
			});

			it('should accept a instance of this class and call it\'s dispose method', function() {
				var mock = sinon.mock(instance);
				mock.expects('dispose').once();
				sut.destruct(instance);
				mock.verify();
			});
		});

		describe('#destruct - #create combination', function() {

			it('should #destruct save this instance to return it the next time I call #create method', function() {
				var instance = sut.create();
				instance.dispose()
				expect(sut.create()).toBe(instance);
			});

			it('should work even with multiple #create / #destruct like a stack', function() {
				var instance1 = sut.create();
				var instance2 = sut.create();
				var instance3 = sut.create();

				instance1.dispose();
				instance2.dispose();
				instance3.dispose();

				expect(sut.create()).toBe(instance3);
				expect(sut.create()).toBe(instance2);
				expect(sut.create()).toBe(instance1);
			});
		});
	});
});
