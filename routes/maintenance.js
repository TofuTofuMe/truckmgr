const express = require('express');

var maintenance = express.Router();

maintenance.get('/', (req, res) => {
    res.render('maintenance.ejs', {table: NaN, array: NaN});
})

maintenance.get('/list_maintenance', (req, res) => {
    res.sendStatus(200);
});

maintenance.get('/update_maintenance', (req, res, maintenance) => {
    res.sendStatus(200);
});

module.exports = maintenance;