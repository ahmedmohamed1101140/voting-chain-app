const SurveysController = require('./controllers/surveys.controller');


exports.routesConfig = function (app) {
    app.post('/surveys', [
        SurveysController.insert
    ]);
    app.get('/surveys', [
        SurveysController.list
    ]);
    app.get('/surveys/:surveyId', [
        SurveysController.getById
    ]);
    app.get('/surveyResults/:surveyId', [
        SurveysController.getResult
    ]);
    app.patch('/surveys/:surveyId', [
        SurveysController.patchById
    ]);
    app.delete('/surveys/:surveyId', [
        SurveysController.removeById
    ]);
};