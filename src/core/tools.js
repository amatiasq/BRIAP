define(function(require) {
	"use strict";

	function empty() { };
	var has = Object.prototype.hasOwnProperty
	var slice = Array.prototype.slice;


	var hasOwn = has.call.bind(has);
	var args = slice.call.bind(slice);


	var functCache = {};
	function funct(name, var_args) {
		if (arguments.length > 1) {
			var args = Array.prototype.slice.call(arguments, 1);
			return function(obj) {
				return obj[name].apply(obj, args);
			};
		} else {
			if (!hasOwn(functCache, name)) {
				functCache[name] = function(obj) {
					return obj[name]();
				};
			}

			return functCache[name];
		}
	}


	var propCache = {};
	function prop(name) {
		if (!hasOwn(propCache, name)) {
			propCache[name] = function(obj) {
				return obj[name];
			};
		}

		return propCache[name];
	}


	function compose() {
		if (arguments.length === 0)
			return empty;

		var functs = args(arguments);
		var first = functs.pop();
		functs = functs.reverse();

		return function() {
			var result = first.apply(null, arguments);

			functs.forEach(function(funct) {
				result = funct(result);
			});

			return result;
		};
	}


	function dummy() { };
	function proto(obj) {
		dummy.prototype = obj;
		return new dummy;
	}


	return {
		compose: compose,
		funct: funct,
		prop: prop,
		proto: proto,
		hasOwn: hasOwn,
		args: args
	};

});
