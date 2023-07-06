const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const db = new sqlite3.Database('./db/trucks.db', sqlite3.OPEN_READWRITE);
var truck = express.Router();

truck.use(bodyParser.urlencoded({extended: false}));

var vehicle_data = [];
function load_trucks() {
    db.all('SELECT * FROM vehicle_data', [], (err, row) => {
        if (err) {
            res.status(500).send("Error loading data");
            throw err;
        }
        // vehicle_data.push({
        //     plate_number: row.plate_number,
        //     year_model: row.year_model,
        //     mv_filenumber: row.mv_filenumber,
        //     or_number: row.or_number,
        //     make: row.make,
        //     type: row.type
        // });
        vehicle_data = row;
    });
};

truck.get('/', (req, res) => {
    load_trucks();
    res.render('trucks.ejs', {table: 'trucks'});
});

truck.get('/list_trucks', (req, res) => {
    res.send(vehicle_data);
});

truck.post('/update_truck', (req, res) => {
    if (req.body.truck_selected == 'new') {
        sql = `INSERT INTO vehicle_data (
            plate_number, year_model, mv_filenumber,
            or_number, make, type)
            VALUES ("${req.body.plate_number}",
            "${req.body.year_model}", "${req.body.mv_filenumber}",
            "${req.body.or_number}", "${req.body.make}",
            "${req.body.type}"
        )`;

        if (!req.body.plate_number) {
            return res.send("<script>alert('Invalid form input.');window.location='/trucks';</script>");
        }
    } else {
        sql = `UPDATE vehicle_data SET
            year_model="${req.body.year_model}",
            mv_filenumber="${req.body.mv_filenumber}",
            or_number="${req.body.or_number}",
            make="${req.body.make}", type="${req.body.type}"
            WHERE plate_number="${req.body.plate_number}"`;
    }
    db.run(sql, [], (err, row) => {
        if (err) {
            res.status(500).send("Error handling request");
            throw err;
        }
    });
    return res.redirect('/trucks');
});

truck.post('/drop_truck', (req, res) => {
    sql = `DELETE FROM vehicle_data WHERE plate_number='${req.body.plate_number}'`;

    db.run(sql, [], (err, row) => {
        if (err) {
            res.status(500).send("Error handling request");
            throw err;
        }
        vehicle_data = [];
        load_trucks();
    });
    return res.redirect('/trucks');
});

module.exports = truck;