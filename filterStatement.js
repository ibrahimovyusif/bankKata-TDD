'use strict';
var util = require('util');
var fs = require('fs');
var jsonfile = require('jsonfile');


function filterStatement(account, type){
	var result = type;
	account.operations.forEach(function(operation){
		if(operation.type === type){

			result += util.format('\n%s, %s', operation.amount, operation.date);
		}
		if(type === 'date'){

			result += util.format('\n%s', operation.date);
		}
	});

	return result;
}

module.exports = filterStatement;