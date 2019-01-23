require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');


var { mongoose } = require('./db/mongoose.js')
var { Todo } = require('./models/todo')
var { User } = require('./models/users')
var { authenticate } = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;


//express
app.use(bodyParser.json());


// POST/todos
app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    })

    todo.save()
        .then((doc) => {
            res.send(doc)
        }, (err) => {
            res.status(400).send(err)
        })
})


//GET /todos
app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.send({ todos });
        }, (e) => {
            res.status(400)
                .send('Could not get todos list', e)
        })
})


// GET / todos/5xdcdxaa6s8d76as8d
app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    //validate the ID
    if (!ObjectID.isValid(id)) {
        // if not valid, respond with 404, send back empty body, send()
        return res.status(404).send('Invalid ID');
    } else {
        //if valid
        //query the db -findbyID
        Todo.findById(id)
            .then((todos) => {
                //if no todo
                // if no todo - send back 404 with empty body send()
                if (!todos) {
                    res.send(404).send();
                }
                //success case
                // if todo exists
                // if(todo) -- send it back
                res.send({ todos })
                // error handler
            }, (e) => {
                //error case - 400 - request was not valid - send()
                res.status(400).send('Could not find todo', e);
            })
    }
});


// DELETE/todos
app.delete('/todos/:id', (req, res) => {
    //get the id
    var id = req.params.id;

    //validate the id --> not valid? return 404
    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID is not valid');
    }
    //remove todo by id
    Todo.findByIdAndRemove(id)
        .then((todo) => {
            //  success
            //if no doc, send 404
            if (!todo) {
                return res.status(404).send('No document was found');
            }
            //if doc, send 200 and doc
            res.status(200).send({ todo })
            // error -> return 400 and empty body
        }).catch((e) => {
            res.status(400).send('Could not find todo', e)
        })
})


// PATCH/todos - UPDATE
app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    // only a subset can be passed to the patch call
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send('ID is not valid');
    }

    // if completed === true
    if (_.isBoolean(body.completed) && body.completed) {

        body.completedAt = new Date().getTime();

        // else if we don't ask for a completed === true
    } else {

        body.completed = false;
        body.completedAt = null;

    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
            new: true
        }).then((todo) => {
            if (!todo) {
                return res.status(404).send();
            }
            res.send({ todo });

        }, (e) => {
            res.status(400).send(e);
        });

});


// POST /users
// callback function with req, res
// pick property from lodash to pick out parts from the body of the request
// create a new user instance from the model constructor of mongoose model
// save the user instance on mongo with a .then callback with a doc
// if the doc returns then send it back in the response
// or if an error arrives then send an error and an error status
// could use a .catch call too

// Create user
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    var user = new User({
        email: body.email,
        password: body.password,
    });
    // var user = new Users(body);

    user.save()
        .then(() => {
            return user.generateAuthToken()
        }).then((token) => {
            res.header('x-auth', token).send(user);
        }, (e) => {
            res.status(400).send(e);
        });
});




// private route
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})



// login user request
// POST /users/login
// we don't have a token

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])

    // just return the response body
    // res.send(body);

    User.findByCredentials(body.email, body.password)
        .then((user) => {
            // res.send(user);
            return user.generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token).send(user);
                })
        }).catch((e) => {
            res.status(400).send();
        })
})


// Listen
app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = { app };



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