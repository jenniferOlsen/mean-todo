// set up
var express        = require('express');
var app            = express(); // creates app w/express
var mongoose       = require('mongoose');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

// configuration
mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu'); // connect to mongoDB database on modulus.io
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model
var Todo = mongoose.model('Todo', {
  text: String
});

// routes
  //api
  //get all todos
  app.get('/api/todos', function(req, res) {
    //fetch from db
    Todo.find(function(err, todos) {
      if (err) //if error, send error
        res.send(err)
      res.json(todos); //else send todos
    });
  });

  //create todos
  app.post('/api/todos', function(req, res) {
    Todo.create({
      text : req.body.text,
      done : false
    }, function(err, todo) {
      if (err)
        res.send(err);
      //after creation, get all todos
      Todo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });
  });

  //delete todo
  app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
      _id : req.params.todo_id
    }, function(err, todo) {
      if (err) 
        res.send(err);
      Todo.find(function(err, todos) {
        if (err)
          res.send(err)
        res.json(todos);
      });
    });
  });

// listen (start app with node server.js) 
app.listen(8080);
console.log("App listening on port 8080");