
import { Schema, Document, model } from "mongoose";

export interface ICompany extends Document {
    name: string,
    email: string,
    phone: number,
    address: string,
    logo: string,
    banner: string,
    description: string,
    rating: number,
    _id_category: string
};

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        logo: {
            type: String,
            required: true
        },
        banner: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        _id_category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        }
    },
    {
        versionKey: false
    }
);

export default model<ICompany>('Company', companySchema);
