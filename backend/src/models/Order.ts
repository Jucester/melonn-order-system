const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const OrdersSchema = Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


module.exports = model('orders', OrdersSchema);