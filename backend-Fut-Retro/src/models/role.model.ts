
import { Schema, model, Document } from "mongoose";

export interface IRole extends Document {
    type: string
}

const roleSchema = new Schema(
    {
        type: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false
    }
);

export default model<IRole>('Role', roleSchema);
