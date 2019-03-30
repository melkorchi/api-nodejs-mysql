'use strict'

const db = require('./../../db');
const oEvent = require('./../classes/Event');

// All Events
oEvent.getAllEvents = function(result) {
    let sql = "SELECT e.ID_EVENT, d.NAME as discipline, p.name as participant, e.EPREUVE, e.EVENT_DATE, s.COMMUNE, s.LONGITUDE, s.LATTITUDE FROM `events` AS e ";
    sql += "INNER JOIN discipline AS d ";
    sql += "ON e.ID_DISCIPLINE = d.ID_DISCIPLINE ";
    sql += "INNER JOIN event_has_pays AS ehp ";
    sql += "ON e.ID_EVENT = ehp.ID_EVENT ";
    sql += "INNER JOIN pays AS p ";
    sql += "ON ehp.ID_PAYS = p.ID_PAYS ";
    sql += "INNER JOIN sites AS s ";
    sql += "ON e.ID_SITE = s.ID_SITE ";
    sql += "ORDER BY e.ID_EVENT ASC";

    // let sql2 = "SELECT * FROM events";

    db.query(sql, function(err, res, fields) {
        if (err) {
            result(err, null);
        } else {
            let ret = Object.values(JSON.parse(JSON.stringify(res)));
            result(null, groupById(ret));

        }
    });
};

function groupById(table) {
    let groups = {};
    table.forEach((item) => {
        if (groups.hasOwnProperty(item.ID_EVENT)) {
            groups[item.ID_EVENT].participants.push(item.participant);
        } else {
            groups[item.ID_EVENT] = item;
            groups[item.ID_EVENT].participants = [item.participant];
        }
    });
    return Object.values(groups);
}

// Utiliser un orm ....

// Create an event

Event.insertDisciplineIfNotExists = (newEvent, callback) => {
    // db.query("SELECT ID_DISCIPLINE discipline WHERE NAME = ?", [newEvent.discipline], function(err, res, fields) {
    db.query("SELECT ID_DISCIPLINE as id FROM discipline WHERE NAME='" + newEvent.discipline + "'", function(err, res, fields) {
        if (err) callback(err, null);
        if (res.length == 0) {
            db.query("INSERT INTO discipline (NAME) VALUES ('" + newEvent.discipline + "')", (err, res) => {
                if (err) callback(err, null);
                callback(null, JSON.parse(JSON.stringify(res)).insertId);
            });
        } else {
            callback(null, res[0].id);
        }
    });
}

Event.insertSiteIfNoExists = (newEvent, callback) => {
    db.query("SELECT ID_SITE as id FROM sites WHERE NAME='" + newEvent.site + "'", function(err, res, fields) {
        if (err) callback(err, null);
        if (res.length == 0) {
            db.query("INSERT INTO sites (NAME, COMMUNE, LATTITUDE, LONGITUDE) VALUES ('" + newEvent.site + "', '" + newEvent.commune + "', '" + newEvent.latittude + "', '" + newEvent.longitude + "')", (err, res) => {
                if (err) callback(err, null);
                callback(null, JSON.parse(JSON.stringify(res)).insertId);
            });
        } else {
            callback(null, res[0].id);
        }
    });
}

Event.insertEvent = (newEvent, callback) => {
    db.query("INSERT INTO events (ID_DISCIPLINE, ID_SITE, EPREUVE, EVENT_DATE) VALUES ('" + newEvent.discipline_id + "', '" + newEvent.site_id + "', '" + newEvent.epreuve + "', '" + newEvent.event_date + "')", (err, res) => {
        if (err) callback(err, null);
        callback(null, JSON.parse(JSON.stringify(res)).insertId);
    });
}

Event.insertPaysIfNotExists = (newEvent, callback) => {
    db.query("SELECT ID_PAYS as id FROM pays WHERE NAME='" + newEvent.participant + "'", function(err, res, fields) {
        if (err) callback(err, null);
        if (res.length == 0) {
            db.query("INSERT INTO pays (NAME) VALUES ('" + newEvent.participant + "')", (err, res) => {
                if (err) callback(err, null);
                callback(null, JSON.parse(JSON.stringify(res)).insertId);
            });
        } else {
            callback(null, res[0].id);
        }
    });
}

Event.insertInEventHasPays = (newEvent, callback) => {
    db.query("INSERT INTO event_has_pays (ID_EVENT, ID_PAYS) VALUES ('" + newEvent.event_id + "', '" + newEvent.pays_id + "')", (err, res) => {
        if (err) callback(err, null);
        callback(null, JSON.parse(JSON.stringify(res)).insertId);
    });
}


module.exports = Event;