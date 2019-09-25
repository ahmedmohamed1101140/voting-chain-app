const SurveysController = require('./controllers/serveys.controller');


exports.routesConfig = function (app) {
    app.post('/surveys', [
        SurveysController.insert
    ]);
    app.get('/surveys', [
        SurveysController.list
    ]);
    app.get('/surveys/:serveyId', [
        SurveysController.getById
    ]);
    app.patch('/surveys/:serveyId', [
        SurveysController.patchById
    ]);
    app.delete('/surveys/:serveyId', [
        SurveysController.removeById
    ]);
};