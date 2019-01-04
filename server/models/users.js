const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

// {
//     email: 'x@x.com',
//     password: 'asd123n231bqex',
//     tokens: [{
//         access: 'auth',
//         token: 'asdn13231212ndnx2nrgn2'
//     }]
// }

var UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
        }
    }],
});


UserSchema.methods.toJSON = function() {
    var user = this;
    // converts it to an object
    var userObject = user.toObject()

    return _.pick(userObject, ['_id', 'email']);

}


// generate auth token
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    // user id to hash and secret string
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens = user.tokens.concat([{
        access,
        token,
    }]);

    return user.save()
    .then ( () => {
        return token;
    });

}

var User = mongoose.model('User', UserSchema)

module.exports = {
    User
}