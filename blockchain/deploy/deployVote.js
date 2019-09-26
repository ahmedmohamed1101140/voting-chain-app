const HDWalletProvider = require ('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} =  require ('../compile/compileVote.js');

const provider = new HDWalletProvider(
	'brown judge skin famous undo opera eyebrow law phrase gossip attitude sunny',
	'https://rinkeby.infura.io/v3/d18cbd70fef8401ea8ce53f79f52564d'
);

const web3 = new Web3(provider);
const deploy = async () => {
	const accounts = await web3.eth.getAccounts();
	console.log('Attempting to deploy from account', accounts[0]);
	const result = await new web3.eth.Contract(JSON.parse(interface))
	.deploy({data: bytecode, arguments: []})
	.send({gas: '1000000', from: accounts[0]});	
	console.log('Contract deployed to', result.options.address);
};

deploy();