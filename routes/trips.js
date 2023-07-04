const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const db = new sqlite3.Database('./db/trucks.db', sqlite3.OPEN_READWRITE);
var trip = express.Router();

trip.use(bodyParser.urlencoded({extended: false}));

var trip_data = [];
function load_trips() {
    db.each('SELECT * FROM trip_table', [], (err, row) => {
        if (err) {
          throw err;
        }
        trip_data.push({
            plate_number: row.plate_number,
            date: row.date,
            account: row.account,
            route: row.route,
            origin: row.origin,
            destination: row.destination
        });
    });
};


trip.get('/', (req, res) => {
    load_trips();
    res.render('trips.ejs', {
        table: 'trips',
        array: trip_data
    });
    trip_data = [];
})

trip.get('/list_trips', (req, res) => {
    res.sendStatus(200);
});

trip.post('/update_trip', (req, res, trip) => {
    if (req.body.truck_selected == 'new') {
        sql = `INSERT INTO trip_table (
            plate_number, date, account,
            route, origin, destination)
            VALUES ("${req.body.plate_number}",
            "${req.body.date}", "${req.body.account}",
            "${req.body.route}", "${req.body.origin}",
            "${req.body.destination}"
        )`;

        if (!req.body.plate_number) {
            return res.send("<script>alert('Invalid form input.');window.location='/trips';</script>");
        }
    } else {
        sql = `UPDATE trip_data SET
            date="${req.body.date}",
            account="${req.body.account}",
            route="${req.body.route}",
            origin="${req.body.origin}",
            destination="${req.body.destination}"
            WHERE plate_number="${req.body.truck_selected}"`
    }

    db.run(sql, [], (err, row) => {
        if (err) {
            throw err;
            // return res.status(500).send("Error handling request");
        }
        trip_data = [];
        load_trips();
    })
    return res.redirect('/trips');
});

trip.post('/drop_trip', (req, res) => {
    sql = `DELETE FROM trip_table WHERE plate_number='${req.body.truck_selected}'`;

    db.run(sql, [], (err, row) => {
        if (err) {
            throw err;
            // return res.status(500).send("Error handling request");
        }
        trip_data = [];
        load_trips();
    });
    return res.redirect('/trips');
});

module.exports = trip;