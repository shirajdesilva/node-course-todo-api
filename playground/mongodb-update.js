// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

//we provide a callback function with err and db object
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB Server');

    const db = client.db('TodoApp');

    //findOneAndUpdate
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c2403a077f3c590de73b979')
    // },{
    //     $set: {
    //         completed: true
    //     }
    // },{
    //     returnOriginal: false
    // }
    // ).then( (result) => {
    //     console.log(result);
    // })



    db.collection('Users').findOneAndUpdate({
        id: new Object('5c201f9f13ceed468876d2dd')
    },
    {
        $inc: {
            age: 1
        },
        $set: {
            name: 'Shadow Girl'
        }
    }, {
        returnOriginal: false
    })
    .then ( (result) => {
        console.log(result);
    })

    //client.close();
    //console.log('MongoDB client closed');
})



//.then ( () => {}, () => {})