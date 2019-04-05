'use strict'

var User = require('../models/userModel.js');

// Cryptage du mot de passe
var bcryptjs = require('bcryptjs');

// JWT
var jwt = require('jsonwebtoken');
var config = require('./../../config');

// EndPoint /users (get) : handle retrieve all users
exports.getAllUsers = (request, response) => {
    User.getAllUsers((err, users) => {
        if (err) {
            response.send(err);
        } else {
            // response.send(users);
            sendJson(response, 200, users);
        }
    });
};

// EndPoint /users (post) : handle create user (register)
exports.register = (request, response) => {
    var newUser = new User(request.body);
    //handles null error 
    if (!newUser.email || !newUser.password || !newUser.status) {
        response.status(400).send({ error: true, message: 'Bad request, please provide user/status' });
    } else {
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(request.body.password, salt, (err, passwordCrypt) => {
                console.log('password: ', request.body.password, ':', passwordCrypt);
                newUser.password = passwordCrypt;
                User.register(newUser, (err, data) => {
                    if (err) {
                        sendJson(response, 501, err)
                    } else {
                        if (data[0] && data[0].hasOwnProperty('nb')) {
                            sendJson(response, 203, 'User already exist');
                        } else {
                            // Manage token
                            getToken(response, newUser, config.secret);
                        }
                    }
                });
            });
        });

    }
};

// Endpoint Retrieve an user 
exports.viewUser = (request, response) => {
    User.getUserById(request.params.id, (err, user) => {
        if (err) response.send(err);
        // response.json(user);
        if (user.length > 0) sendJson(response, 200, user);
        else sendJson(response, 203, 'User not found');
    });
};

// Endpoint Update an user 
exports.updateUser = (request, response) => {
    console.log(request.body);
    // createdAt don't change, only updateAt
    let userUpdated = new User(request.body);
    // Hash MDP
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(request.body.password, salt, (err, passwordCrypt) => {
            userUpdated.password = passwordCrypt;
            User.updateUserById(request.params.id, userUpdated, (err, user) => {
                if (err) response.send(err);
                // response.json(user);
                sendJson(response, 200, user);
            });
        });
    });

};

// Endpoint Delete an user 
exports.deleteUser = (request, response) => {
    User.removeUserById(request.params.id, (err, res) => {
        if (err) response.send(err);
        console.log('contro: ', res);
        if (res == 1) {
            sendJson(response, 200, 'User successfully deleted');
        }
        if (res == 0) {
            sendJson(response, 203, 'User not found. So we can\'t delete him');
        }
    });
};

// EndPoint /login signin
exports.login = (request, response) => {
    console.log('login');
    if (!request.body.email || !request.body.password || request.body.email == '' || request.body.password == '') {
        sendJson(response, 400, "Bad request, please provide email/password");
    } else {
        User.login(request.body.email, request.body.password, (err, user) => {
            if (err) {
                sendJson(response, 501, err);
            } else {
                if (user.length > 0) {
                    bcryptjs.compare(request.body.password, user[0].password, (err, res) => {
                        (!res) ? sendJson(response, 402, "Bad password"): getToken(response, user[0], config.secret);
                    });
                } else {
                    sendJson(response, 203, "User not found");
                }
            }
        });
    }

};

// Utils
function sendJson(response, code = 200, data = "") {
    response.status(code);
    if (code === 200 || code === 201) {
        return response.json({
            error: false,
            httpCode: code,
            users: data
        })
    }
    return response.json({
        error: true,
        httpCode: code,
        messageError: data
    })
}

function getToken(response, user, key) {
    // In seconds, one day
    // var token = jwt.sign({ id: user.id }, key, { expiresIn: 60 * 60 * 24 });
    // In order to test, five minutes...but now 20mn
    var token = jwt.sign({ id: user.id }, key, { expiresIn: 60 * 20 });
    // In minutes
    // var token = jwt.sign({ id: user.id }, key, { expiresInMinutes: 60 * 5 });
    // res.status(200).send({ auth: true, token: token });
    // response.status(201).send({ auth: true, firstname: user.firstname, lastname: user.lastname, email: user.email, token: token });
    sendJson(response, 200, { auth: true, firstname: user.firstname, lastname: user.lastname, email: user.email, token: token });
}