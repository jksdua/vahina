/* jshint node:true */
/* globals it */

'use strict';

var co = require('co');
var chai = require('chai');
var expect = chai.expect;

var vahina = require(__dirname);

function asyncCall(result) {
	return function(done) {
		process.nextTick(function() {
			done(null, result);
		});
	};
}

it('should throw an error if flow is invalid', function(done) {
	co(function *() {
		var fact = 'fact';
		var flow = null;
		var result = yield vahina.run(fact, flow);
	})(function(err) {
		expect(err).to.exist;
		done();
	});
});

it('should throw an error if branch does not exist', function(done) {
	co(function *() {
		var fact = null;
		var flow = {
			condition: function* () {
				return false;
			},
			branch: {
				true: true
			}
		};
		var result = yield vahina.run(fact, flow);
	})(function(err) {
		expect(err).to.exist;
		done();
	});
});

it('should work for a single level flow', function(done) {
	co(function *() {
		var fact = 'fact';
		var flow = {
			condition: function* () {
				return true;
			},
			branch: {
				true: true
			}
		};
		var result = yield vahina.run(fact, flow);
		expect(result).to.equal(true);
	})(done);
});

it('should work for multi level flows', function(done) {
	co(function *() {
		var fact = null;
		var flow = {
			condition: function* () {
				return true;
			},
			branch: {
				true: {
					condition: function *() {
						return false;
					},
					branch: {
						true: 'true2',
						false: function *() {
							return 'false2'
						}
					}
				},
				false: false
			}
		};
		var result = yield vahina.run(fact, flow);
		expect(result).to.equal('false2');
	})(done);
});

it('should work for async conditions', function(done) {
	co(function *() {
		var fact = null;
		var flow = {
			condition: function* () {
				return yield asyncCall(true);
			},
			branch: {
				true: true
			}
		};
		var result = yield vahina.run(fact, flow);
		expect(result).to.equal(true);
	})(done);
});

it('should work for async branches', function(done) {
	co(function *() {
		var fact = null;
		var flow = {
			condition: function* () {
				return true;
			},
			branch: {
				true: function *() {
					return yield asyncCall(true);
				}
			}
		};
		var result = yield vahina.run(fact, flow);
		expect(result).to.equal(true);
	})(done);
});

it('should work for non function branches', function(done) {
	co(function *() {
		var fact = null;
		var flow = {
			condition: function* () {
				return true;
			},
			branch: {
				true: true
			}
		};
		var result = yield vahina.run(fact, flow);
		expect(result).to.equal(true);
	})(done);
});