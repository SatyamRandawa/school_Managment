const mongoose = require('mongoose')


const schoolModel = new mongoose.Schema({
    name: {
        type: String,
    },
    city: {
        type: String,
        required: true,
        trim: true

    },
    state: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    }


}, { timestamps: true })

module.exports = mongoose.model('school', schoolModel)