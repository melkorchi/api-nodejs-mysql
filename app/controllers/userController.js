'use strict'

var User = require('../models/userModel.js');

// Cryptage du mot de passe
var bcryptjs = require('bcryptjs');

// JWT
var jwt = require('jsonwebtoken');
var config = require('./../../config');

// EndPoint /users (get) : handle retrieve all users
exports.index = function(req, res) {
    User.getUsers(function(err, user) {
        if (err) {
            res.send(err);
        } else {
            res.send(user);
        }
    });
};

// EndPoint /users (post) : handle create user (register)
exports.new = function(req, res) {
    var newUser = new User(req.body);
    //handles null error 
    if (!newUser.email || !newUser.password || !newUser.status) {
        res.status(400).send({ error: true, message: 'Please provide user/status' });
    } else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(req.body.password, salt, (err, passwordCrypt) => {
                console.log('password: ', req.body.password, ':', passwordCrypt);
                newUser.password = passwordCrypt;
                User.createUser(newUser, function(err, data) {
                    if (err) {
                        // res.send(err);
                        sendJson(res, 501, err)
                    } else {
                        // res.json(user);
                        // console.log('data: ', data);
                        if (data[0] && data[0].hasOwnProperty('nb')) {
                            // console.log('cas email already used');
                            sendJson(res, 203, 'User already exist');
                        } else {
                            // sendJson(res, 201, "User created with id: " + data);
                            // Manage token
                            getToken(res, newUser, config.secret);
                        }
                    }
                });
            });
        });

    }
};

// EndPoint /login signin
exports.login = function(req, res) {
    // @todo Tester email 
    User.login(req.body.email, req.body.password, function(err, user) {
        if (err) {
            sendJson(res, 501, err);
        } else {
            // console.log('toto: ', user);
            if (user.length > 0) {
                // console.log("User found");
                bcryptjs.compare(req.body.password, user[0].password, function(err, response) {
                    // (!reponse) ? sendJson(res, 402, "Bad Password"): getToken(res, data, config.secret);
                    // console.log('Comparaison mdp: ', response);
                    (!response) ? sendJson(res, 402, "Bad password"): getToken(res, user[0], config.secret);
                });
                // MDP available
                // MDP not available
            } else {
                sendJson(res, 203, "User not found");
            }
        }
    });
};

// Utils
function sendJson(res, code = 200, data = "") {
    res.status(code);
    if (code === 200 || code === 201) {
        return res.json({
            error: false,
            httpCode: code,
            users: data
        })
    }
    return res.json({
        error: true,
        httpCode: code,
        messageError: data
    })
}

function getToken(res, user, key) {
    // In seconds, one day
    // var token = jwt.sign({ id: user.id }, key, { expiresIn: 60 * 60 * 24 });
    // In order to test, five minutes...
    var token = jwt.sign({ id: user.id }, key, { expiresIn: 60 * 5 });
    // In minutes
    // var token = jwt.sign({ id: user.id }, key, { expiresInMinutes: 60 * 5 });
    // res.status(200).send({ auth: true, token: token });
    res.status(200).send({ auth: true, firstname: user.firstname, lastname: user.lastname, email: user.email, token: token });
}