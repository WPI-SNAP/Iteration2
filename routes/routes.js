const mysql = require('mysql');
const moment = require('moment');

module.exports = function (app) {

    // Direct to the home page
    app.get('/', function (req, res) {
        res.render('index.ejs', {});
    });

    // Direct to the home page
    app.get('/index', function (req, res) {
        res.render('index.ejs', {});
    });

    // Direct to the Gateway Shuttle Info page
    app.get('/shuttleInfo', function (req, res) {
        res.render('shuttleInfo.ejs', {});
    });

    // Direct to the SNAP Policy Page
    app.get('/policy', function (req, res) {
        res.render('policy.ejs', {});
    });


    // Adds the SNAP Ride Request newRequest to the AWS MySQL DB
    app.post('/submitRequest', function (req, res) {
        // Connect to the dispatcher database
        let dispatcherDB = mysql.createConnection({
            host: 'snapdispatcherdb.ca40maoxylrp.us-east-1.rds.amazonaws.com',
            port: '3306',
            user: 'masterAdmin',
            password: 'Pa55word',
            database: 'snapDB'
        });
        // Prepared statement to insert into newrequests table
        let addRequestStmt = 'INSERT INTO newRequests(rideTo, rideFrom, numPassengers, ' +
            'accommodations, timeIn) VALUES (?, ?, ?, ?, ?)';

        let newRequest = [req.body.goingTo, req.body.comingFrom, req.body.numPassengers, req.body.accommodations, moment(new Date()).toString()];

        // Execute the insert statement
        dispatcherDB.query(addRequestStmt, newRequest, (err, results, fields) => {
            if (err) {
                return console.error(err.message);
            }
            dispatcherDB.end();
            // Sends the user back to the home page
            res.redirect('/index');
        });
    });
};