define(function(require) {
	"use strict";

	var $ = require('core/tools');

	describe('Generic tools', function() {

		var arg1 = 34,
			arg2 = 'cosa',
			arg3 = {};

		describe('#args function', function() {

			it('should convert a argument object into a array', function() {
				var args;
				(function dummy() { args = $.args(arguments) })(arg1, arg2, arg3);

				expect(args).toBeArray();
				expect(args.length).toBe(3);
				expect(args[0]).toBe(arg1);
				expect(args[1]).toBe(arg2);
				expect(args[2]).toBe(arg3);
			});

			it('should remove so many arguments from the start as indicated by the second argument', function() {
				var args;
				(function dummy() { args = $.args(arguments, 2) })(arg1, arg2, arg3);

				expect(args).toBeArray();
				expect(args.length).toBe(1);
				expect(args[0]).toBe(arg3);
			});
		});

		describe('#funct function', function() {

			var dummy;
			beforeEach(function() {
				dummy = { pepe: function() { } };
			});

			it('should return a function who calls a method named as the arg from the argument who recives', function() {
				var mock = sinon.mock(dummy);
				var sut = $.funct('pepe');
				mock.expects('pepe').once();
				sut(dummy);
				mock.verify();
			});

			it('should pass extra arguments to the method call', function() {
				var mock = sinon.mock(dummy);
				var sut = $.funct('pepe', arg1, arg2, arg3);

				mock.expects('pepe').once().withExactArgs(arg1, arg2, arg3);
				sut(dummy);
				mock.verify();
			});

			it('should return the value returned by the method', function() {
				var result = {};
				var stub = sinon.stub(dummy, 'pepe').returns(result);
				var sut = $.funct('pepe');

				expect(sut(dummy)).toBe(result);
			});
		});

		describe('#prop function', function() {
			it('should return a function who returns the value of a property of its argument', function() {
				var dummy = { cosa: {} };
				var sut = $.prop('cosa');
				expect(sut(dummy)).toBe(dummy.cosa);
			});
		});

		describe('#proto function', function() {
			it('should return a new object prototyping the passed argument', function() {
				var parent = {};
				var child = $.proto(parent);
				expect(Object.getPrototypeOf(child)).toBe(parent);
			});
		});

		describe('#compose function', function() {
			// TODO: Need both spy/stub behaviour in order to test this
			xit('should return a function who executes every argument chaining the results', function() {
				var spy1 = sinon.stub();
				var spy2 = sinon.stub();

				spy1.returns('hi');
				spy2.returns('hello!');
				var sut = $.compose(spy2, spy1);

				var result = sut('bye', 43);

				expect(spy1).called.once();
				expect(spy1.withExactArgs('bye', 43)).toBeTrue();
				expect(spy2.withExactArgs('hi')).toBeTrue();
				expect(result).toBe('hello!');
			});
		});

		describe('#name function', function() {
			it('should return a random name each time', function() {

			});
		});
	});
});
