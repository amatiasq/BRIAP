/*

interface Scheduled extends Callable {
	void flush();
	void cancel();
}

*/

define(function(require) {
	"use strict";

	function funct(name) {
		return function(obj) {
			obj[name]();
		};
	}

	var Callable = require('core/callable');

	var manager = {

		calls: [],
		timer: null,
		scheduled: false,

		add: function(call) {
			this.calls.push(call);

			if (this.scheduled)
				return;

			this.scheduled = true;
			this.timer = setTimeout(this.flush, 0);
		},

		remove: function(call) {
			var index = this.calls.indexOf(call);
			if (index !== -1)
				this.calls.splice(index, 1);

			if (this.calls.length === 0)
				this.unschedule();
		},

		unschedule: function() {
			if (!this.scheduled)
				return;

			clearTimeout(this.timeout);
			this.scheduled = false;
		},

		flush: function() {
			this.unschedule();
			this.calls.forEach(funct('flush'));
			this.calls.length = 0;
		}
	};

	manager.flush = manager.flush.bind(manager);

	return Callable.extend({
		name: 'Scheduled',

		init: function(deps, action, scope) {
			this.base(deps);
			this._scheduled = false;
			this._action = action;
			this._scope = scope;
		},

		dispose: function() {
			this.cancel();
			this.base();
		},

		execute: function() {
			if (this._scheduled)
				return;

			this._scheduled = true;
			manager.add(this);
		},

		flush: function() {
			this._scheduled = false;
			this._action();
		},

		cancel: function() {
			if (!this._scheduled)
				return;

			manager.remove(this);
			this._scheduled = false;
		}
	});
});
