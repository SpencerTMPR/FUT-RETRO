
import { Document, model, Schema } from "mongoose";

export interface IBillCreate {
    date: string,
    list_products: any[],
    subtotal: number,
    isv: number,
    commissions: {},
    total: number,
    _id_user: string
}

export interface IBill extends Document {
    date: string,
    list_products: [],
    subtotal: number,
    isv: number,
    comission: { motorist_comission: number, administration_comission: number, total_commissions: number },
    total: number,
    _id_user: string
}

const billSchema = new Schema(
    {
        date: {
            type: String,
            required: true
        },
        list_products: {
            type: Array
        },
        subtotal: {
            type: Number
        },
        isv: {
            type: Number
        },
        commissions: {
            type: Object
        },
        total: {
            type: Number
        },
        _id_user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        versionKey: false
    }
);

export default model<IBill>('Bill', billSchema);
