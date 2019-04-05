'use strict'

let mysql = require('mysql');

module.exports = class MySqlDataBase {

    constructor(type = 'local', host = 'localhost', user = 'root', password = '', database = 'jo2024') {
        this._host = host;
        this._user = user;
        this._password = password;
        this._database = database;
        this._type = type;
        this._dblink = this.dbLink();
    }

    get host() {
        return this._host;
    }
    get user() {
        return this._user;
    }
    get password() {
        return this._password;
    }
    get database() {
        return this._database;
    }
    set host(value) {
        this._host = value;
    }
    set user(value) {
        this._user = value;
    }
    set password(value) {
        this._password = value;
    }
    set database(value) {
        this._database = value;
    }

    dbLink() {
        if (this._type == 'local') {
            return mysql.createConnection({
                host: this.host,
                user: this.user,
                password: this.password,
                database: this.database
            });
        } else {
            return mysql.createPool(process.env.CLEARDB_DATABASE_URL);
        }

    }

    getConnection() {
        if (this._type == 'local') {
            this._dblink.connect(function(err) {
                if (err) {
                    console.log('errrrrrrr');
                    throw err;
                } else {
                    console.log('lets go with localhost !!!');
                }
            });
        } else {
            this._dblink.getConnection(function(err, connection) {
                if (err) {
                    console.log('errrrrrrr');
                    throw err;
                } else {
                    console.log('lets go with heroku !!!');
                }
            });
        }

    }

    display() {
        let url = "mysql://" + this.user + ":" + this.password + "@" + this.host + "/" + this.database;
        console.log('Class de connection: ', url);
    }
}