import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
    ADMIN = 'ADMIN',
    BARBER = 'BARBER',
    EMPLOYEE = 'EMPLOYEE',
    CUSTOMER = 'CUSTOMER',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    barberShop?: string;
    shop?: mongoose.Types.ObjectId;
    status: 'active' | 'inactive';
    stripeCustomerId?: string;
    subscriptionStatus: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid' | 'none';
    plan: 'free' | 'pro' | 'business';
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.BARBER,
        },
        barberShop: { type: String },
        shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
        status: { type: String, enum: ['active', 'inactive'], default: 'active' },
        stripeCustomerId: { type: String },
        subscriptionStatus: {
            type: String,
            enum: ['active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid', 'none'],
            default: 'none',
        },
        plan: {
            type: String,
            enum: ['free', 'pro', 'business'],
            default: 'free',
        },
        passwordResetToken: { type: String },
        passwordResetExpires: { type: Date },
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
