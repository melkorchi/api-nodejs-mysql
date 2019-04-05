'user strict';

let mysql = require('mysql');

// let dbLink = mysql.createConnection(process.env.CLEARDB_DATABASE_URL);
// Utilisation de createPool Heroku
// let dbLink = mysql.createPool(process.env.CLEARDB_DATABASE_URL);


let dbLink = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jo2024'
});


dbLink.connect(function(err) {
    // dbLink.getConnection(function(err, connection) {
    if (err) {
        console.log('errrrrrrr');
        throw err;
    } else {
        console.log('lets go !!!');
    }
});


module.exports = dbLink;