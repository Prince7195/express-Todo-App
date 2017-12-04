var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// PORT
const port = 3000;

// Init app
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/todoapp';

// body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// static folder setup
app.use(express.static(path.join(__dirname, 'public')));

// view setup
app.set('views', path.join(__dirname, 'views'));

// view engine setup
app.set('view engine', 'ejs');

// Connect to mongod
MongoClient.connect(url, (error, database) => {
    console.log('mongodb connected');
    if(error)
        throw error;
    
    db = database;
    Todos = db.collection('todos');

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

app.get('/', (req, res, next) => {
    // res.render('index');
    Todos.find({}).toArray((err, todos) => {
        if(err) {
            return console.log(err);
        }
        res.render('index', {
            todos: todos
        });
    });
});

app.post('/todo/add', (req, res, next) => {
    
    // create todo
    const todo = {
        text: req.body.text,
        body: req.body.body
    };

    // Insert todo
    Todos.insert(todo, (error, result) => {   
        if(error) {
            console.log(error);
        }
        res.redirect('/');
    });
});

app.delete('/todo/delete/:id', (req, res, next) => {
    const query = { _id: ObjectID(req.params.id)};
    Todos.deleteOne(query, (error, response) => {
        if(error) {
            console.log(error);
        }
        res.send(200);
    });
});

app.get('/todo/edit/:id', (req, res, next) => {
    const query = { _id: ObjectID(req.params.id) };
    Todos.find(query).next((err, todo) => {
        if (err) {
            return console.log(err);
        }
        res.render('edit', {
            todo: todo
        });
    });
});

app.post('/todo/edit/:id', (req, res, next) => {
    const query = { _id: ObjectID(req.params.id) };
    
    // create todo
    const todo = {
        text: req.body.text,
        body: req.body.body
    };

    // update todo
    Todos.updateOne(query, {$set: todo}, (error, result) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/');
    });
});