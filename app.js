require("./common/services/mongoose.service");

const express = require("express");
const app = express();
const morgan = require("morgan");
const parser = require("body-parser");

const UsersRouter = require('./users/routes.config');
const SurveysRouter = require('./surveys/routes.config');




//Server Setup
app.use(morgan('dev'));
app.use(parser.urlencoded({extended: false}));
app.use(parser.json());


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.send(200);
    } else {
        return next();
    }
});

 

UsersRouter.routesConfig(app);
SurveysRouter.routesConfig(app);


//normal errors handling
app.use(function (req,res,next) {
    var error = new Error('Not Found');
    error.status = 404;
    next(error);
});

//custom app error handling
app.use(function (error,req,res,next) {
   res.status(error.status || 500);
   res.json({
       error:{
           message: error.message
       }
   });
});

module.exports = app;


var server = app.listen(process.env.PORT || "9090",function (err) {
    console.log("App Running At PORT: "+ server.address().port);
});