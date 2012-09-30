/*

bool is(Object value, Object type);

*/

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

		if (type === null)
			return value === null || value === undefined;

		var nativeIndex = natives.indexOf(type);
		if (nativeIndex !== -1)
			return nativeCheck[nativeIndex](value);

		if (typeof type.isTypeOf === 'function')
			return type.isTypeOf(value);

		return false;
	}


	var keys = [];
	function hiddenKey(identifier) {
		var key = 'h-' + identifier + '-' + Math.random();

		if (keys.indexOf(key) !== -1)
			return hiddenKey(identifier);

		keys.push(key);
		return key;
	}


	return {
		hiddenKey: hiddenKey,
		is: is
	};
});
