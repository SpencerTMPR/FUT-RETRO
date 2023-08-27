
import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
    name: string,
    img: string
}

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        img: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
);

export default model<ICategory>('Category', categorySchema);
