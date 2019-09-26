const VoteModel = require('../models/votes.model');

exports.insert = (req, res) => {
    VoteModel.createVote(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    VoteModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    VoteModel.findById(req.params.voteId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    VoteModel.patchSurvey(req.params.voteId, req.body)
        .then((result) => {
            res.status(204).send({});
        }); 

};

exports.removeById = (req, res) => {
    VoteModel.removeById(req.params.voteId)
        .then((result)=>{
            res.status(204).send({});
        });
};