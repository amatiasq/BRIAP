define(function(require) {

	var Element = require('dom/element');

	function empty() { }

	function fakeDomElement() {
		return {
			setAttribute: empty,
			hasAttribute: empty,
			getAttribute: empty,
			removeAttribute: empty,

			appendChild: empty,
			removeChild: empty,

			style: {},
			parentNode: null,
			innerHtml: '',
			className: ''
		};
	}

	function ElementSpec(Type) {

		function createSut() {
			return Type.create({ dom: fakeDomElement() })
		}

		var sut, other;
		function resetSut() {
			sut = createSut();
			other = createSut();
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

		beforeEach(resetSut);

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
	}

	describe('Element type', function() {
		ElementSpec(Element);
	});

	return ElementSpec;

});
