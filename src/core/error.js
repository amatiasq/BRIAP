define(function(require) {

	var _ = require('Underscore');
	var Base = require('core/base');
	var baseProto = Base.getProto();

	// We use Base's extend method to extend a Error without adding any methodSweet Child O' Mine
	var ErrorType = _.extendNative(Error, { name: 'Error' });

	// As we do not extend Base we include Base's protype methods as own
	ErrorType.include(Base.getProto());

	// Now we can add methods to error
	ErrorType.include({

		type: ErrorType,

		init: function(message) {
			this.base();
			this.description = this.message = message;
		}
	});

	return ErrorType;

});
