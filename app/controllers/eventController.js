'use strict'

var Event = require('../models/eventModel.js');

// Cryptage du mot de passe
// var bcryptjs = require('bcryptjs');

// JWT
// var jwt = require('jsonwebtoken');
// var config = require('./../../config');

// EndPoint /events (get) : handle retrieve all events
exports.index = (req, res) => {
    Event.getAllEvents((err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    });
};

// EndPoint /events (post) : handle create a new event
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
        }
    });
}