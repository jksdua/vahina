/* jshint node:true */

'use strict';

function isCondition(obj) {
	return !!obj.condition;
}

/**
	Executes a workflow using the given instance and workflow rules

	@param {Mixed} instance instance to run through the rule engine
	@param {Array} flow Flow through which to run the instance
 */
var run = exports.run = function *(instance, flow) {
	var res = yield flow.condition.call(instance, instance, flow);
	
	var branch = flow.branch[res];

	if (isCondition(branch)) {
		return yield run(instance, branch);
	} else {
		return ('function' !== typeof branch ? branch : yield branch.call(instance, instance, flow));
	}
};