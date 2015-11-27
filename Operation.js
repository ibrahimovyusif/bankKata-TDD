'use strict';
var util = require('util');
var fs = require('fs');
var jsonfile = require('jsonfile');


function Operation(amount, type, date, balance, accountID ){
	this.accountID = accountID;
	this.amount = amount;
	this.date = date;
	this.type = type;
	this.balance = balance;

	this.isMatch = function (operationType) {
		return operationType === this.type;
	};

}


module.exports = Operation;