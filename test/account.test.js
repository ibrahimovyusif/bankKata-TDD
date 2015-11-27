'use strict';
var chai = require('chai');
var assert = chai.assert;

var fs = require('fs');

var accountIdGenerator = function () {


	return {
		next : function () {
			return 100;
		}

	};
};

var Account = require('../account');

var createAccountRepository = function () {

	return {
		create: function (account, done) {
			var filePath = './' + account.number + '.json';
			fs.writeFile(filePath, JSON.stringify(account), done);
		}
	};
};



var Helper = {

	dateNow: function () {
		return new Date();
	}
};



describe('account model creation', function () {
	
	describe('ctor', function () {
		
		it('should generate id automatically from 100 and upper', function () {
			
			var number = accountIdGenerator().next();
			var account100 = new Account(number);
			console.log(account100.number, 100);

		});
	});


});


describe('write account object to file system ', function () {

	var account;
	var accountRepository = createAccountRepository();
	var outputFileath = './100.json';
	before(function () {
		account = new Account(100);
	});
	
	it('should create a file', function (done) {
		
		accountRepository.create(account, function (err) {

			assert.notOk(err);

			var actualObject = JSON.parse(fs.readFileSync(outputFileath));

			assert.equal(actualObject.number, 100);
			assert.equal(actualObject.operations.length, 0);

			done();
		});
	});

	after(function (done) {

		fs.unlink(outputFileath, done);
	});
});


describe('read file account from file system', function () {
	
	before(function () {

	});

	it('should read successfully', function (done) {
		
	});

	after(function (done) {

	});
});


describe ('anar task testing', function () {

	var accountRepository = createAccountRepository();
	before(function () {

		var account100 = new Account(100);
		account100.deposit(1000, new Date(2012, 10, 1));
		account100.deposit(2000, new Date(2012, 10, 2));
		account100.withdraw(500, new Date(2012, 10, 3));

		account100.printStatement();

		var account101 = new Account(101);
		account101.deposit(200, new Date(2012, 10, 4));
		account100.transfer(500, account101, new Date(2012, 10, 5));

		account101.printStatement();
		account100.printStatement();

		var updatedOperationId = 2; 
		account100.updateOperation(updatedOperationId, 1500);
		account100.printStatement();

		accountRepository.create(account100, function (err) {
			if (err) {
				console.error(err);
				// handlle this error properl;y
			}

			accountRepository.findByNumber(100, function (err, account) {
				if (err) {
					console.error(err);
					// handlle this error properl;y
				}

				assert.equal(account, expectedAccountFromDb);
			});
		});

	});
});




