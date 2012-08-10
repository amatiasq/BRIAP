define(function() {

	var slice = Array.prototype.slice;

	if (!Function.prototype.bind) {
		Function.prototype.bind = function bind (context) {
			var that = this;
			if (arguments.length>1) {
				var params = slice.call(arguments, 1);

				return function () {
					return that.apply(context, arguments.length ? params.concat(slice.call(arguments)) : params);
				};
			}

			return function () {
				return arguments.length ? that.apply(context, arguments) : that.call(context);
			};
		}
	}

	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}

	ArrayProto = Array.prototype;

	if (!ArrayProto.indexOf) {
		ArrayProto.indexOf = function(searchElement, fromIndex) {
			var len = this.length;
			if (len === 0)
				return -1;

			var n = Number(fromIndex);

			if (isNaN(n))
				n = 0;

			if (n >= len)
				return -1;

			var i = n < 0 ? len - Math.abs(n) : n;
			for (; i < len; i++)
				if (i in this && this[i] === searchElement)
					return i;

			return -1;
		};
	}

	if (!ArrayProto.lastIndexOf) {
		ArrayProto.lastIndexOf = function(searchElement /*, fromIndex */ ) {
			var len = this.length;
			if (len === 0)
			 return -1;

			var n = Number(fromIndex);

			if (isNaN(n))
				n = 0;

			var i = n > 0 ? Math.min(n, len - 1) : len - Math.abs(n);
			for (; i >= 0; i--)
				if (i in this && this[i] === searchElement)
					return i;

			return -1;
		};
	}

	if (!ArrayProto.every) {
		ArrayProto.every = function(callbackfn, thisArg) {
			var len = this.length;

			if (typeof callbackfn !== 'function')
				throw new TypeError(callbackfn + ' is not a function');

			for (var i = 0; i < len; i++)
				if (i in this && !callbackfn.call(thisArg, this[i], i, this))
					return false;

			return true;
		};
	}

	if (!ArrayProto.some) {
		ArrayProto.some = function(callbackfn, thisArg) {
			var len = this.length;

			if (typeof callbackfn !== 'function')
				throw new TypeError(callbackfn + ' is not a function');

			for (var i = 0; i < len; i++)
				if (i in this && callbackfn.call(thisArg, this[i], i, this))
					return true;

			return false;
		};
	}

	if (!ArrayProto.forEach) {
		ArrayProto.forEach = function(callbackfn, thisArg) {
			var len = this.length;

			if (typeof callbackfn !== 'function')
				throw new TypeError(callbackfn + ' is not a function');

			for (var i = 0; i < len; i++)
				if (i in this)
					callbackfn.call(thisArg, this[i], i, this);
		};
	}

	if (typeof Array.isArray !== 'function') {
		Array.isArray = function(val) {
			return Object.prototype.toString.apply(val) === '[object Array]';
		};
	}

});

/*



Date.prototype.toISOString
Date.now
Array.isArray
JSON
Function.prototype.bind
String.prototype.trim
Array.prototype.indexOf
Array.prototype.lastIndexOf
Array.prototype.every
Array.prototype.some
Array.prototype.forEach
Array.prototype.map
Array.prototype.filter
Array.prototype.reduce
Array.prototype.reduceRight

NaN !== NaN
*/
