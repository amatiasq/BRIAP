/*

interface Emitter extends Base {
	void on(String signal, void handler(args...), Object scope);
	void off(String signal, void handler(args...), Object scope);
	void emit(String signal);
}

*/

define(function(require) {
	"use strict";

	var args = require('core/tools').args;
	var Base = require('core/base');

	return Base.extend({

		name: 'Emitter',

		init: function init(dependencies) {
			this.base(dependencies);
			this._listeners = {};
		},

		dispose: function dispose() {
			this._listeners = null;
			this.base();
		},

		listenersCount: function(signal) {
			var list = this._listeners[signal];
			return  list ? list.length : 0;
		},

		on: function on(signal, handler, scope) {
			if (!this._listeners[signal])
				this._listeners[signal] = [];

			this._listeners[signal].push({
				funct: handler,
				scope: scope
			});
		},

		off: function off(signal, handler, scope) {
			var list = this._listeners[signal];
			if (!list)
				return;

			this._listeners[signal] = list.filter(function(item) {
				return (
					item.funct !== handler ||
					item.scope !== scope
				);
			});
		},

		emit: function emit(signal) {
			var list = this._listeners[signal];
			if (!list)
				return;

			if (arguments.length > 1) {
				var data = args(arguments, 1);
				var action = function(item) {
					item.funct.apply(item.scope, data);
				};
			} else {
				var action = function(item) {
					item.funct.call(item.scope);
				};
			}

			list.forEach(action);
		}
	});
});
