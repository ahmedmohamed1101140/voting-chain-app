const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require ('../compile/compileVote.js');

let accounts;
let vote; 

beforeEach (async () => {
	//get a list of all accounts
	accounts = await web3.eth.getAccounts();

	 //use one of those accounts to deploy the contract
	vote = await new web3.eth.Contract(JSON.parse(interface))
	 	.deploy({
	 		data: bytecode,
	 		arguments: []
	 	})
	 	.send({
	 		from: accounts[0],
	 		gas: '1000000'
	 	});

	 vote.setProvider(provider);
});

describe('Vote', () => {
	it ('contract is now deployed', () => {
		assert.ok(vote.options.address);
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