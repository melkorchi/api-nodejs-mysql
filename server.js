const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080;

app.listen(port);

console.log('Restful Api Server started on port: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// app.get('/', (req, res) => res.send('Welcome to ECS_REST_API with Express'));

var routes = require('./app/routes/appRoutes'); //importing routes

routes(app); //register the route