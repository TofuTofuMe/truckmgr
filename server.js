const express = require('express');
const config = require('./config.json');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');

dashboard = __dirname + '/dashboard/';
routes = __dirname + '/routes/';

app.get('/', (req, res) =>  {
    res.render('index.ejs', {company_name: config.company_name});
});

app.use(express.static('assets'));
app.use(express.static('db'));

app.use('/trucks', require(routes + 'trucks'));
// app.get('/trucks', (req, res) => {
//     res.render(dashboard + 'trucks.ejs');
// });

app.use('/trips', require(routes + 'trips'));
// app.get('/trips', (req, res) => {
//     res.render(dashboard + 'trips.ejs');
// })

app.use('/maintenance', require(routes + 'maintenance'));

// app.get('/settings', (req, res) => {
//     res.render(dashboard + 'index.ejs');
// });

// app.get('/employees', (req, res) => {
//     res.sendFile(dash_root + 'employees.html');
//     res.status(200);
// });

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
