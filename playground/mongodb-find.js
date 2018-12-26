// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

//we provide a callback function with err and db object
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');

    //fetch all todos - returns a cursor, toArray turns cursor to an array
    // db.collection('Todos').find({
    //     _id: new ObjectID('5c201470a26d4152e8f1cded') //'5c201532b476c03254245166'
    // }).toArray()
    // .then( (docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    // db.collection('Todos').find().count()
    // .then( (count) => {
    //     console.log('Todos', count);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);
    // });

    db.collection('Users').find({name: 'Shadow'}).toArray()
    .then( (doc) => {
        console.log(JSON.stringify(doc, undefined, 2));
    }, (err) => {
        console.log(err);
    })

    //client.close();
    //console.log('MongoDB client closed');
})



//.then ( () => {}, () => {})