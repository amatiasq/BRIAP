define(function(require) {
	"use strict";

	var Lang = require('core/lang');
	var Base = require('core/base');
	var Pool = require('core/pool');

	describe('Pool type', function() {

		var sut;
		var SampleClass;
		var instance;

		function reset() {
			SampleClass = Base.extend();
			sut = Pool.create(null, SampleClass);
		}

		beforeEach(reset);

		describe('#create method', function() {

			beforeEach(reset);

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

				var mock = sinon.mock(SampleClass.getProto());
				mock.expects('init').once().withExactArgs(arg1, arg2, arg3);

				sut.create(arg1, arg2, arg3);

				mock.verify();
			});
		});

		describe('#destruct method', function() {

			beforeEach(function() {
				reset();
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

			beforeEach(reset);

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
