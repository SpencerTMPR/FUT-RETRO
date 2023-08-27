
import { Schema, Document, model } from "mongoose";
import bcrypt from 'bcrypt';
import Company from '../models/company.model';

export interface IUser extends Document {
    name: string,
    phone: number,
    email: string,
    password: string,
    img_profile: string,
    _id_role: { _id: string, type: string },
    approved: boolean
};

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        img_profile: {
            type: String,
            required: false
        },
        _id_role: {
            type: Schema.Types.ObjectId,
            ref: "Role"
        },
        approved: {
            type: Boolean,
            required: false
        }
    },
    {
        versionKey: false
    }
);

export default model<IUser>('User', userSchema);
