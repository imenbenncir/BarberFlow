import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
    clientName: string;
    clientEmail: string;
    service: mongoose.Types.ObjectId;
    barber: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    price: number;
    notes?: string;
}

const AppointmentSchema: Schema = new Schema(
    {
        clientName: { type: String, required: true },
        clientEmail: { type: String, required: true },
        service: { type: Schema.Types.ObjectId, ref: 'Service', required: true },
        barber: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        startTime: { type: Date, required: true },
        endTime: { type: Date, required: true },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'confirmed',
        },
        price: { type: Number, required: true },
        notes: { type: String },
    },
    { timestamps: true }
);

// Index for performance and conflict lookups
AppointmentSchema.index({ barber: 1, startTime: 1, endTime: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
