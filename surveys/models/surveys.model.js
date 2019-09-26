const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const surveySchema = new Schema({
    title: String,
    description: String,
    type: {type: String , default: 'Survey'}, //['Survey', 'Election', 'Vote']
    status: {type: String , default: 'Pinding'}, //['Pinding', 'completed']
    expiryStatus: {type: Boolean , default: false},
    createdAt: {type: Date , default: Date.now()},
    owner: String,
    contractID: String,
    points: { type: Number, default: 0 },
    questions: [
        {
            content: String,
            answers:[
                {
                    content: String,
                    points: Number,
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

exports.createSurvey = (surveyData) => {
    const survey = new Survey(surveyData);
    return survey.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Survey.find()
            .limit(perPage)
            .skip(perPage * page)
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