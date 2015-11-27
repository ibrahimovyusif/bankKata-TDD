'use strict';
var util = require('util');
var fs = require('fs');
var jsonfile = require('jsonfile');

var uuid= require('uuid');


var accountStatement = require('./AccountStatement');
var filterStatement = require('./FilterStatement');
var Operation = require('./Operation');


var deposit = 'deposit',
	withdraw = 'withdraw',
	transfer = 'transfer';


var newAccountId = 100;


var operationInfo;
var saveAccountJson = [];

// All the transfers will be printed into the printStatement

// Tell don't ask - 
// when we make deposit -> no VAT
// when we make withdraw -> 4% taken VAT
// when we do transfer -> 10% taken from the sender

// I want the Account be persistant. Be able to save account, and load account from file 

// I want to be able to update any money operation retrospectivly -> for example -> change the amount of money which deposited at 10/2/2015 from 400$ to 600$


function Account(number) {

	this.number = number;
	this.balance = 0;
	this.creationDate = new Date();
	this.operations = [];
		 
	// var stringifiedSaveAccountJson = JSON.stringify(saveAccountJson, null, "\t") 

	// fileAppender(stringifiedSaveAccountJson, 'account-' + accountID + '.txt');


	this.deposit = function(amount,date, accountID){
		this.balance += amount;
		var newOperation = new Operation(amount,deposit,date,this.balance, accountID);
		this.operations.push(newOperation);
	};

	this.withdraw = function(amount,date, accountID){
		this.balance -= (amount + amount*0.04);
		var newOperation = new Operation(amount,withdraw,date,this.balance, accountID);
		this.operations.push(newOperation);
	};

	this.transfer = function(amount,receiver,date, accountID){
		this.balance -= (amount + amount*0.1);
		receiver.balance += amount;
		var newOperation = new Operation(amount,transfer,date,this.balance, accountID);
		this.operations.push(newOperation);
	};

}


function saveAccount(account, receiverAccount){

	// console.log("_____", account,"____")
	account.operations.forEach(function(operation){


		// console.log('><><><><><><>',saveAccountJson, '<><><>><><')

		if(operation.type === withdraw || operation.type === deposit){
			operationInfo =  {
				'type': operation.type,
				"accountID": account.accountID,
				'amount': operation.amount,
				'date': operation.date,
				'balance': operation.balance
			};
				
			
		}

		if(operation.type === transfer){
			operationInfo = {
				'operationType': operation.type,
				'date': operation.date,
				'amount': operation.amount,
				'senderBalance': operation.balance,
				'sendedToThisAccount': receiverAccount.accountID
			};

		}

		//push to json
		saveAccountJson.push(operationInfo);

	});

		var stringifiedSaveAccountJson = JSON.stringify(saveAccountJson, null, "\t") 
		fileAppender(stringifiedSaveAccountJson, 'account-' + account.accountID + '.txt');

}

function fileWriter(report,path){
	var stream = fs.createWriteStream('./' + path);
	stream.write(report);
}



function fileAppender(report,path){
	fs.appendFile(path, report);
}

// function keepThisId(newAccountId){
// 	fs.writeFile('./accountIdKeeper', newAccountId);
// }



function generateID(){


	var lastSavedId =  fs.readFile('./accountIdKeeper.txt', 'utf-8',function(err, data){
		if(err){
			console.log('ehmed');
		}
		if(data){
			return data;
		}
	})

	// console.log('}}}}}}}}', lastSavedId);

	function readingFile(){
	var lastSavedId = 	fs.readFile('./accountIdKeeper', 'utf-8', function(err, lastSavedId){
			if(err) {
				newAccountId ++;
			} else{

				newAccountId = Number(lastSavedId) + 1;
			}
		});
	console.log('---------------',lastSavedId)

	}
	readingFile();

	setTimeout(
	function doSomeStuff(){
		console.log('######', newAccountId);
		
		fs.writeFile('./accountIdKeeper', newAccountId);
		
		return newAccountId;
	}, 500);
}

// var account1 = new Account(101);
// var account2 = new Account('102');

// var account3;

			
// 	fs.readFile('./account-101.txt', 'utf-8',function(err, data){
// 		if(err){
// 			console.log('ehmed');
// 		}	
// 		if(data){
// 			// var parsedData = JSON.parse(data);
// 			// console.log(parsedData);
// 			//account1 = data
// 			account3 = data.replace(/\]\[/gi, ",");
// 		}	
// 	});


// var date1 = new Date(2012,5,11);
// var date2 = new Date(2013,6,8);
// var date3 = new Date(2013,7,9);
// var date4 = new Date(2013,9,12);
// account1.deposit(200,date1, 101);
// account1.deposit(30,date2, 101);
// account1.withdraw(20,date3, 101);
// account1.transfer(50, account2, date4, 102);

// account2.deposit(200,date1, 101);
// account2.transfer(50, account1, date1, 101)


// var report = accountStatement(account1,account2);
// fileWriter(report,'CustomerReportPrint.txt');

// saveAccount(account1, account2);




// // console.log('write log here ...',report);

// var filteredDeposit = filterStatement(account1, deposit);
// // console.log('filtering on deposit', filteredDeposit);



// var filteredWithdraw = filterStatement(account1, withdraw);
// // console.log('filtering on deposit', filteredWithdraw);

// var filteredDate = filterStatement(account1, 'date');
// // console.log('dates filtered', filteredDate);


module.exports = Account;