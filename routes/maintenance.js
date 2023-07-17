const express = require('express');
const bodyParser = require('body-parser');

const maintenanceController = require('../controllers/maintenanceController');

var maintenance = express.Router();

maintenance.use(bodyParser.urlencoded({extended: false}));

maintenance.get('/', (req, res) => {
    res.render('maintenanceView.ejs', {table: 'maintenance'});
});

maintenance.get('/list_maintenance', maintenanceController.getMaintenance);

maintenance.post('/add_maintenance', maintenanceController.addMaintenance);

maintenance.post('/update_maintenance', maintenanceController.updateMaintenance);

maintenance.post('/drop_maintenance', maintenanceController.dropMaintenance);

module.exports = maintenance;