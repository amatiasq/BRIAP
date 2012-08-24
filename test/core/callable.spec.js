define(function(require) {
	"use strict";

	var BaseSpec = require('test/core/base.spec');
	var Callable = require('core/callable');

	function CallableSpec(Type) {
		BaseSpec(Type);

		describe('callable behaviour', function() {

			var sut;
			beforeEach(function() {
				sut = Type.create();
			});

			it('should return a callable object', function() {
				expect(sut).toBeFunction();
			});

			it('should call the #execute method when I invoke it', function() {
				var mock = sinon.mock(sut)
				mock.expects('execute').once();
				sut();
				mock.verify();
			});

			it('should pass every recived argument to the #execute method', function() {
				var arg1 = 34,
					arg2 = 'hello',
					arg3 = {},
					mock = sinon.mock(sut);

				mock.expects('execute').withExactArgs(arg1, arg2, arg3);
				sut(arg1, arg2, arg3);
				mock.verify();
			});
		});
	}

	describe('Callable type', function() {
		CallableSpec(Callable);
	});

	return CallableSpec;
});
