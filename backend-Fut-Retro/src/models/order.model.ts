
import { Document, model, Schema } from "mongoose";

export interface IOrderCreate {
    date: string,
    list_products: [],
    address: string,
    _id_motorist?: string,
    _id_client: string,
    state: string
}

export interface IOrder extends Document {
    date: string,
    list_products: [],
    address: number,
    _id_motorist: string,
    _id_client: string,
    state: string
}

const orderSchema = new Schema(
    {
        date: {
            type: String,
            required: true
        },
        list_products: {
            type: Array,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        _id_motorist: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        _id_client: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        state: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
);

export default model<IOrder>('Order', orderSchema);
