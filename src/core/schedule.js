/*

interface Schedule extends Callable {
	void execute(Function action [, Object scope [, Array args]]);
	void flush();
}

*/

define(function(require) {
	"use strict";

	var Callable = require('core/callable');

	function callFlush(obj) {
		return obj.flush();
	}

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
			var calls = this.calls;
			this.calls = [];

			calls.forEach(callFlush);
		}
	};

	manager.flush = manager.flush.bind(manager);

	return Callable.extend({
		name: 'Schedule',

		init: function(deps) {
			this.base(deps);
			this._scheduled = false;
			this._stack = [];
		},

		dispose: function() {
			this._stack = null;
			this.base();
		},

		execute: function(action, scope, args) {
			this._stack.push({
				action: action,
				scope: scope,
				args: args
			});

			if (this._scheduled)
				return;

			this._scheduled = true;
			manager.add(this);
		},

		flush: function() {
			this._scheduled = false;
			manager.remove(this);

			var stack = this._stack;
			this._stack = [];

			stack.forEach(function(i) {
				i.action.apply(i.scope, i.args);
			});
		}
	});
});
