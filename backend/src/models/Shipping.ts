import { Schema, model, Document } from 'mongoose';

new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    shippingType: {
        type: String,
        required: true
    },
    rules: {
        
    }
})