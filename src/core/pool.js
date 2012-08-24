define(function(require) {
	"use strict";

	var Base = require('core/base');

	return Base.extend({

		name: 'Pool',

		init: function init(deps, Type) {
			this.base(deps);
			this._stack = [];
			this._Type = Type;
		},

		create: function create() {
			var instance;

			if (!this._stack.length) {
				instance = this._Type.create.apply(this._Type, arguments);
			} else {
				instance = this._stack.pop();
				instance.init.apply(instance, arguments);
			}

			instance.type = this;
			return instance;
		},

		destruct: function destruct(obj) {
			if (obj.$$alive)
				return obj.dispose();

			this._stack.push(obj);
		},

		getProto: function() {
			return this._Type.getProto();
		},

		isTypeOf: function(target) {
			return this._Type.isTypeOf(target);
		},

		include: function(config) {
			return this._Type.include(config);
		},

		toString: function toString() {
			return '[pool ' + this._Type.name + ']';
		}

	});

});
