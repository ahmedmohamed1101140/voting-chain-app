const mongoose = require("mongoose");
const User = require('../../users/models/users.model');
const survey = require('../../surveys/models/surveys.model.js');
const Schema = mongoose.Schema;
const HDWalletProvider = require ('truffle-hdwallet-provider');
let Web3 = require("web3");
const BigNumber = require('bignumber.js');


const voteSchema = new Schema({
    voterId: String,
    contractId: String,
    surveyId: String,
    answers: [
        {
        }
    ],
 });


voteSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
voteSchema.set('toJSON', {
    virtuals: true
});

voteSchema.findById = function (cb) {
    return this.model('Votes').find({id: this.id}, cb);
};

const Vote = mongoose.model('Votes', voteSchema);



exports.findById = (id) => {
    return Vote.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createVote = async (voteData) => {
    const vote = new Vote(voteData);
    await blockChainVote(voteData);
    return vote.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Vote.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, votes) {
                if (err) {
                    reject(err);
                } else {
                    resolve(votes);
                }
            })
    });
};

exports.patchVote = (id, vateData) => {
    return new Promise((resolve, reject) => {
        Vote.findById(id, function (err, vote) {
            if (err) reject(err);
            for (let i in vateData) {
                vote[i] = vateData[i];
            }
            vote.save(function (err, updatedVote) {
                if (err) return reject(err);
                resolve(updatedVote);
            });
        });
    })

};

exports.removeById = (voteId) => {
    return new Promise((resolve, reject) => {
        Vote.remove({_id: voteId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

async function blockChainVote (voteData){
    console.log(voteData);
    let surveyObj = await survey.findById(voteData.surveyId);
    const provider = new HDWalletProvider(
        'brown judge skin famous undo opera eyebrow law phrase gossip attitude sunny',
        'https://rinkeby.infura.io/v3/d18cbd70fef8401ea8ce53f79f52564d'
    );
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    let contract = await new web3.eth.Contract(JSON.parse(surveyObj.interface), voteData.contractId);
    await contract.methods.vote(new BigNumber(voteData.voterId).toNumber(),new BigNumber(voteData.answers[0].id).toNumber()).send({gas: '1000000', from: accounts[0]});
    console.log("Vote Submitted");
}