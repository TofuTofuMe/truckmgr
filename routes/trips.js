const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const db = new sqlite3.Database('./db/trucks.db', sqlite3.OPEN_READWRITE);
var trip = express.Router();

trip.use(bodyParser.urlencoded({extended: false}));

var trip_data = [];
function load_trips() {
    db.all('SELECT * FROM trip_table', [], (err, row) => {
        if (err) {
            res.status(500).send("Error loading data");
            throw err;
        }
        // trip_data.push({
        //     plate_number: row.plate_number,
        //     date: row.date,
        //     account: row.account,
        //     route: row.route,
        //     origin: row.origin,
        //     destination: row.destination
        // });
        trip_data = row;
    });
};

trip.get('/', (req, res) => {
    load_trips();
    res.render('trips.ejs', {
        table: 'trips',
        // array: trip_data
    });
})

trip.get('/list_trips', (req, res) => {
    res.send(trip_data);
});

trip.post('/update_trip', (req, res, trip) => {
    if (req.body.trip_selected == 'new') {
        sql = `INSERT INTO trip_table (
            plate_number, date, account,
            route, origin, destination)
            VALUES ("${req.body.plate_number}",
            "${req.body.date}", "${req.body.account}",
            "${req.body.route}", "${req.body.origin}",
            "${req.body.trip_mileage}", "${req.body.total_mileage}",
            "${req.body.destination}"
        )`;

        if (!req.body.plate_number) {
            return res.send("<script>alert('Invalid form input.');window.location='/trips';</script>");
        }
    } else {
        sql = `UPDATE trip_table SET
            date="${req.body.date}",
            account="${req.body.account}",
            route="${req.body.route}",
            origin="${req.body.origin}",
            destination="${req.body.destination}",
            trip_mileage="${req.body.trip_mileage}",
            total_mileage="${req.body.total_mileage}"
            WHERE plate_number="${req.body.plate_number}"`
    }
    db.run(sql, [], (err, row) => {
        if (err) {
            res.status(500).send("Error handling request");
            throw err;
        }
    })
    return res.redirect('/trips');
});

trip.post('/drop_trip', (req, res) => {
    sql = `DELETE FROM trip_table WHERE plate_number='${req.body.plate_number}'`;

    db.run(sql, [], (err, row) => {
        if (err) {
            res.status(500).send("Error handling request");
            throw err;
        }
    });
    return res.redirect('/trips');
});

module.exports = trip;