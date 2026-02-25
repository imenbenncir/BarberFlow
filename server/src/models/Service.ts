import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
    name: string;
    description: string;
    duration: number; // in minutes
    price: number;
    category: string;
    isActive: boolean;
    barber: mongoose.Types.ObjectId;
}

const ServiceSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        duration: { type: Number, required: true },
        price: { type: Number, required: true },
        category: { type: String, default: 'General' },
        isActive: { type: Boolean, default: true },
        barber: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { timestamps: true }
);

export default mongoose.model<IService>('Service', ServiceSchema);
