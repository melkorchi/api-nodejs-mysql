'use strict'

// import { groupById, ObjectFilter } from './../utils/fctUtils';
// import * as lib from './../utils/fctUtils';

// var db = require('./../../db');
const DataBaseConnection = require('./../../db2');
const con = new DataBaseConnection('heroku');
// const con = new DataBaseConnection('local');
con.getConnection();
const db = con.dbLink();

var SqlString = require('sqlstring');

var Event = function(event) {
    // tbl event
    // ID_DISCIPLINE, ID_SITE, EPREUVE, EVENT_DATE
    this.discipline = event.discipline;
    this.epreuve = event.epreuve;
    this.event_date = event.event_date;
    // tbl event_has_pays
    // ID_EVENT, ID_PAYS
    // tbl pays
    // NAME
    this.participant = event.participant;
    // tbl site
    // NAME, COMMUNE, LONGITUDE, LATTITUDE
    this.commune = event.commune;
    this.site = event.site;
    this.latittude = event.latittude;
    this.longitude = event.longitude;
}

// All Events
Event.getAllEvents = (callback) => {
    let sql = "SELECT e.ID_EVENT, d.NAME as discipline, p.name as participant, e.EPREUVE, e.EVENT_DATE, s.COMMUNE, s.LONGITUDE, s.LATTITUDE, s.NAME as site FROM `events` AS e ";
    sql += "INNER JOIN discipline AS d ";
    sql += "ON e.ID_DISCIPLINE = d.ID_DISCIPLINE ";
    sql += "INNER JOIN event_has_pays AS ehp ";
    sql += "ON e.ID_EVENT = ehp.ID_EVENT ";
    sql += "INNER JOIN pays AS p ";
    sql += "ON ehp.ID_PAYS = p.ID_PAYS ";
    sql += "INNER JOIN sites AS s ";
    sql += "ON e.ID_SITE = s.ID_SITE ";
    sql += "ORDER BY e.ID_EVENT ASC";

    db.query(sql, (err, res, fields) => {
        if (err) {
            callback(err, null);
        } else {
            let ret = Object.values(JSON.parse(JSON.stringify(res)));
            callback(null, groupById(ret));

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
    let aPays = newEvent.participant.split(",");
    let oPays = {};
    console.log(aPays);
    aPays.forEach((element) => {
        db.query("SELECT ID_PAYS as id FROM pays WHERE NAME='" + element + "'", (err, res, fields) => {
            if (err) callback(err, null);
            if (res.length == 0) {
                db.query("INSERT INTO pays (NAME) VALUES ('" + element + "')", (err, res) => {
                    if (err) callback(err, null);
                    callback(null, JSON.parse(JSON.stringify(res)).insertId);
                });
            } else {
                callback(null, res[0].id);
            }
        });
    });
}

Event.insertInEventHasPays = (newEvent, callback) => {
    db.query("INSERT INTO event_has_pays (ID_EVENT, ID_PAYS) VALUES ('" + newEvent.event_id + "', '" + newEvent.pays_id + "')", (err, res) => {
        if (err) callback(err, null);
        callback(null, JSON.parse(JSON.stringify(res)).insertId);
    });
}

Event.getEventById = (id, callback) => {
    let sqlG = "SELECT e.ID_EVENT, d.NAME as discipline, p.name as participant, e.EPREUVE, e.EVENT_DATE, s.NAME as site, s.COMMUNE, s.LONGITUDE, s.LATTITUDE FROM `events` AS e ";
    sqlG += "INNER JOIN discipline AS d ";
    sqlG += "ON e.ID_DISCIPLINE = d.ID_DISCIPLINE ";
    sqlG += "INNER JOIN event_has_pays AS ehp ";
    sqlG += "ON e.ID_EVENT = ehp.ID_EVENT ";
    sqlG += "INNER JOIN pays AS p ";
    sqlG += "ON ehp.ID_PAYS = p.ID_PAYS ";
    sqlG += "INNER JOIN sites AS s ";
    sqlG += "ON e.ID_SITE = s.ID_SITE ";
    sqlG += "WHERE e.ID_EVENT = ?";
    db.query(sqlG, id, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, groupById(res));
        }
    });
}

Event.updateEventById = (id, obj, callback) => {
    // @todo manage dates
    // Utilisation de sqlstring
    let aPays = obj.PAYS_ID.split(',');
    delete obj.PAYS_ID;
    let sql = SqlString.format('UPDATE ?? SET ? WHERE `ID_EVENT` = ?', ['events', obj, id]);
    console.log('sql', sql);

    db.query(sql, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            // Mettre à jour les pays participants
            db.query("DELETE FROM event_has_pays WHERE ID_EVENT=?", id, (err, res) => {
                if (err) {
                    callback(err, null);
                } else {
                    aPays.forEach((item) => {
                        db.query("INSERT INTO event_has_pays (ID_EVENT, ID_PAYS) VALUES ('" + id + "', '" + item + "')", (err, res) => {
                            if (err) callback(err, null);
                        });
                    });
                    callback(null, 'UPDATE OK');
                }
            });
        }
    });
}

Event.removeEventById = (id, callback) => {
    db.query("DELETE FROM events WHERE ID_EVENT=?", id, (err, res) => {
        if (err) {
            callback(err, null);
        } else {
            db.query("DELETE FROM event_has_pays WHERE ID_EVENT=?", id, (err, res) => {
                if (err) {
                    callback(err, null);
                } else {
                    callback(null, res.affectedRows);
                }
            });
        }
    });
}

Object.filter = (obj, fn) =>
    Object.keys(obj)
    .filter(key => fn(obj[key]))
    .reduce((res, key) => (res[key] = obj[key], res), {});

// let filtered = Object.filter(event, value => value != undefined);

module.exports = Event;