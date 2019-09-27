const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const createVoteContract = require('../../blockchain/deploy/deployVote.js');
const createSurveyContract = require('../../blockchain/deploy/deploySurvey.js');
const HDWalletProvider = require ('truffle-hdwallet-provider');
let Web3 = require("web3");
const BigNumber = require('bignumber.js');


const surveySchema = new Schema({
    title: String,
    description: String,
    type: {type: String , default: 'Survey'}, //['Survey', 'Election', 'Vote']
    status: {type: String , default: 'Pinding'}, //['Pinding', 'completed']
    expiryStatus: {type: Boolean , default: false},
    expiryDate: String,
    viewResults: {type: Boolean , default: true},
    createdAt: {type: Date , default: Date.now()},
    owner: String,
    contractID: String,
    interface: String,
    points: { type: Number, default: 0 },
    questions: [
        {
            content: String,
            answers:[
                {
                    id: String,
                    content: String,
                    points: Number
                }
            ]
        } 
    ],
    voters:[
        {
            MSISDN: String
        }
    ]
 });


surveySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
surveySchema.set('toJSON', {
    virtuals: true
});

surveySchema.findById = function (cb) {
    return this.model('Surveys').find({id: this.id}, cb);
};

const Survey = mongoose.model('Surveys', surveySchema);



exports.findById = (id) => {
    return Survey.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.getResult = (id) => {
    return Survey.findById(id)
        .then(async (result) => {
            const surveyResults = await getResultFromBlockChain(result);
            result.questions[0].answers = surveyResults;
            result = result.toJSON();
            console.log("FINAL RESULT", result);
            delete result._id;
            delete result.__v;
            return result;
        });
}

exports.createSurvey = async (surveyData) => {
    if(surveyData.type == 'Vote') {
        const data = await createVoteContract();
        surveyData['contractID'] = data.address;
        surveyData['interface'] = data.interface;
    } else {
        const data = await createSurveyContract();
        surveyData['contractID'] = data.address;
        surveyData['interface'] = data.interface;
    }
    const survey = await new Survey(surveyData).save();
    populateContract(survey);
    return survey;
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Survey.find()
            // .limit(perPage)
            // .skip(perPage * page)
            .exec(function (err, surveys) {
                if (err) {
                    reject(err);
                } else {
                    resolve(surveys);
                }
            })
    });
};

exports.patchSurvey = (id, surveyData) => {
    return new Promise((resolve, reject) => {
        Survey.findById(id, function (err, survey) {
            if (err) reject(err);
            for (let i in surveyData) {
                survey[i] = surveyData[i];
            }
            survey.save(function (err, updatedSurvey) {
                if (err) return reject(err);
                resolve(updatedSurvey);
            });
        });
    })

};

exports.removeById = (surveyId) => {
    return new Promise((resolve, reject) => {
        Survey.remove({_id: surveyId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};


// HELPER FUNCTIONS
async function populateContract(surveyData) {
    const provider = new HDWalletProvider(
        'brown judge skin famous undo opera eyebrow law phrase gossip attitude sunny',
        'https://rinkeby.infura.io/v3/d18cbd70fef8401ea8ce53f79f52564d'
    );
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    console.log(surveyData);
    let contract = await new web3.eth.Contract(JSON.parse(surveyData.interface), surveyData.contractID);
    for(var i=0; i<surveyData.questions[0].answers.length; i++) {
        console.log(surveyData.questions[0]);
        let candidateName = surveyData.questions[0].answers[i].content;
        let candidateID = surveyData.questions[0].answers[i].id;
        await contract.methods.addCandidate(new BigNumber(candidateID).toNumber(), candidateName).send({gas: '1000000', from: accounts[0]});
    }
    console.log("Contract Populated");
}

async function getResultFromBlockChain(surveyData) {
    const provider = new HDWalletProvider(
        'brown judge skin famous undo opera eyebrow law phrase gossip attitude sunny',
        'https://rinkeby.infura.io/v3/d18cbd70fef8401ea8ce53f79f52564d'
    );
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
    let contract = await new web3.eth.Contract(JSON.parse(surveyData.interface), surveyData.contractID);
    const voteResults = [];
    for(var i=0; i<surveyData.questions[0].answers.length; i++) {
        let candidateVoteCount = await contract.methods.voteResults(new BigNumber(surveyData.questions[0].answers[i].id).toNumber()).call();
        voteResults.push({
            'content': surveyData.questions[0].answers[i].content,
            'id': surveyData.questions[0].answers[i].id,
            'points': candidateVoteCount
        })
    }
    console.log("Results", voteResults);
    return voteResults;

}