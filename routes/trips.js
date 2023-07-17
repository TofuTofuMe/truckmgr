const express = require('express');
const bodyParser = require('body-parser');

const tripController = require('../controllers/tripController');

var trip = express.Router();

trip.use(bodyParser.urlencoded({extended: false}));

trip.get('/', (req, res) => {
    res.render('tripView.ejs', {table: 'trips'});
});

trip.get('/list_trips', tripController.getTrips);

trip.post('/add_trip', tripController.addTrip);

trip.post('/update_trip', tripController.updateTrip);

trip.post('/drop_trip', tripController.dropTrip);

module.exports = trip;