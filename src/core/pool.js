define(function(require) {
	"use strict";

	var Base = require('core/base');

	return Base.extend('Pool', {

		init: function init(deps, Type) {
			this.base();
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

		toString: function toString() {
			return '[pool ' + this._Type.name + ']';
		}

	});

});
