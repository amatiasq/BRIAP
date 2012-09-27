define(function(require) {
	"use strict";

	require('SystemInternalTests');
	var Lang = require('core/lang');
	var Base = require('core/base');

	function testType(Type) {

		var sut;
		function resetSut() {
			sut = Type.create();
		}

		describe('#create static method', function() {

			beforeEach(resetSut);

			it('should return a new object each time it\'s called', function() {
				expect(sut).not.toBeFalsy();
			});

			it('should return true when I call Lang.is passing the created object and the Type', function() {
				expect(Lang.is(sut, Type)).toBeTrue();
			});

			it('should call object\'s #init method who sets $$alive property to true', function() {
				expect(sut.$$alive).toBeTrue();
			});

			// TODO: test if it calls the init method
		});

		// TODO: Test 'create with dependencies'

		describe('#dispose static method', function() {

			beforeEach(resetSut);

			it('should call object\'s #dispose method', function() {
				var mock = sinon.mock(sut).expects('dispose').once();
				Type.destruct(sut);
				mock.verify()
			});

			it('only if the $$alive property is true', function() {
				sut.$$alive = false;
				var mock = sinon.mock(sut).expects('dispose').never();
				Type.destruct(sut);
				mock.verify();
			})

			it('the object should have the $$alive property setted to false after the call', function() {
				Type.destruct(sut)
				expect(sut.$$alive).toBeFalse()
			});

		});

		describe('#dispose method', function() {

			beforeEach(resetSut);

			it('should call the static destruct method ', function() {
				var mock = sinon.mock(Type).expects('destruct').once();
				sut.dispose();
				Type.destruct.restore();
				mock.verify();
			});

		});
	}

	function BaseSpec(Type) {

		testType(Type);

		describe('#extend static method', function() {

			testType(Type.extend());

			it('should create a new type with the static methods', function() {
				var SubType = Type.extend();
				expect(SubType).not.toBe(Type);
				expect(SubType.create).toBeFunction();
				expect(SubType.destruct).toBeFunction();
				expect(SubType.extend).toBeFunction();
			});

			it('should create object of the new Type', function() {
				var SubType = Type.extend();
				var sut = SubType.create();
				expect(sut).not.toBeFalsy();
				expect(Lang.is(sut, SubType)).toBeTrue();
			});

			it('should add every method I pass to the function to the created Type', function() {
				function a() { }

				var SubType = Type.extend({ a: a });
				var sut = SubType.create();
				expect(sut.a).toBe(a);
			});

			it('should provide the method with a this.base() function to call the overwitten method', function() {
				var spy = sinon.spy();
				function a() { this.base(); }

				var SubType = Type.extend({ a: spy });
				var FinalType = SubType.extend({ a: a });

				var sut = FinalType.create();
				sut.a();

				expect(spy).called.once();
			});

			it('should return the value returned by the parent method if I return the result of this.base()', function() {
				var result = 'hello!';
				function a_original() { return result };
				function a_overwrite() { return this.base(); }

				var SubType = Type.extend({ a: a_original });
				var FinalType = SubType.extend({ a: a_overwrite });

				var sut = FinalType.create();
				expect(sut.a()).toBe(result);
			});

		});

		describe('#include static method', function() {

			var SubType;
			beforeEach(function() {
				SubType = Type.extend();
			});

			it('should add passed methods to the type without replacing it', function() {
				function a() { }
				var original = SubType;
				SubType.include({ a: a });

				expect(SubType).toBe(original);
				expect(SubType.create().a).toBe(a);
			});

			it('should provide the method with a this.base() function to call the overwitten method', function() {
				var spy = sinon.spy();
				function a() { this.base(); }

				var SubType = Type.extend({ a: spy });
				SubType.include({ a: a });

				var sut = SubType.create();
				sut.a();

				expect(spy).called.once();
			});

			it('should return the value returned by the parent method if I return the result of this.base()', function() {
				var result = 'hello!';
				function a_original() { return result };
				function a_overwrite() { return this.base(); }

				var SubType = Type.extend({ a: a_original });
				SubType.include({ a: a_overwrite });

				var sut = SubType.create();
				expect(sut.a()).toBe(result);
			})
		});
	}

	describe('Base type', function() {
		BaseSpec(Base);
	});
	return BaseSpec;
});
