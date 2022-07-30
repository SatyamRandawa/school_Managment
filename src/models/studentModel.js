const mongoose = require('mongoose')

const studentModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        ref: 'User._id',
        required: true
    },
    schoolId: {
        type: String,
        ref: 'School._id',
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('students', studentModel)
