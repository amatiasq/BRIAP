/*

interface Callable extends Base {
	execute(args...);
}

*/

define(function(require) {
	"use strict";

	var inject = require('Underscore').useBase;
	var tools = require('core/tools');
	var Base = require('core/base');

	function dummy() { }

	function getAllKeys(map) {
		var result = [];
		for (var i in map)
			if (i !== 'name')
				result.push(i);
		return result;
	}

	function extend(config) {
		var flag = {},
			parent = dummy.prototype = this.getProto(),
			proto = new dummy,
			name = 'Anonymous Type';

		if (config) {
			if (config.hasOwnProperty('name'))
				name = config.name;
			inject(proto, config);
		}

		var keys = getAllKeys(proto);

		var Type = proto.type = {

			name: name,
			extend: extend,

			create: function create() {
				function callable() {
					return callable.execute.apply(callable, arguments);
				}

				var key;
				for (var i = keys.length; i--; ) {
					key = keys[i];
					callable[key] = proto[key];
				}

				callable.__flag = flag;
				callable.init.apply(callable, [null].concat(tools.args(arguments)));
				return callable;
			},

			destruct: function destruct(obj) {
				if (obj.$$alive)
					return obj.dispose();
			},

			getProto: function getProto() {
				return proto;
			},

			isTypeOf: function isTypeOf(obj) {
				return obj.__flag === flag;
			},

			include: function include(config) {
				inject(proto, config);
				keys = getAllKeys(proto);
			},
		};

		return Type;
	};

	return extend.call(Base, {
		name: 'Callable',
		execute: function() { }
	});

});
