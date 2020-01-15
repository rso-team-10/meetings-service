const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const meetingsRouter = require('./routes/meetings.routes.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/', meetingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error("Not found");
    err.status = 404;
    next(err)
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    const status = err.status || 500;
    const responseObject = {
        status: status,
        message: err.message,
        stackTrace: req.app.get('env') === 'development' ? err : {}
    };

    // render the error page
    res.status(status);
    res.json(responseObject);
});

module.exports = app;