 class Event {
     constructor(event) {
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

     //  static insert(event, callback) {
     //      db.query(sql, values, (err, result) => {
     //          if (err) throw err;
     //          callback(result);
     //      });
     //  }

 }

 module.exports = Event;