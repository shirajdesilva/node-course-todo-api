const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');
const { User } = require ('./../models/users');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);

beforeEach(populateTodos);

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


describe ('GET /users/me', () => {
    it ('should return user if authenticated', (done) => {
        resquest(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect( (res) => {
            expect ( (res.body._id).toBe(users[0]._ud.toHexString()))
            expect ( res.body.email.toBe(users[0].email))
        })
        .end(done);
    })

    it ('should return a 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect ( (res) => {
            expect( (res.body).toEqual([{}]))
        })
        .end(done);
    })
})



describe ('POST /users', () => {
    it ('should create a user', (done) =>{
        var email = 'example@example.com';
        var password = '123mnb';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect ( (res) => {
            expect((res.header['x-auth']).toExit() )
            expect ( (res.body._id).toExist())
            expect ( (res.body.email).toBe(email) )
        })
        .end( (err) => {
            if (err) {
                return done(err);
            }

            users.findOne({email}).then( (user) => {
                expect(user).toExist();
                expect(user.password).toNotBe(password);
            })
        });
    })

    it ('should return validation errors if request invalid', (done) =>{
        var email = 'and';
        var password = '123';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            // .expect ( (res) => {
            //     expect
            // })
            .end(done);
    })

    it ('should not create a user if email is in use', (done) => {
        var email = users[0].email;
        var password = 'password';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            // .expect ( (res) => {

            // })
            .end(done)
    })
})