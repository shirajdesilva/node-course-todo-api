var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose.js')
var {Todo} = require('./models/todo')
var {Users} = require('./models/users')

var app = express();
var port = 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })

    todo.save()
    .then ((doc) => {
        res.send(doc)
    }, (err) => {
        res.status(400).send(err)
    })
})


app.get('/todos', (req, res) => {
    Todo.find()
    .then ( (todos) => {
        res.send({todos});
    }, (e) => {
       res.status(400)
       .send('Could not get todos list', e)
    })
})


app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = {app};



// var newTodo = new Todo({
//     text: 'Book Osaka Accomodation',
//     completed: false,
//     //completedAt: new Date()
// });

// newTodo.save()
// // do something once the save completes
// .then ( (doc) => {
//     console.log('Saved todo', JSON.stringify(doc, undefined, 2))
// }, (err) => {
//     console.log('Unable to save',err)
// // });


// var newUser = new Users({
//     name: 'Shiraj',
//     email: 'shiraj@shiraj.com',
// })

// newUser.save()
// .then ( (doc) => {
//     console.log('user saved', JSON.stringify(doc, undefined, 2))
// }, (err) => {
//     console.log('Could not create user', err)
// })