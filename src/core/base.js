define(function(require) {
	"use strict";

	require('core/polyfill');
	require('core/lang');
	var _ = require('Underscore');


	function dummy() { };

	function useBase(method, parent, name) {
		return function base() {
			var result, original = this.base;
			this.base = parent;
			// DEBUG INTO HERE!!!
			var result = method.apply(this, arguments);
			this.base = original;
			return result;
		}
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

		var Type = proto.type = {

			name: name,
			extend: extend,

			create: function create() {
				var obj = new ctor;
				obj.init.apply(obj, arguments);
				return obj;
			},

			destruct: function destruct(obj) {
				if (obj.$$alive)
					obj.dispose();
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

	return extend.call({

		getProto: function() {
			return {};
		}

	}, {

		type: null,
		name: 'Base',

		init: function init(dependencies) {
			this.$$hash = count++;
			this.$$alive = true;
		},

		dispose: function dispose() {
			if (!this.$$alive)
				return;

			this.$$alive = false;
			this.type.destruct(this);
		},

		toString: function toString() {
			return this.type.toString() + '{ hash: ' + this.$$hash + ' }';
		}

	});
});
