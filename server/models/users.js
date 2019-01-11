const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

// new find by token
UserSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123')
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        // generate a salt, with 10 rounds
        //user.password
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                var hashedPassword = hash;
                // set user password as the hashed password
                user.password = hashedPassword;
                next();
            })
        })

        //user.password = hashed value

        //next

    } else {
        next();
    }
})

var User = mongoose.model('User', UserSchema)

module.exports = {
    User
};