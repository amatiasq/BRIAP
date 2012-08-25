define(function(require) {
	"use strict";

	var tools = require('core/tools');
	var Lang = require('core/lang');
	var Base = require('core/base');
	var Schedule = require('core/schedule');
	var Emitter = require('core/emitter');

	var funct = tools.funct;
	var schedule = Schedule.create();

	var Future = Base.extend({

		name: 'Future',

		init: function(deps) {
			this.base(deps);
			this._emitter = Emitter.create();
			this._completed = false;
			this._failed = false;
			this._error = null;

			this._callbacks = {
				'complete': [],
				'failed': [],
				'finally': []
			};
		},

		dispose: function() {
			this._emitter.dispose();
			this._callbacks['complete'].length = 0;
			this._callbacks['failed'].length = 0;
			this._callbacks['finally'].length = 0;
			this._callbacks = null;
			this.base();
		},

		isCompleted: function() {
			return this._completed;
		},

		hasFailed: function() {
			return this._failed;
		},

		hasSucceed: function() {
			return this._completed && !this._failed;
		},

		then: function(success, fail, after) {
			this.onComplete(success)
			this.onFail(fail)
			this.onFinally(after);
		},

		onComplete: function(callback, scope) {
			this._addCallback('complete', callback, scope);
			return this;
		},

		onFail: function(callback, scope) {
			this._addCallback('failed', callback, scope);
			return this;
		},

		onFinally: function(callback, scope) {
			this._addCallback('finally', callback, scope);
			return this;
		},

		_addCallback: function(type, callback, scope) {
			if (!Lang.is(callback, Function))
				return;

			if (this.isCompleted()) {
				this._emitter.emit('after-' + type, callback, scope);
			} else {
				this._callbacks[type].push({
					handler: callback,
					scope: scope
				});
			}
		},

		_getCallbacks: function(type) {
			return this._callbacks[type];
		}
	});

	var Promise = Base.extend({

		name: 'Promise',

		init: function(deps) {
			this.base(deps);
			this._schedule = (deps && deps.schedule) || schedule;
			this._future = Future.create(this._schedule);
		},

		dispose: function() {
			this._future.dispose(); this._future = null;
			this._schedule = null;
			this.base();
		},

		getFuture: function() {
			return this._future;
		},

		fulfill: function() {
			if (this._future.isCompleted())
				throw new Error('Promise already fulfilled');
			this._schedule(this._fulfill, this, [tools.args(arguments)]);
		},

		_fulfill: function(values) {
			this._complete(true, values);
		},

		fail: function(error) {
			if (this._future.isCompleted())
				throw new Error('Promise already fulfilled');
			this._schedule(this._fail, this, [error]);
		},

		_fail: function(error) {
			this._future._failed = true;
			this._future._error = error;
			this._complete(false, [error]);
		},

		_complete: function(success, args) {
			var future = this._future;
			var type = success ? 'complete' : 'failed';
			var finallyArgs = [ success, success ? args : args[0] ];
			future._completed = true;

			future._getCallbacks(type).forEach(function(i) {
				i.handler.apply(i.scope, args);
			});

			future._getCallbacks('finally').forEach(function(i) {
				i.handler.apply(i.scope, finallyArgs);
			});

			future._emitter.on('after-' + type, function(callback, scope) {
				this._schedule(callback, scope, args);
			}, this);

			future._emitter.on('after-finally', function(callback, scope) {
				this._schedule(callback, scope, finallyArgs);
			}, this);
		}
	});

	Promise.parallel = function() {
		return Promise.all(tools.args(arguments));
	};

	Promise.all = function(futures) {
		var promise = Promise.create();
		var values = [];

		futures.forEach(function(future, index) {
			future.then(function() {
				values[index] = tools.args(arguments);
				if (futures.every(funct('hasSucceed')))
					promise.fulfill.apply(promise, values);
			}, function(error) {
				// TODO: create promise error
				promise.fail({
					getError: function() {
						return error;
					},
					getIndex: function() {
						return index;
					}
				});
			});
		});

		return promise.getFuture();
	};

	Promise.serial = function(callbacks, scope) {
		if (!callbacks || callbacks.length === 0) {
			var tmp = Promise.create();
			tmp.fulfill();
			return tmp;
		}

		var promise = Promise.create();
		schedule(next, null, [ callbacks, scope, 0, promise, callbacks[0].call(scope) ]);
		return promise.getFuture();
	};

	function next(stack, scope, index, promise, value) {
		index++;

		if (index >= stack.length)
			return promise.fulfill(value);

		if (!Lang.is(value, Future))
			return next(stack, scope, index, promise, stack[index].call(scope, value));

		value.then(function() {
			next(stack, scope, index, promise, stack[index].apply(scope, arguments));
		}, function(error) {
			promise.fail({
				getError: function() {
					return error;
				},
				getIndex: function() {
					return index;
				}
			});
		});
	}

	return Promise;
});
