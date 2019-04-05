'user strict';

var mysql = require('mysql');

//local mysql db connection
// var dbLink = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);

// Utilisation de createPool
var dbLink = mysql.createPool(process.env.CLEARDB_DATABASE_URL);

/*
var dbLink = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jo2024'
        // port: '3000'
});
*/

// dbLink.connect(function(err) {
dbLink.getConnection(function(err, connection) {
    if (err) {
        console.log('errrrrrrr');
        throw err;
    } else {
        console.log('lets go !!!');
    }
});

module.exports = dbLink;