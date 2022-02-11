const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    //object
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    //object
    email: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    //object
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    //object
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('User', userSchema);