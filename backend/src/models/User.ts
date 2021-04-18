const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = Schema({
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

/*
UserSchema.methods.encryptPassword = password => {
    return bcrypt.hash(password, bcrypt.genSaltSync(10));
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
} */

module.exports = model('users', UserSchema);