define(function(require) {
	"use strict";

	require('core/lang');
	var _ = require('Underscore');


	function dummy() { };

	function useBase(method, parent, name) {
		return function() {
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


	function extend(name, config) {

		if (arguments.length === 1) {
			config = name;
			name = null;
		}

		function ctor() { }
		var parent = dummy.prototype = this.getProto();
		var proto = ctor.prototype = new dummy;

		inject(proto, config);

		var Type = proto.type = {

			name: name || 'Anonymous Type',

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
				inject(proto, config);
			},

			toString: function() {
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

	}, 'Base', {

		type: null,

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

		toString: function() {
			return this.type.toString() + '{ hash: ' + this.$$hash + ' }';
		}

	});
});
