const path = require('path');
const fs = require ('fs');
const solc = require ('solc');

const votePath = path.resolve(__dirname, 'contracts' , 'Vote.sol');
const source = fs.readFileSync(votePath, 'utf8');

// console.log(solc.compile(source,1));
module.exports = solc.compile(source,1).contracts[':Vote'];