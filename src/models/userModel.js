const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const userModel = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true

    },
    last_name: {
        type: String,
        required: true,
        trim: true

    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    roleId: {
        type: ObjectId,
        ref: 'Role._id',
        default: null


    }
}, { timestamps: true })

module.exports = mongoose.model('user', userModel)