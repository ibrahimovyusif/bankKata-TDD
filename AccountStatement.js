'use strict';
var util = require('util');
var fs = require('fs');
var jsonfile = require('jsonfile');

var deposit = 'deposit',
	withdraw = 'withdraw',
	transfer = 'transfer';


function accountStatement(account, receiverAccount){
	
	var report = ('Account Id is: ' + account.accountID +
		' \ndate || credit || debit || balance');



	account.operations.forEach(function(operation){

		if(operation.isMatch(withdraw)){

			report += util.format('\n%s || %s || %s || %s', 
								operation.date, 
								operation.amount, 
								'', 
								operation.balance);
		}
		if(operation.isMatch(deposit)){

			report += util.format('\n%s || %s || %s || %s', 
								operation.date, 
								'', 
								operation.amount, 
								operation.balance);
		}
		if(operation.isMatch(transfer)){

			report += '\nTransfer to'
			report += ' \ndate || receiver account Id || sender balance';
			report += util.format('\n%s || %s || %s', 
								operation.date, 
								receiverAccount.accountID, 
								operation.balance);
		}

	});

	// console.log('oooo', report);
	return report;
}


module.exports = accountStatement;