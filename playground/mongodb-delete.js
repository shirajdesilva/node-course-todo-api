// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

//we provide a callback function with err and db object
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');

    //deleteMany
    db.collection('Users').deleteMany({name: 'Shiraj'})
    .then ( (result) => {
        console.log('Deleted', result)
    })

    // // deleteOne
    // db.collection('Todos').deleteOne({text: 'Eat Lunch'})
    // .then ( (result) => {
    //     console.log('Deleted', result)
    // })

    //findOneAndDelete

    // db.collection('Todos').findOneAndDelete({_id: ('ObjectId("5c2356c877f3c590de73b7b9")')})
    // .then ( (result) => {
    //     console.log('Deleted', result)
    // })

    db.collection('Users').findOneAndDelete({_id: ('ObjectId("5c201f9f13ceed468876d2dd")')})
    .then ( (result) => {
        console.log(result);
    });

    //client.close();
    //console.log('MongoDB client closed');
})



//.then ( () => {}, () => {})