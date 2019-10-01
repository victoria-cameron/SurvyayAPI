const express = require('express');
const people = require('./people.json');
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cors = require('cors');


app.set('view engine', 'pug');

//Connecting to pages
app.use(express.static(__dirname + '/public'));
app.use(cors());
app.get('/', (req, res) => {
    res.render('login', {
        title: 'LogIn',
    });
});
app.get('/main', (req, res) => {
    res.render('index', {
        title: 'Homepage',
        people: people.profiles
    });
});

app.get('/profile', (req, res) => {
    const person = people.profiles.find(p => p.id === req.query.id);
    res.render('profile', {
        title: `About ${person.firstname} ${person.lastname}`,
        person,
    });
});

app.get('/question', (req, res) => {
    res.render('create_question', {
        title: 'Create Question',
    });
});

//opening express connection
const server = app.listen(7000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});

//testing connection to DB (for comfort)
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "passwordpassword",
    database: "survay"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("MySQL running → GIRLY");
});

//opening db connection
function getMySQLConnection() {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'passwordpassword',
        database: 'survay'
    });
}

//Full example of using the DBS
app.get('/projects', function (req, res) {
    var projectList = [];

    // Connect to MySQL database.
    var connection = getMySQLConnection();
    connection.connect();

    // Do the query to get data.
    connection.query('SELECT * FROM survay.projects', function (err, rows, fields) {
        if (err) {
            res.status(500).json({ "status_code": 500, "status_message": "internal server error" });
        } else {
            // Loop check on each row
            for (var i = 0; i < rows.length; i++) {

                // Create an object to save current row's data
                var project = {
                    'ProdID': rows[i].ProdID,
                    'Title': rows[i].Title,
                    'Description': rows[i].Description,
                    'Logo': rows[i].id
                }
                // Add object into array
                projectList.push(project);
            }

            // Render index.pug page using array 
            res.render('view_projects', { "projectList": projectList });
        }
    });

    // Close the MySQL connection
    connection.end();

});

//______________________________________________________________________


var apiServer = app.listen(3000, () => {
    console.log(`Express API running → PORT ${apiServer.address().port}`);
});

var api_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'passwordpassword',
    database: 'survay'
});


api_connection.connect(function (err) {
    if (err) throw err
    console.log('You are now connected... API')
})

app.use(bodyParser.json());	   // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({	 // to support URL-encoded bodies
    extended: true
}));


//_______________________________________________________PROJECTS_____________________________________________________
//rest api to get all projects
app.get('/api/projects', function (req, res) {
    console.log(req);
    api_connection.query('select * from projects', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to get a single projects data
app.get('/api/projects/single/:ProdID', function (req, res) {
    api_connection.query('select * from projects where ProdID=?', [req.params.ProdID], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to create a new record in projects
app.post('/api/projects/add', function (req, res) {
    var postData = req.body;
    api_connection.query('INSERT INTO projects SET ?', postData, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to update record into projects
app.put('/api/projects/update', function (req, res) {
    api_connection.query('UPDATE `projects` SET `ProdID`=?,`Title`=?,`Description`=? ,`Logo`=? where `ProdID`=?', [req.body.ProdID, req.body.Title, req.body.Description, req.body.Logo, req.body.ProdID], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to delete record from mysql database
app.delete('/api/projects/delete/:ProdID', function (req, res) {
    console.log(req.body);
    api_connection.query('DELETE FROM `projects` WHERE `ProdID`=?', [req.body.ProdID], function (error, results, fields) {
        if (error) throw error;
        res.end('Record has been deleted!');
    });
});

//_______________________________________________________Questions_________________________________________________________
//view all Questions
app.get('/api/questions', function (req, res) {
    console.log(req);
    api_connection.query('select * from questions', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//Add a Question
app.post('/api/questions/add', function (req, res) {
    var postQuestion = req.body;
    api_connection.query('INSERT INTO questions SET ?', postQuestion, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
//Example Body
//{
//	"QuesID": "", (is auto gened: Dont include)
//	"Ques_text": ""
//}

//___________________________________________________________Project_Users & Passwords_______________________________________
//get a single user
app.get('/api/users/single/:ProdID/:UserID', function (req, res) {
    api_connection.query('select * from users, project_users where users.UserID = project_users.UserID And project_users.ProdID = ? And users.UserID = ?', [req.params.ProdID, req.params.UserID], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});



