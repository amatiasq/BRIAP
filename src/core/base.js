/*

interface Type<T> extends Object {
	String? name;
	T create(args...);
	void include(JSON methods);
	Type extend(JSON methods);
	String toString();
}

interface Base extends Object {
	Type type;
	void init(JSON dependencies);
	void dispose();
	String toString();
}

*/

define(function(require) {
	"use strict";

	require('SystemInternals');
	var _ = require('Underscore');
	var tools = require('core/tools');


	function dummy() { };

	function useBase(method, parent, name) {
		return function base() {
			var result, original = this.base;
			this.base = parent;
			// DEBUG INTO HERE!!!
			var result = method.apply(this, arguments);
			this.base = original;
			return result;
		};
	}

	function inject(proto, config) {
		_.each(config, function(value, name) {
			if (typeof value === 'function' && proto[name]) {
				proto[name] = useBase(value, proto[name], name);
			} else {
				proto[name] = value;
			}
		});
	}

	_.mixin({ useBase: inject });
	_.mixin({ extendNative: function(native, config) {
		return extend.call({
			getProto: function() {
				return new native;
			}
		}, config);
	}})


	function extend(config) {
		function ctor() { }
		var parent = dummy.prototype = this.getProto();
		var proto = ctor.prototype = new dummy;
		var name = 'Anonymous Type';

		if (config) {
			if (config.hasOwnProperty('name'))
				name = config.name;
			_.useBase(proto, config);
		}

		var deps = [null];

		var Type = proto.type = {

			name: name,
			extend: extend,

			create: function create() {
				var obj = new ctor;
				obj.init.apply(obj, deps.concat(tools.args(arguments)));
				return obj;
			},

			createWithDependencies: function createWithDependencies() {
				var obj = new ctor;
				obj.init.apply(obj, arguments);
				return obj;
			},

			destruct: function destruct(obj, props) {
				if (obj.$$alive)
					return obj.dispose();

				if (props) {
					props.forEach(function(i) {
						obj[i] = null;
					});
				}

				obj.$$alive = false;
			},

			getProto: function getProto() {
				return proto;
			},

			isTypeOf: function isTypeOf(target) {
				return target instanceof ctor;
			},

			include: function include(config) {
				_.useBase(proto, config);
			},

			toString: function toString() {
				return '[type ' + this.name + ']';
			}

		};

		return Type;
	}


	var count = 0;

	return _.extendNative(Object, {

		name: 'Base',

		init: function init(dependencies) {
			this.$$hash = count++;
			this.$$alive = true;
		},

		dispose: function dispose() {
			if (!this.$$alive)
				return;

			this.$$alive = false;
			var props = [];

			for (var i in this) {
				if (i === 'type')
					continue;

				if (this[i] &&
					this[i].dispose &&
					this[i].$$alive)
					throw new Error(this.toString() + ' has not disposed its property ' + i);

				props.push(i);
			}

			this.type.destruct(this, props);
		},

		toString: function toString() {
			return this.type.toString() + '{ hash: ' + this.$$hash + ' }';
		}

	});
});
