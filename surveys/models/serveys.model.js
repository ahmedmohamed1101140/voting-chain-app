const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const serveySchema = new Schema({
    title: String,
    description: String,
    type: {
        type: [{
          type: String,
          enum: ['Survey', 'Election', 'Vote']
        }],
        default: ['Survey']
      },
    createdAt: {type: Date , default: Date.now()},
    expiryDate: {type: Date},
    owner: String,
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
 });


serveySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
serveySchema.set('toJSON', {
    virtuals: true
});

serveySchema.findById = function (cb) {
    return this.model('Serveys').find({id: this.id}, cb);
};

const Servey = mongoose.model('Serveys', serveySchema);



exports.findById = (id) => {
    return Servey.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createServey = (serveyData) => {
    const servey = new Servey(serveyData);
    return servey.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Servey.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, serveys) {
                if (err) {
                    reject(err);
                } else {
                    resolve(serveys);
                }
            })
    });
};

exports.patchServey = (id, serveyData) => {
    return new Promise((resolve, reject) => {
        Servey.findById(id, function (err, servey) {
            if (err) reject(err);
            for (let i in serveyData) {
                servey[i] = serveyData[i];
            }
            servey.save(function (err, updatedServey) {
                if (err) return reject(err);
                resolve(updatedServey);
            });
        });
    })

};

exports.removeById = (serveyId) => {
    return new Promise((resolve, reject) => {
        Servey.remove({_id: serveyId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};