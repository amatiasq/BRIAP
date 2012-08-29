define(function(require) {

	var Pool = require('core/pool');
	var Event = Pool.create(require('dom/event'));

	function createEvent(handler) {
		return function(e) {
			var event = e || window.event;
			handler.call(this, Event.create(event));
		};
	}

	function addListener_STANDARD(element, event, handler) {
		element.addEventListener(event, createEvent(handler), true);
	}

	function addListener_ATTACH() {
		element.attachEvent('on' + event, createEvent(handler));
	}

	function removeListener_STANDARD() {
		element.removeEventListener(event, createEvent(handler), true);
	}

	function removeListener_ATTACH() {
		element.detachEvent(event, createEvent(handler), true);
	}

	var STANDARD = !!document.addEventListener;

	return {
		addListener: STANDARD ?
			addListener_STANDARD :
			addListener_ATTACH,
		removeListener: STANDARD ?
			removeListener_STANDARD :
			removeListener_ATTACH
	}

});
