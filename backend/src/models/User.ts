import { Schema, model, Document } from 'mongoose';
//import bcrypt from 'bcrypt';

export interface IUser extends Document {
    username: string,
    email: string,
    password: string
}


const UserSchema = new Schema({
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
    },
}, {
    timestamps: true
});

/*
UserSchema.methods.encryptPassword = password => {
    return bcrypt.hash(password, bcrypt.genSaltSync(10));
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
} */
export default model<IUser>('User', UserSchema);