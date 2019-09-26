const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require ('../compile/compileSurvey.js');

let accounts;
let survey; 

beforeEach (async () => {
	//get a list of all accounts
	accounts = await web3.eth.getAccounts();

	 //use one of those accounts to deploy the contract
	survey = await new web3.eth.Contract(JSON.parse(interface))
	 	.deploy({
	 		data: bytecode,
	 		arguments: []
	 	})
	 	.send({
	 		from: accounts[0],
	 		gas: '1000000'
	 	});

	 survey.setProvider(provider);
});

describe('Survey', () => {
	it ('contract is now deployed', () => {
		assert.ok(survey.options.address);
	});

	// it ('has a default message', async () => {
	// 	const message = await vote.methods.message().call();
	// 	assert.equal(message, 'HI There');
	// });

	// it ('Can change the message', async () => {
	// 	await vote.methods.setMessage('YO THERE').send({ from:accounts[0] })
	// 	const message = await vote.methods.message().call();
	// 	assert.equal(message, 'YO THERE');

	// });

});