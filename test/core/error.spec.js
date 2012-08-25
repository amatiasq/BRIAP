define(function(require) {

	var BaseSpec = require('test/core/base.spec');
	var Error = require('core/error');

	function ErrorSpec(Type) {
		BaseSpec(Type)

		it('should recive the message to display as first argument and I should be able to extract it by the #message field', function() {
			var message = 'testing';
			var sut = Type.create(message);
			expect(sut.message).toBe(message);
		})
	}

	describe('Error type', function() {
		ErrorSpec(Error);
	});

	return ErrorSpec;

});
