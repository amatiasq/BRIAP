define(function(require) {
	"use strict";

	var Emitter = require('core/emitter');

	var EmitterMixin = {

		init: function init(deps) {
			this.base(deps);
			var EmitterType = (deps && deps.Emitter) || Emitter;
			this._emitter = EmitterType.create();
		},

		dispose: function dispose() {
			this.base();
			this._emitter.dispose();
		},

		on: function on(signal, handler, scope) {
			this._emitter.on.apply(this._emitter, arguments);
		},

		off: function off(signal, handler, scope) {
			this._emitter.off.apply(this._emitter, arguments);
		}
	};

	return EmitterMixin;
});
