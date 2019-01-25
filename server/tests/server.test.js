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
            .set('x-auth', users[0].tokens[0]. token)
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
            .set('x-auth', users[0].tokens[0]. token)
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
            .set('x-auth', users[0].tokens[0]. token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length)
                    .toBe(1)
            })
            .end(done);
    })
})


describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text)
                    .toBe(todos[0].text);
            })
            .end(done);
    })


    it('should not return todo doc by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should return a 404 if todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    })

    it('should return 404 for non-object ids', (done => {
        request(app)
            .get('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    }))

})




describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
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

    it('should not remove a todo by another user', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                //query database using findbyID
                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo)
                            .toExist();
                        done();
                    }).catch((e) => {
                        done(e);
                    })

            })
    });


    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);

    })


    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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


    it('should not update the todo by another user', (done) => {
        //grab id of 1st item
        var hexId = todos[0]._id.toHexString();
        var text = 'this is the new text';

        // make patch req and send as body
        // update text, set completd true
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                text,
                completed: true,
                completedAt: new Date().getTime()
            })
            //try updating 1st todo by 2nd user
            .expect(404)
            .end(done);
    })


    it('should clear completedAt when todo is not completed', (done) => {

        //grab id of 2nd item
        var hexId = todos[1]._id.toHexString();
        var text = 'this new!!';

        // update text to something else, set completed to false
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
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
                done();
            }).catch ( (e) => {
                done(e);
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



describe('POST /users/login', () => {

    it ('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password,
        })
        .expect(200)
        .expect ( (res) => {
            expect ( (res.header['x-auth']).toExist())

        })
        .end( (err,res) => {
            if (err) {
                return done(err)
            }

            User.findById(users[1]._id)
            .then ( (user) => {
                expect(user.tokens[1].toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                }))
                done();
            }).catch ( (e) => {
                done(e);
            })
        })
    })

    it ('should reject invalid login', (done) => {

        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password + '1',
        })
        .expect(400)
        .expect ( (res) => {
            expect ( (res.header['x-auth'].toNotExist() ))
        })
        .end( (err, res) => {
            if (err) {
                return done(err)
            }

            User.findByID(users[1]._id).then ((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch ( (e)=> {
                done(e);
            })
        })

    })
})



describe('DELETE /users/me/token', () => {

    it ('should remove auth token on logout', (done) => {
        //make a request to our app
        request(app)
        // DELETE request to /users/me/token
        .delete('/users/me/token')
        //set x-auth to token for user[0]
        .set('x-auth', user[0].tokens[0].token)
        //expect 200
        .expect(200)
        // async expect - find user and verify there is token array has length 0
        // .expect ( (res) => {
        //     expect ( (res.header['x-auth']).toNotExist())
        // })
        .end ( (err, res) => {
            if (err) {
                return done(err)
            }

            User.findById(users[0]._id)
            // then once the user comes back
            .then ( (user) => {
                //make an assetion that the tokens array has length 0
                expect(user.tokens.length).toBe(0)
                done()
            })
            // make a catch call for errors to catch any errors
            .catch ( (e) => {
                done(e)
            })

        })
    })


})