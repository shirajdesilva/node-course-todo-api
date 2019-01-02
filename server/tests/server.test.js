const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');


const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 3333,
}];

beforeEach((done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos);
        }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text'

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text)
                    .toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                Todo.find({ text })
                    .then((todos) => {
                        expect(todos.length)
                            .toBe(1);
                        expect(todos[0].text)
                            .toBe(text);
                        done();
                    }).catch((err) => {
                        done(err);
                    })
            })
    })


    it('should not create todo with invalid body body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find()
                    .then((todos) => {
                        expect(todos.length)
                            .toBe(2);
                        done();
                    }).catch((e) => done(e));
            })

    })

})


describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length)
                    .toBe(2)
            })
            .end(done);
    })
})


describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text)
                    .toBe(todos[0].text);
            })
            .end(done);
    })


    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);
    })

    it('should return 404 for non-object ids', (done => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    }))
})




describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id)
                    .toBe(hexId)
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                //query database using findbyID
                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo)
                            .toBeFalsy();
                        done();
                    }).catch((e) => {
                        done(e);
                    })

            })
    });


    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done);

    })


    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .expect(404)
            .end(done);
    })
})



describe('PATCH /todos/:id', () => {

    it('should update the todo', (done) => {
        //grab id of 1st item
        var hexId = todos[0]._id.toHexString();
        var text = 'this is the new text';

        // make patch req and send as body
        // update text, set completd true
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: true,
                completedAt: new Date().getTime()
            })
            .expect(200)
            .expect((res) => {
                //text === text sent
                expect(res.body.todo.text)
                    .toBe(text);

                // completed is true
                expect(res.body.todo.completed)
                    .toBe(true);

                // completedAt is a number ToBeA number
                expect(res.body.todo.completedAt)
                    .toBeA('number');
            })
            .end(done);
    })


    it('should clear completedAt when todo is not completed', (done) => {

        //grab id of 2nd item
        var hexId = todos[1]._id.toHexString();
        var text = 'this new!!';

        // update text to something else, set completed to false
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text,
                completed: false,
                completedAt: null
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text)
                    .toBe(text);

                expect(res.body.todo.completed)
                    .toBe(false);

                expect(res.body.todo.completedAt)
                    .toNotExist();

            })
            .end(done)


        // expect 200
        // text is change and completed === false and completedAt === null, .toNotExist

    })

})