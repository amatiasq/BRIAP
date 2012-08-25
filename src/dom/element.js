define(function(require) {

	var tools = require('core/tools');
	var Base = require('core/base');

	function slashToUpper(name) {
		var words = name.split('-');
		var first = words.shift();
		return first + words.map(function(word) {
			return word.charAt(0).toUpperCase() + word.substr(1);
		}).join('');
	}

	return Base.extend({

		name: 'Element',

		init: function(deps) {
			this.base(deps);
			this._el = (deps && deps.dom) || document.createElement('div');
			this._el.setAttribute('data-element-id', this.$$hash);
		},

		dispose: function() {
			if (this.isOnDomThree())
				throw new Error('Cannot dispose a element attatched at the DOM');

			this._el.removeAttribute('data-element-id');
			this._el = null;
			this.base();
		},

		dom: function() {
			return this._el;
		},


		//////////
		// TREE //
		//////////

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
		}
	});
});
