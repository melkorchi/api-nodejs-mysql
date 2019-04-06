const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080;

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);

app.listen(port);

console.log('Restful Api Server started on port: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// app.get('/', (req, res) => res.send('Welcome to ECS_REST_API with Express'));

var routes = require('./app/routes/appRoutes'); //importing routes

routes(app); //register the route