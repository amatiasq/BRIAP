define(function() {
	"use strict";

	var undefined;

	function addNative(type, name) {
		var text = '[object ' + name + ']';
		natives.push(type);
		nativeCheck.push(function(target) {
			return toString(target) === text;
		});
	}

	var call = Function.prototype.call,
		toString = call.bind(Object.prototype.toString),
		natives = [],
		nativeCheck = [];

	addNative(null, 'Null');
	addNative(Boolean, 'Boolean');
	addNative(Number, 'Number');
	addNative(String, 'String');
	addNative(Function, 'Function');
	addNative(Object, 'Object');
	addNative(Array, 'Array');
	addNative(Date, 'Date');

	function is(value, type) {
		if (typeof type === 'function' && value instanceof type)
			return true;

		var nativeIndex = natives.indexOf(type);
		if (nativeIndex !== -1) {
			if (type === null && value === undefined)
				return true;

			return nativeCheck[nativeIndex](value);
		}

		if (typeof type.isTypeOf === 'function')
			return type.isTypeOf(value);

		return false;
	}

	return {
		is: is
	};
});
