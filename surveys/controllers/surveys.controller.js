const SurveyModel = require('../models/surveys.model');

exports.insert = (req, res) => {
    SurveyModel.createSurvey(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.list = (req, res) => {
      
    // SurveyModel.find().exec(function (err,Surveys) {
    //     if(err){
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         });
    //     }
    //     else {
    //         res.status(200).json({
    //             message: "All Surveys",
    //             count: Surveys.length,
    //             Surveys: Surveys.map(function (Survey) {
    //                 return{
    //                     _id: Survey._id,
    //                     title: Survey.title,
    //                     points: Survey.points,
    //                     type: Survey.type,
    //                     description: Survey.description,
    //                     createdAt: Survey.createdAt,
    //                     owner: Survey.owner,
    //                     contractID: Survey.contractID,  
    //                     expiryStatus: Survey.expiryStatus,
    //                     request: {
    //                         type: 'GET',
    //                         url: 'http://localhost:3000/surveys/'+ Survey._id
    //                     }
    //                 }
    //             })
    //         })
    //     }
    //  });


    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    SurveyModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    SurveyModel.findById(req.params.serveyId)
        .then((result) => {
            res.status(200).send(result);
        });
};
exports.patchById = (req, res) => {
    SurveyModel.patchSurvey(req.params.serveyId, req.body)
        .then((result) => {
            res.status(204).send({});
        }); 

};

exports.removeById = (req, res) => {
    SurveyModel.removeById(req.params.serveyId)
        .then((result)=>{
            res.status(204).send({});
        });
};