'use strict'

var db = require('./../../db');

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
User.getUsers = function(result) {
    db.query("Select * from users", function(err, res, fields) {
        if (err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            console.log('users : ', res);
            result(null, res);
        }
    });
};

// Register a user (create)
User.createUser = function(newUser, result) {
    // console.log(newUser);
    // Test if email is already used
    db.query("SELECT COUNT(*) as nb FROM users WHERE email='" + newUser.email + "'", function(err, res, fields) {
        if (err) {
            result(err, null);
        } else {
            let ret = Object.values(JSON.parse(JSON.stringify(res)));
            if (ret && ret[0].nb == 1) {
                // Email is already used
                // console.log('ret: ', ret);
                // result(null, ret[0].nb);
                result(null, ret);
            } else {
                // Email is not used
                db.query("INSERT INTO users set ?", newUser, function(err, res) {
                    // console.log('insert: ' + res);
                    if (err) {
                        result(err, null);
                    } else {
                        result(null, res.insertId);
                    }
                });
            }
        }
    });
};

// Login
User.login = function(email, password, result) {
    db.query("SELECT * FROM users WHERE email='" + email + "'", function(err, res, fields) {
        if (err) {
            result(err, null);
        } else {
            // console.log('res: ', res);
            let ret = Object.values(JSON.parse(JSON.stringify(res)));
            // console.log('ret: ', ret);
            // You have to test the result 
            if (res.length > 0) {
                // console.log('not empty');
                // Case ret is not an empty array
                // The user was retrieve
                // console.log('on peut vérifier le mdp');
                // console.log('mdp: ', password);

                // result(null, ret);
            } else {
                // console.log('empty');
                // Case ret is an empty array
                // The user was not retrieved

                // result(null, ret);
            }
            result(null, ret);
        }
    });
};

module.exports = User;