define(function(require) {
	"use strict";

	var tools = require('core/tools');
	var Base = require('core/base');
	var Emitter = require('core/emitter');
	var EventsHelper = require('dom/events_helper');
	var whitespace = /[\r\n\t]/g;

	function slashToUpper(name) {
		var words = name.split('-');
		var first = words.shift();
		return first + words.map(function(word) {
			return word.charAt(0).toUpperCase() + word.substr(1);
		}).join('');
	}

	function normalizeClass(el) {
		return (' ' + el.className + ' ').replace(whitespace, ' ');
	}

	return Base.extend({

		name: 'Element',
		tag: 'div',

		init: function(deps, dom) {
			this.base(deps);
			this._emitter = (deps && deps.emitter) || Emitter.create();
			this._el = dom || document.createElement(this.tag);
			this._listening = {};
		},

		dispose: function() {
			if (this.isOnDomTree())
				throw new Error('Cannot dispose a element attatched at the DOM');

			this._emitter.dispose();
			this._listening = null;
			this._el = null;
			this.base();
		},

		dom: function() {
			return this._el;
		},


		//////////////
		// DOM TREE //
		//////////////

		add: function(child) {
			this._el.appendChild(child.dom());
		},

		remove: function(child) {
			this._el.removeChild(child.dom());
		},

		// Alternative names:
		//	removeFromParent, exclude, selfRemove...
		deattach: function() {
			this._el.parentNode.removeChild(this._el);
		},

		isOnDomTree: function() {
			var current = this._el;
			while(current.parentNode) {
				current = current.parentNode;
				if (current === window)
					return true;
			}
			return false;
		},


		////////////////
		// ATTRIBUTES //
		////////////////

		setAttribute: function(key, value) {
			this._el.setAttribute(key, value);
		},

		hasAttribute: function(key) {
			return this._el.hasAttribute(key);
		},

		getAttribute: function(key) {
			return this._el.getAttribute(key);
		},

		removeAttribute: function(key) {
			this._el.removeAttribute(key);
		},


		////////////
		// STYLES //
		////////////

		setStyles: function(map) {
			tools.each(map, function(value, key) {
				this.setStyle(key, value);
			}, this);
		},

		setStyle: function(key, value) {
			this._el.style[slashToUpper(key)] = value;
		},

		hasStyle: function(key) {
			return slashToUpper(key) in this._el.style;
		},

		getStyle: function(key) {
			return this._el.style[slashToUpper(key)];
		},

		removeStyle: function(key) {
			delete this._el.style[slashToUpper(key)];
		},


		/////////////
		// CLASSES //
		/////////////

		hasClass: function(name) {
			return normalizeClass(this._el).indexOf(' ' + name + ' ') !== -1;
		},

		addClass: function(name) {
			if (!this.hasClass(name))
				this._el.className += ' ' + name;
		},

		removeClass: function(name) {
			this._el.className = normalizeClass(this._el).replace(' ' + name, '').trim();
		},

		toogleClass: function(name) {
			var has = this.hasClass(name);
			if (has)
				this.removeClass(name);
			else
				this.addClass(name);
			return !has;
		},


		////////////
		// EVENTS //
		////////////

		on: function(event, handler, scope) {
			this._nativeListener(event);
			this._emitter.on.call(this._emitter, event, handler, scope);
		},

		_nativeListener: function(event) {
			if (!this._emitter.listenersCount(event))
				EventsHelper.addListener(this._el, event, this._onEvent);
		},

		_onEvent: function(event) {
			this._emitter.emit(event.getType(), event);
		}
	});
});
