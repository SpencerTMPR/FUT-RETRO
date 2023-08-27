
import { Document, Schema, model } from 'mongoose';

export interface IProduct extends Document {
    name: string,
    img: string,
    price: number,
    _id_company: string
}

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        _id_company: {
            type: Schema.Types.ObjectId,
            ref: "Company"
        }
    },
    {
        versionKey: false
    }
);

export default model<IProduct>('Product', productSchema);
