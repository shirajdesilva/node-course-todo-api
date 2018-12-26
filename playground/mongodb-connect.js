// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

var obj = new ObjectID();
console.log(obj);

//we provide a callback function with err and db object
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');

    db.collection('Todos').insertOne({
        text: 'Book Japan Accomodation',
        completed:false
    }, (err, result) => {
        if (err) {
            return console.log('Could not insert document', err);
        }
        console.log('Document inserted', JSON.stringify(result.ops, undefined, 2));

    })


    //Insert new doc into Users collection (name, age, location)
    // db.collection('Users').insertOne({
    //     name: 'Shadow',
    //     age: 32,
    //     location: 'Colombo'
    // },
    // (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert user');
    //     }
    //     console.log(
    //     'Added the new user',
    //     JSON.stringify(result.ops, undefined, 2),
    //     //result.ops[0]._id.getTimeStamp()
    //     );
    // })
    // Don't forget to use result.ops

    client.close();
    console.log('MongoDB client closed');
})



