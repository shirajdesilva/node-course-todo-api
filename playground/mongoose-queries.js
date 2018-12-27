const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/users');

var id = '5c241c1dd20987281c48f3f2';

Users.findById(id)
.then ( (user) => {
    if (!user) {
        return console.log('No user with that ID found')
    }
    console.log('User by Id: ', JSON.stringify(user, undefined, 2))
}).catch( (err) => {
    console.log(err)
})


Users.findById(id)
.then ( (user) => {
    if (!user) {
        return console.log('No user with that ID found')
    }
    console.log('User by Id: ', JSON.stringify(user, undefined, 2))
}, (err) => {
    console.log(err)
});

// var id = '5c24ad6a917dc17a688dbfe4';

// // ObjectID.isValid(id);

// if (!ObjectID.isValid(id)) {
//     console.log('Invalid ID');
// } else {
//     console.log('Valid ID!!');
// }

//mongoose will convert it to an objectID
// Todo.find({
//     _id: id
// }).then( (todos) => {
//     console.log('Todos',todos);
// })


// //findOne
// Todo.findOne({
//     _id: id
// }).then ( (todo) => {
//     console.log('Todo', todo)
// })


// Todo.findById(id)
// .then ( (todo) => {
//     if(!todo) {
//         return console.log('ID not found!');
//     }
//     console.log('Todo by ID', todo)
// }).catch( (e) => {
//     console.log('Err', e);
// })