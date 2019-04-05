'use strict'

var Event = require('../models/eventModel.js');

// EndPoint /events (get) : handle retrieve all events
exports.getAllEvents = (request, response) => {
    Event.getAllEvents((err, data) => {
        if (err) {
            response.send(err);
        } else {
            // response.send(data);
            sendJson(response, 200, data);
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
            // response.json({ code: 200, res: 'Verif discipline OK' });
            newEvent.discipline_id = id;
            Event.insertSiteIfNoExists(newEvent, (err, id) => {
                if (err) throw err;
                if (id) {
                    console.log('id site: ', id);
                    // response.json({ code: 200, res: 'Verif site OK' });
                    newEvent.site_id = id;
                    Event.insertEvent(newEvent, (err, id) => {
                        if (err) throw err;
                        if (id) {
                            console.log('id event: ', id);
                            // response.json({ code: 200, res: 'Event created' });
                            newEvent.event_id = id;
                            // newEvent.pays_id = [];
                            Event.insertPaysIfNotExists(newEvent, (err, id) => {
                                if (err) throw err;
                                else {
                                    console.log('id pays: ', id);
                                    // response.json({ code: 200, res: 'Verif pays OK' });
                                    // newEvent.pays_id.push(id);
                                    newEvent.pays_id = id;
                                    console.log(newEvent);
                                    Event.insertInEventHasPays(newEvent, (err, id) => {
                                        if (err) throw err;
                                    });
                                }
                            });
                            response.json({ code: 201, res: 'Event created with all verifications' });
                        }
                    });
                }
            });
        }
    });
}

// Retrieve one event endpoint
exports.viewEvent = (request, response) => {
    Event.getEventById(request.params.id, (err, event) => {
        // @todo find good code error
        if (err) sendJson(response, 500, err);
        if (event.length > 0) sendJson(response, 200, event);
        else sendJson(response, 203, 'Event not found');
    });
}

// @todo Update endpoint
exports.updateEvent = (request, response) => {
    // createdAt don't change, only updateAt
    // let eventUpdated = new Event(request.body);
    // console.log('eventUpdated', eventUpdated);
    // Event.updateEventById(request.params.id, eventUpdated, (err, user) => {
    Event.updateEventById(request.params.id, request.body, (err, user) => {
        if (err) sendJson(response, 500, err);
        sendJson(response, 200, user);
    });
};

// @todo Delete endpoint
exports.deleteEvent = (request, response) => {
    Event.removeEventById(request.params.id, (err, res) => {
        if (err) response.send(err);
        if (res >= 1) {
            console.log('res: ', res);
            sendJson(response, 200, 'Event successfully deleted');
        }
        if (res == 0) {
            sendJson(response, 203, 'Event not found. So we can\'t delete him');
        }
    });
};

/* Utils */
function sendJson(response, code = 200, data = "") {
    response.status(code);
    if (code === 200 || code === 201) {
        return response.json({
            error: false,
            httpCode: code,
            events: data
        })
    }
    return response.json({
        error: true,
        httpCode: code,
        messageError: data
    })
}