/*

interface Pool<T> implements Type<T> extends Base {

}

*/

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

		_get: function(method, args) {
			var instance;

			if (!this._stack.length) {
				instance = this._Type[method].apply(this._Type, args);
			} else {
				instance = this._stack.pop();
				instance.init.apply(instance, args);
			}

			instance.type = this;
			return instance;
		},

		create: function create() {
			return this._get('create', arguments);
		},

		createWithDependencies: function createWithDependencies() {
			return this._get('createWithDependencies', arguments);
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
			var name = (this._Type && this._Type.name) || 'None'
			return '[pool ' + name + ']';
		}

	});

});
