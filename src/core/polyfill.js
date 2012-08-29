if (document.all) {

	var OriginalApply = Function.prototype.apply;
	Function.prototype.apply = function(scope, args) {
		OriginalApply.call(this, scope, args || []);
	};

}
