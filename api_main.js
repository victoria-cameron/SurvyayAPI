var http = require("http");
var express_1 = require('express');
var app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

var api_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passwordpassword',
    database: 'survay'
});


api_connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected...')
})

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));


//rest api to get all results
app.get('/apitest', function (req, res) {
    console.log(req);
    connection.query('select * from projects', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});