import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
    name: string;
    email: string;
    phone?: string;
    shopId: mongoose.Types.ObjectId;
    totalBookings: number;
    totalSpent: number;
    lastVisit?: Date;
    notes?: string;
    status: 'active' | 'inactive';
}

const ClientSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    shopId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalBookings: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastVisit: { type: Date },
    notes: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, {
    timestamps: true
});

// Index for faster lookups per shop
ClientSchema.index({ shopId: 1, email: 1 }, { unique: true });
ClientSchema.index({ name: 'text', email: 'text' });

export default mongoose.model<IClient>('Client', ClientSchema);
