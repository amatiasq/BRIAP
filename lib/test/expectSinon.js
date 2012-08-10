(function() {

	function array(args) {
		return Array.prototype.slice.call(args);
	}

	var ExpectTools = expect.ExpectTools;
	var ExpectationBase = expect.ExpectationBase;

	var CalledBase = ExpectTools.extend({
		_modifier: '',

		_methods: {
			on: 'on',
			withArgs: 'withArgs',
			withExactly: 'withExactly',
			withMatch: 'withMatch'
		},

		sinonMsg: function(target, text, objetive) {
			return this.standardMsg(target, 'have ' + this._modifier + ' been called ' + text, objetive);
		},

		on: function(object) {
			return this.test(this.value[this._methods.on](object), this.sinonMsg(this.value, 'on', object));
		},

		withArgs: function(var_args) {
			return this.test(this.value[this._methods.withArgs].apply(this.value, arguments), this.sinonMsg(this.value, 'with args', array(arguments)));
		},

		withExactly: function(var_args) {
			return this.test(this.value[this._methods.withExactly].apply(this.value, arguments), this.sinonMsg(this.value, 'with exactly args', array(arguments)));
		},

		withMatch: function(var_args) {
			return this.test(this.value[this._methods.withMatch].apply(this.value, arguments), this.sinonMsg(this.value, 'with args matching', array(arguments)));
		}
	});

	var AlwaysCalled = CalledBase.extend({
		to: ' to ',
		success: true,
		_modifier: 'always',

		_methods: {
			on: 'alwaysCalledOn',
			withArgs: 'alwaysCalledWith',
			withExactly: 'alwaysCalledWithExactly',
			withMatch: 'alwaysCalledWithMatch'
		}
	});

	var NotAlwaysCalled = AlwaysCalled.extend({
		to: ' to not ',
		success: false,
	});

	var SometimeCalled = CalledBase.extend({
		to: ' to ',
		success: true,
		_modifier: '',

		_methods: {
			on: 'calledOn',
			withArgs: 'calledWith',
			withExactly: 'calledWithExactly',
			withMatch: 'calledWithMatch'
		}
	});

	var NeverCalled = SometimeCalled.extend({
		to: ' to never ',
		success: false
	});

	var Called = SometimeCalled.extend({
		constructor: function(value) {
			SometimeCalled.call(this, value);
			this.always = new AlwaysCalled(value);
			this.never = new NeverCalled(value);
		},

		before: function(spy) {
			return this.test(this.value.calledBefore(spy), this.sinonMsg(this.value, 'before', spy));
		},
		after: function(spy) {
			return this.test(this.value.calledAfter(spy), this.sinonMsg(this.value, 'after', spy));
		},

		withNew: function() {
			return this.test(this.value.calledWithNew(), this.sinonMsg(this.value, 'with new'));
		},

		some: function(object) {
			return this.test(this.value.called, this.sinonMsg(this.value, 'on', object));
		},
		exactly: function(times) {
			return this.test(this.value.callCount == times, this.sinonMsg(this.value, 'exactly ' + times + ' times'));
		},

		once: function(object) {
			return this.test(this.value.calledOnce, this.sinonMsg(this.value, 'once'));
		},
		twice: function(object) {
			return this.test(this.value.calledTwice, this.sinonMsg(this.value, 'twice'));
		},
		thrice: function(object) {
			return this.test(this.value.calledThrice, this.sinonMsg(this.value, 'thrice'));
		}
	});

	var NotCalled = Called.extend({
		to: ' to not ',
		success: false
	});

	var Always = ExpectTools.extend({
		to: ' to always ',
		success: true,

		threw: function(target) {
			return this.test(this.value.alwaysThrew(target), this.standardMsg(this.value, 'throw error', target));
		},

		returned: function(value) {
			return this.test(this.value.alwaysReturned(value), this.standardMsg(this.value, 'return', target));
		}
	});

	var Never = Always.extend({
		to: ' to never ',
		success: false
	});

	var SinonExpectation = ExpectationBase.extend({
		threw: function(target) {
			return this.test(this.value.threw(target), this.standardMsg(this.value, 'throw error', target));
		},

		returned: function(value) {
			return this.test(this.value.returned(value), this.standardMsg(this.value, 'return', value));
		}
	});

	var Expectation = SinonExpectation.extend({
		success: true,
		to: ' to ',

		constructor: function(value) {
			SinonExpectation.call(this, value);

			this.not = new NegativeExpectation(value);
			this.called = new Called(value);
			this.always = new Always(value);
			this.never = new Never(value);
		},

	});

	var NegativeExpectation = SinonExpectation.extend({
		success: false,
		to: ' to not ',

		constructor: function(value) {
			SinonExpectation.call(this, value);
			this.called = new NotCalled(value);
		}
	});

	window.expect = function(value) {
		return new Expectation(value);
	};
	window.expect.ExpectTools = ExpectTools;
	window.expect.ExpecationBase = SinonExpectation;
	window.expect.Expectation = Expectation;

})();


