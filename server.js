const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080;
// port = process.env.PORT || 3306;

// const mysql = require('mysql');

// // connection configurations
// const dbLink = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     // database: 'todolist'
//     database: 'apijo'
// });

// // connect to database
// dbLink.connect(function(err) {
//     if (err) {
//         console.log('Error: ' + err);
//         throw err;
//     } else {
//         console.log('let\'s go');
//     }
// });

app.listen(port);

console.log('Restful Api Server started on port: ' + port);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

// app.get('/', (req, res) => res.send('Welcome to ECS_REST_API with Express'));

var routes = require('./app/routes/appRoutes'); //importing routes

routes(app); //register the route