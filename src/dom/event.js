define(function(require) {

	var tools = require('core/tools');
	var Base = require('core/base');

	function factory(prop, standard, special) {
		return function() {
			proto[prop] = tools.hasOwn(this._ne, prop) ? standard : special;
			return this[prop]();
		};
	}

	var Event = Base.extend({

		name: 'Event',

		init: function(deps, nativeEvent) {
			this.base();
			this._ne = nativeEvent;
		},

		dispose: function() {
			this._ne = null;
			this.base();
		},

		getType: function() { return this._ne.type },

		altKey: function() { return this._ne.altKey },
		ctrlKey: function() { return this._ne.ctrlKey },
		metaKey: function() { return this._ne.metaKey },
		shiftKey: function() { return this._ne.shiftKey },

		clientX: function() { return this._ne.clientX },
		clientY: function() { return this._ne.clientY },
		screenX: function() { return this._ne.screenX },
		screenY: function() { return this._ne.screenY },

		button: function() { return this._ne.button },
		keyCode: factory('keyCode',
			function IE() { return this._ne.keyCode },
			function STANDARD() { return this._ne.which }
		),
		wheelDelta: factory('wheelDelta',
			function STANDARD() { return this._ne.wheelDelta },
			function GECKO() { return this._ne.detail }
		),

		stopPropagation: factory('stopPropagation',
			function STANDARD() { this._ne.stopPropagation() },
			function IE() { this._ne.cancelBubble = true }
		),
		preventDefault: factory('preventDefault',
			function STANDARD() { this._ne.preventDefault() },
			function IE() { this._ne.returnValue = false }
		),

		relatedTarget: factory('relatedTarget',
			function STANDARD() { return this._ne.relatedTarget },
			function IE() { return this._ne.fromElement }
		),
		target: factory('target',
			function STANDARD() { return this._ne.target },
			function IE() { return this._ne.srcElement }
		),
		currentTarget: factory('currentTarget',
			function STANDARD() { return this._ne.currentTarget },
			function IE() { return this._ne.toElement }
		)
	});

	var proto = Event.getProto();

	return Event;
});
