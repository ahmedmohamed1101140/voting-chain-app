const mongoose = require("mongoose");
const Schema = mongoose.Schema;


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

exports.createVote = (vateData) => {
    const vote = new Vote(vateData);
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