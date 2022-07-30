const mongoose = require('mongoose')


const roleModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    scopes: [
        {
            type: String
        }
    ]
}, { timestamps: true })

module.exports = mongoose.model('role', roleModel)
