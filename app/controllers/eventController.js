'use strict'

var Event = require('../models/eventModel.js');

// Cryptage du mot de passe
// var bcryptjs = require('bcryptjs');

// JWT
// var jwt = require('jsonwebtoken');
// var config = require('./../../config');

// EndPoint /events (get) : handle retrieve all events
exports.index = function(req, res) {
    Event.getAllEvents(function(err, data) {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
};

// EndPoint /events (post) : handle create a new event
exports.new = (req, res) => {
    // console.log(req.body);
    let newEvent = new Event(req.body);
    // console.log('Controller: ', newEvent);
    Event.createEvent(newEvent, (err, data) => {
        if (err) {
            console.log('error no data');
        }
        if (data) {
            console.log('data OK');
        }
    });
}