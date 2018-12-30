const {ObjectID} = require('mongodb');

const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {Users} = require('../server/models/users');

//Todo.remove({}) - removes everything


// Todo.remove({}).then( (result) => {
//     console.log(result);
// })

// Todo.findOneAndRemove({})

Todo.findByIdAndDelete('5c294d3d77f3c590de73fb13').then( (doc) => {
    console.log(doc);
})


Todo.findOneAndDelete({_id: '5c294d3d77f3c590de73fb13'}). then ( (doc) => {
    console.log(doc);
})