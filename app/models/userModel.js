'use strict'

// var db = require('./../../db');
const DataBaseConnection = require('./../../db2');
const con = new DataBaseConnection('heroku');
// const con = new DataBaseConnection('local');
con.getConnection();
const db = con.dbLink();

var User = function(user) {
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.password = user.password;
    this.status = user.status;
    this.avatar = user.avatar;
    this.createdAt = new Date();
    this.updatedAt = new Date();
}

// All users
User.getAllUsers = (callback) => {
    db.query("Select * from users", (err, res, fields) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, res);
        }
    });
};

// Register an user 
User.register = (newUser, callback) => {
    // Test if email is already used
    db.query("SELECT COUNT(*) as nb FROM users WHERE email='" + newUser.email + "'", (err, res, fields) => {
        if (err) {
            callback(err, null);
        } else {
            let ret = Object.values(JSON.parse(JSON.stringify(res)));
            if (ret && ret[0].nb == 1) {
                // Email is already used
                // callback(null, ret[0].nb);
                callback(null, ret);
            } else {
                // Email is not used
                db.query("INSERT INTO users set ?", newUser, function(err, res) {
                    if (err) {
                        callback(err, null);
                    } else {
                        callback(null, res.insertId);
                    }
                });
            }
        }
    });
};

// Retrieve an user
User.getUserById = (id, callback) => {
    db.query("SELECT * FROM users WHERE id='" + id + "'", (err, res, fields) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, Object.values(JSON.parse(JSON.stringify(res))));
        }
    });
}

User.updateUserById = (id, user, callback) => {
    let values = Object.values(user);
    values.push(id);
    console.log('values', values);
    let sql = "UPDATE users SET firstname = ?, lastname =  ?, email = ?, password = ?, status = ?, avatar = ?, createdAt = ?, updatedAt = ? WHERE id = ?";
    // let sql = "UPDATE users SET ? WHERE id = ?";
    db.query(sql, values, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            console.log('update: ', res);
            callback(null, res);
        }
    });
}

User.removeUserById = (id, callback) => {
    db.query("DELETE FROM users WHERE id='" + id + "'", (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            // callback(null, Object.values(JSON.parse(JSON.stringify(res.affectedRows))));
            callback(null, res.affectedRows);
            console.log('delete: ', res.affectedRows);
        }
    });
}

// Login
User.login = (email, password, callback) => {
    db.query("SELECT * FROM users WHERE email='" + email + "'", (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, Object.values(JSON.parse(JSON.stringify(res))));
        }
    });
};

module.exports = User;