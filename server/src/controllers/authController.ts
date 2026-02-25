import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User, { UserRole } from '../models/User';

const generateToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, barberShop, role } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            barberShop,
            role: role || UserRole.BARBER,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            barberShop: user.barberShop,
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus,
            token: generateToken((user._id as any).toString()),
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user) {
            console.log(`[AUTH] Login failed: User not found for email "${normalizedEmail}"`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        console.log(`[AUTH] Login attempt for "${normalizedEmail}": User found, Password match: ${isMatch}`);

        if (isMatch) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                barberShop: user.barberShop,
                plan: user.plan,
                subscriptionStatus: user.subscriptionStatus,
                token: generateToken((user._id as any).toString()),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req: any, res: Response) => {
    res.json(req.user);
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const normalizedEmail = email.trim().toLowerCase();

        console.log(`[AUTH] Forgot password request for: "${normalizedEmail}"`);
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const allUsers = await User.find({}, 'email');
            console.log(`[AUTH] Forgot password failed: No user found with email "${normalizedEmail}"`);
            console.log(`[AUTH] Registered emails: ${allUsers.map(u => `"${u.email}"`).join(', ')}`);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log(`[AUTH] Forgot password success: User found for "${normalizedEmail}"`);

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.passwordResetToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Token expires in 10 minutes
        user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        // In development, log the URL. In production, send an email.
        console.log('--- PASSWORD RESET LINK ---');
        console.log(resetUrl);
        console.log('---------------------------');

        res.json({ message: 'Password reset link sent to email (check console)' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Token is invalid or has expired' });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, barberShop } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (email) user.email = email.toLowerCase().trim();
        if (barberShop) user.barberShop = barberShop;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            barberShop: user.barberShop,
            plan: user.plan,
            subscriptionStatus: user.subscriptionStatus
        });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

