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
            console.log("error: ", err);
            result(err, null);
        } else {
            let ret = Object.values(JSON.parse(JSON.stringify(res)));
            // console.log(ret);
            result(null, rewriteEvents(ret));
        }
    });
};

function setDatas(tab, obj) {
    obj.id_event = tab.ID_EVENT;
    obj.discipline = tab.discipline;
    obj.epreuve = tab.EPREUVE;
    obj.event_date = tab.EVENT_DATE;
    obj.commune = tab.COMMUNE;
    obj.long = tab.LONGITUDE;
    obj.lat = tab.LATTITUDE;
    obj.participants = [];
    obj.participants.push(tab.participant);
}

function rewriteEvents(matrice) {
    let aEvents = [];
    let event = {
        id_event: 0,
        discipline: '',
        epreuve: '',
        event_date: '',
        commune: '',
        long: 0,
        lat: 0,
        participants: []
    };
    for (let i = 0; i < matrice.length; i++) {
        if (i == 0) {
            setDatas(matrice[i], event);
        } else {
            if (matrice[i].ID_EVENT == event.id_event) {
                event.participants.push(matrice[i].participant);
                if (i == matrice.length - 1) {
                    aEvents.push(event);
                }
            } else {
                aEvents.push(event);
                event = {};
                setDatas(matrice[i], event);
            }
        }
    }
    // console.log(aEvents);
    return aEvents;
}

// Create an event
oEvent.createEvent = (newEvent, result) => {
    var discipline_id = 0;
    // @todo Test if events already exists
    // Test si discipline existe 
    db.query("SELECT ID_DISCIPLINE, COUNT(*) as nb FROM discipline WHERE NAME='" + newEvent.discipline + "'", function(err, res, fields) {
        if (err) {
            result(err, null);
        } else {
            let ret = Object.values(JSON.parse(JSON.stringify(res)));
            // var discipline_id = 0;
            if (ret && ret[0].nb == 1) {
                // La discipline existe déjà
                discipline_id = ret[0].ID_DISCIPLINE;
            } else {
                // La discipline n'existe pas
                db.query("INSERT INTO discipline (NAME) VALUES ('" + newEvent.discipline + "')", function(err, res) {
                    if (err) {
                        result(err, null);
                    } else {
                        discipline_id = res.insertId;
                        console.log('before: ', discipline_id);
                    }
                })
                console.log('discipline_id1: ', discipline_id);
            }
            console.log('discipline_id2: ', discipline_id);
        }
    });
}

module.exports = oEvent;