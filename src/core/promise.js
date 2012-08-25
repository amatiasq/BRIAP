define(function(require) {
	"use strict";

	var tools = require('core/tools');
	var Base = require('core/base');
	var Schedule = require('core/schedule');

	var funct = tools.funct;
	var args = tools.args;

	var Future = Base.extend({

		name: 'Future',
		_completed: false,

		init: function(deps) {
			this.base(deps);
			this._callbacks = {
				'complete': [],
				'failed': [],
				'finally': []
			};
		},

		dispose: function() {
			this._callbacks['complete'].length = 0;
			this._callbacks['failed'].length = 0;
			this._callbacks['finally'].length = 0;
			this._callbacks = null;
			this.base();
		},

		isCompleted: function() {
			return this._completed;
		},

		onComplete: function(callback, scope) {
			this._callbacks['complete'].push({
				handler: callback,
				scope: scope
			});
		},

		_getCallbacks: function(type) {
			return this._callbacks[type];
		}
	});

	return Base.extend({

		name: 'Promise',

		init: function(deps) {
			this.base(deps);
			this._schedule = (deps && deps.schedule) || Schedule.create();
			this._future = Future.create();
		},

		dispose: function() {
			this._schedule.dispose();
			this._future.dispose();
			this._future = this._schedule = null;
			this.base();
		},

		getFuture: function() {
			return this._future;
		},

		fulfill: function() {
			if (this._future.isCompleted())
				throw new Error('Promise already fulfilled');

			this._completed = true;
			this._schedule(this._fulfill, this, [args(arguments)]);
		},

		_fulfill: function(values) {
			var future = this._future;
			future._completed = true;
			future._getCallbacks('complete').forEach(function(i) {
				i.handler.apply(i.scope, values);
			});
		}
	});
});
