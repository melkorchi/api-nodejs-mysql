'use strict'

const Event = require('../models/eventModel.js');

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
<<<<<<< HEAD
exports.new = (req, res) => {
    // console.log(req.body);
    let newEvent = new Event(req.body);
    // console.log('Controller: ', newEvent);
    Event.createEvent(newEvent, (err, data) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (data) {
            console.log(data);
            res.send(data);
=======
exports.new = (request, response) => {
    let newEvent = new Event(request.body);
    Event.insertDisciplineIfNotExists(newEvent, (err, id) => {
        if (err) throw err;
        if (id) {
            console.log('id discipline: ', id);
            newEvent.discipline_id = id;
            Event.insertSiteIfNoExists(newEvent, (err, id) => {
                if (err) throw err;
                if (id) {
                    console.log('id site: ', id);
                    newEvent.site_id = id;
                    console.log(newEvent);
                    Event.insertEvent(newEvent, (err, id) => {
                        if (err) throw err;
                        if (id) {
                            console.log('id event: ', id);
                            newEvent.event_id = id;
                            console.log(newEvent);
                            Event.insertPaysIfNotExists(newEvent, (err, id) => {
                                if (err) throw err;
                                if (id) {
                                    console.log('id pays: ', id);
                                    newEvent.pays_id = id;
                                    console.log(newEvent);
                                    Event.insertInEventHasPays(newEvent, (err, id) => {
                                        if (err) throw err;
                                        if (id) {
                                            response.json({ code: 200, res: 'Processus global positif' });
                                        }
                                    });
                                }
                            })
                        }
                    });
                }
            });
>>>>>>> origin/master
        }
    });
}