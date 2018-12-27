var mongoose = require('mongoose');

var Users = mongoose.model('Users', {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
    }
})

module.exports = {
    Users
}