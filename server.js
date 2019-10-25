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
const server = app.listen(7000,'0.0.0.0',() => {
    console.log(`Express running → PORT ${server.address().port}`);
});


//testing connection to DB (for comfort)
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "TeamRivas12$",
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
        password: 'TeamRivas12$',
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


var apiServer = app.listen(3000,'0.0.0.0', () => {
    console.log(`Express API running → PORT ${apiServer.address().port}`);
});

var api_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'TeamRivas12$',
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
    console.log(req);
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

//Add a Question Choice
app.post('/api/questions/add_choice', function (req, res) {
    console.log(req);
    var postChoice = req.body;
    api_connection.query('INSERT INTO questions_choices SET ?', postChoice, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
//Example Body
//{
//	"QuesID": "", 
//	"Choi_text": "", 
//  "Choi_text_id": ""
//}

//View all the Choices for a Question
app.get('/api/questions/single/:QuesID', function (req, res) {
    console.log(req);
    api_connection.query('select * from questions_choices where QuesID=?', [req.params.QuesID], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//View all the Choices for a Question
app.get('/api/questions/all', function (req, res) {
    console.log(req);
    api_connection.query('select * from questions_choices, questions where questions_choices.QuesID=questions.QuesID', [req.params.QuesID], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//___________________________________________________________Project_Users & Passwords_______________________________________
//get a single user
app.get('/api/users/single/:ProdID/:UserID', function (req, res) {
    api_connection.query('select * from users, project_users where users.UserID = project_users.UserID And project_users.ProdID = ? And users.UserID = ?', [req.params.ProdID, req.params.UserID], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//______________________________________________________________Surveys________________________________________________________
//Get all surveys
app.get('/api/surveys', function (req, res) {
    console.log(req);
    api_connection.query('select * from surveys', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//rest api to get a single surveys data
app.get('/api/surveys/single/:SurvID', function (req, res) {
    api_connection.query('select * from surveys where SurvID=?', [req.params.SurvID], function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//Add a survey
app.post('/api/surveys/add', function (req, res) {
    var postSurvey = req.body;
    api_connection.query('INSERT INTO surveys SET ?', postSurvey, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
//Example Body
//{
//	"SurvCreator": "",
//	"SurvTitle": "",
//	"SurvDescription": ""
//}

//add question to a survey
app.post('/api/surveys/add_question', function (req, res) {
    var postSet = req.body;
    api_connection.query('INSERT INTO survey_questions SET ?', postSet, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
//Example Body
//{
//	"SurvID": "", 
//	"QuesID": "" 
//}

//Get all Questions and choices for a survey ______DO NOT COPY______
app.get('/api/surveys/gather/:SurvID', function (req, res) {
    api_connection.query('select * from surveys, questions, survey_questions, questions_choices where questions.QuesID = survey_questions.QuesID and surveys.SurvID = survey_questions.SurvID and questions.QuesID = questions_choices.QuesID and surveys.SurvID=?', [req.params.SurvID],
        function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});


//______________________________________________________________Interviews________________________________________________________
//Get all interviews
app.get('/api/interviews', function (req, res) {
    console.log(req);
    api_connection.query('select * from interviews', function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});

//get all questions and answers for a given interview
app.get('/api/interviews/gather/:InteID', function (req, res) {
    api_connection.query('select * from interviews, records, questions where interviews.InteID = records.InteID and records.QuesID = questions.QuesID and interviews.InteID = ?', [req.params.InteID],
        function (error, results, fields) {
            if (error) throw error;
            res.end(JSON.stringify(results));
        });
});


//Add a new interview
app.post('/api/interviews/add', function (req, res) {
    var postInterview = req.body;
    api_connection.query('INSERT INTO interviews SET ?', postInterview, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
//Example Body
//{
//	"Filled_by": "",
//	"SurvID": "",
//  "InteTitle": ""
//}

//Add a record to an interview
app.post('/api/interviews/add_record', function (req, res) {
    var postRecord = req.body;
    api_connection.query('INSERT INTO interviews SET ?', postRecord, function (error, results, fields) {
        if (error) throw error;
        res.end(JSON.stringify(results));
    });
});
//Example Body
//{
//	"InteID": "",
//	"QuesID": "",
//  "Reco_ans": "",
//  "Note": ""
//}






