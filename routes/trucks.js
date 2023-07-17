const express = require('express');
const bodyParser = require('body-parser');

const truckController = require('../controllers/truckController');

var truck = express.Router();

truck.use(bodyParser.urlencoded({extended: false}));

truck.get('/', (req, res) => {
    res.render('truckView.ejs', {table: 'trucks'});
});

truck.get('/list_trucks', truckController.getTrucks);

truck.post('/add_truck', truckController.addTruck);

truck.post('/update_truck', truckController.updateTruck);

truck.post('/drop_truck', truckController.dropTruck);

module.exports = truck;