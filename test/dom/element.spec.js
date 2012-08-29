define(function(require) {
	"use strict";

	var BaseSpec = require('test/core/base.spec');
	var Element = require('dom/element');

	function empty() { }

	function fakeDomElement() {
		return {
			setAttribute: empty,
			hasAttribute: empty,
			getAttribute: empty,
			removeAttribute: empty,

			addEventListener: empty,
			removeEventListener: empty,

			appendChild: empty,
			removeChild: empty,

			style: {},
			parentNode: null,
			innerHtml: '',
			className: ''
		};
	}

	function ElementSpec(Type) {

		BaseSpec(Type);

		function createSut() {
			return Type.create(fakeDomElement())
		}

		function testDelegate(target, method, args, delegate, delegatedMethod, expectedArgs, skip) {
			var mock = sinon.mock(delegate);
			var expectation = mock.expects(delegatedMethod).once();

			// HACK: browsers crash when try to test deattach arguments,
			//		remove the if when this is fixed.
			if (!skip)
				expectation.withExactArgs.apply(expectation, expectedArgs);

			target[method].apply(target, args);
			mock.verify();
		}

		var sut, other;
		beforeEach(function() {
			sut = createSut();
			other = createSut();
		});

		describe('Dom tree behaviour', function() {
			it('should delegate #add method into elements #appendChild method', function() {
				testDelegate(sut, 'add', [other], sut.dom(), 'appendChild', [other.dom()]);
			});

			it('should delegate #remove method into elements #removeChild method', function() {
				testDelegate(sut, 'remove', [other], sut.dom(), 'removeChild', [other.dom()]);
			});

			it('should delegate #deattach method into elements #removeChild method', function() {
				sut.dom().parentNode = other.dom();
				// HACK: We should trust the argument is what we expect,
				//		the browsers crashes when we try to test it.
				testDelegate(sut, 'deattach', [], other.dom(), 'removeChild', [], true); //[sut.dom()]);
			});
		});

		describe('Attributes edition behaviour', function() {
			it('should delegate #setAttribute method into elements #setAttribute method', function() {
				var args = [ 'some-attr', 'some-value' ];
				testDelegate(sut, 'setAttribute', args, sut.dom(), 'setAttribute', args);
			});

			it('should delegate #hasAttribute method into elements #hasAttribute method', function() {
				var args = [ 'some-attr' ];
				testDelegate(sut, 'hasAttribute', args, sut.dom(), 'hasAttribute', args);
			});

			it('should delegate #getAttribute method into elements #getAttribute method', function() {
				var args = [ 'some-attr' ];
				testDelegate(sut, 'getAttribute', args, sut.dom(), 'getAttribute', args);
			});

			it('should delegate #removeAttribute method into elements #removeAttribute method', function() {
				var args = [ 'some-attr' ];
				testDelegate(sut, 'removeAttribute', args, sut.dom(), 'removeAttribute', args);
			});
		});

		describe('Styles edition behaviour', function() {

			var value = {};

			function testStyles(mode) {
				mode('color', 'color');
				mode('font-size', 'fontSize');
				mode('background-color', 'backgroundColor');
			}

			it('#setStyle method should modify doms #style property', function() {
				testStyles(function(key, style) {
					sut.setStyle(key, value);
					expect(sut.dom().style[style]).toBe(value);
				});
			});

			it('#hasStyle method should look into #style property for the key', function() {
				testStyles(function(key, style) {
					expect(sut.hasStyle(key)).toBeFalse();
					sut.dom().style[style] = value;
					expect(sut.hasStyle(key)).toBeTrue();
				});
			});

			it('#getStyle method should return the value extracted from #style property', function() {
				testStyles(function(key, style) {
					expect(sut.getStyle(key)).toBeUndefined();
					sut.dom().style[style] = value;
					expect(sut.getStyle(key)).toBe(value);
				});
			});

			it('#getStyle method should return the value extracted from #style property', function() {
				testStyles(function(key, style) {
					sut.dom().style[style] = value;
					sut.removeStyle(key);
					expect(sut.hasStyle(key)).toBeFalse();
				});
			});

			it('#setStyles method should delegate into #setStyle method for each key', function() {
				var mock = sinon.mock(sut);
				mock.expects('setStyle').thrice();

				sut.setStyles({ 'a': 'a1', 'b': 'b2', 'c': 'c3',  });
				mock.verify();
			});
		});

		describe('CSS Class modification behaviour', function() {
			var sampleClass = 'sample-css-class';

			describe('#hasClass method', function() {

				it('should return true if nodes #className property has the text we look for', function() {
					var dom = sut.dom();
					expect(sut.hasClass(sampleClass)).toBeFalse();
					dom.className = sampleClass;
					expect(sut.hasClass(sampleClass)).toBeTrue();
				});

				it('even if it has other classes around', function() {
					var dom = sut.dom();
					dom.className = 'pepe ' + sampleClass + ' hola';
					expect(sut.hasClass(sampleClass)).toBeTrue();
				});

				it('should search for the whole word, not as part of another class', function() {
					var dom = sut.dom();
					dom.className = 'pepe' + sampleClass + 'hola';
					expect(sut.hasClass(sampleClass)).toBeFalse();
				});
			});

			describe('#addClass method', function() {
				it('should add the class to #className property', function() {
					sut.addClass(sampleClass);
					expect(sut.hasClass(sampleClass)).toBeTrue();
				});

				it('shouldnt do nothing if it has already the class', function() {
					var dom = sut.dom();
					dom.className = sampleClass;
					sut.addClass(sampleClass);
					expect(dom.className).toBe(sampleClass);
				});
			});

			function classes(el) {
				return el.className.split(' ').filter(function(val) { return !!val.trim(); });
			}

			describe('#removeClass method', function() {
				it('should do nothing if the #className property doesnt has the class', function() {
					sut.removeClass(sampleClass);
					expect(classes(sut.dom()).length).toBe(0);
				});

				it('should remove the class if it is on the #className property', function() {
					var dom = sut.dom();
					dom.className = sampleClass;
					sut.removeClass(sampleClass);
					expect(classes(dom).length).toBe(0);
				});

				it('should remove the class even if its between other classes', function() {
					var dom = sut.dom();
					dom.className = 'pepe ' + sampleClass + ' cosa';
					sut.removeClass(sampleClass);
					var result = classes(dom);
					expect(result.length).toBe(2);
					expect(result[0]).toBe('pepe');
					expect(result[1]).toBe('cosa');
				});
			});

			describe('#toogleClass method', function() {
				it('should add the class if its not in the element', function() {
					sut.toogleClass(sampleClass);
					expect(sut.hasClass(sampleClass)).toBeTrue();
				});

				it('should remove the class if its in the element', function() {
					sut.addClass(sampleClass);
					sut.toogleClass(sampleClass);
					expect(sut.hasClass(sampleClass)).toBeFalse();
				})
			});
		});

		xdescribe('Events behaviour', function() {

			describe('#on method', function() {
				it('should add a listener to the dom if its the first time this event is added', function() {
					var mock = sinon.mock(sut.dom());
					mock.expects('addEventListener').once().withArgs('click');

					sut.on('click', function() { });
					mock.verify();
				});
			});
		});
	}

	describe('Element type', function() {
		ElementSpec(Element);
	});

	return ElementSpec;

});
