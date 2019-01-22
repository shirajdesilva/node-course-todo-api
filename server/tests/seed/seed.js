const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/users');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'shiraj@shiraj.com',
    password: 'userOnePass',
    tokens: [{
        acccess: 'auth',
        token: jwt.sign({_id:userOneId, access: 'auth'},'acb123').toString()
    }]
}, {
    _id: userTwoId,
    email: 'matt@matt.com',
    password: 'userTwoPass'
}];


const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 3333,
}];


const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        }).then(() => done());
}

const populateUsers = (done) => {
    User.remove({}).then ( ()=> {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        Promise.all([userOne, userTwo]).then( () => {
        }).then( () => done())
    })
}


module.exports = { todos, populateTodos, users, populateUsers };
