import { Schema, model, Document } from 'mongoose';

export interface IOrder extends Document {
    userId: string,
    sellerStore: string,
    shippingMethod: number,
    externalNumber: string,
    buyerName: string,
    buyerPhone: string,
    buyerEmail: string,
    shippingAddress: string,
    shippingCity: string,
    shippingRegion: string,
    shippingCountry: string,
    lineItems: string[],
}

const OrdersSchema = new Schema({
    userId: {
        type: String,
        required: true,
        trim: true
    },
    sellerStore: {
        type: String,
        required: true,
    },
    shippingMethod: {
        type: Number,
        required: true,
    },
    externalOrder: {
        type: String,
        required: true
    },
    buyerName: {
        type: String,
        required: true,
    },
    buyerPhone: {
        type: String,
        required: true,
    },
    buyerEmail: {
        type: String,
        required: true,
    },
    shippingAddress: {
        type: String,
        required: true,
    },
    shippingCity: {
        type: String,
        required: true,
    },
    shippingRegion: {
        type: String,
        required: true,
    },
    shippingCountry: {
        type: String,
        required: true,
    },
    lineItems: {
        type: Array,
        required: true,
    },
});


export default model<IOrder>("Order", OrdersSchema);