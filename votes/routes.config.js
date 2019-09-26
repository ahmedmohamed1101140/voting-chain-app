const VotesController = require('./controllers/votes.controller');


exports.routesConfig = function (app) {
    app.post('/votes', [
        VotesController.insert
    ]);
    app.get('/votes', [
        VotesController.list
    ]);
    app.get('/votes/:voteId', [
        VotesController.getById
    ]);
    app.patch('/votes/:voteId', [
        VotesController.patchById
    ]);
    app.delete('/votes/:voteId', [
        VotesController.removeById
    ]);
};