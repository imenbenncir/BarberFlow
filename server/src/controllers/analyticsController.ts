import { Response } from 'express';
import Appointment from '../models/Appointment';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
    try {
        const barberId = req.user._id;

        const stats = await Appointment.aggregate([
            { $match: { barber: new mongoose.Types.ObjectId(barberId), status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$price' },
                    bookingCount: { $sum: 1 },
                    averageTicket: { $avg: '$price' }
                }
            }
        ]);

        const clientCount = await Appointment.distinct('clientEmail', { barber: barberId }).then(emails => emails.length);

        res.json({
            totalRevenue: stats[0]?.totalRevenue || 0,
            bookingCount: stats[0]?.bookingCount || 0,
            averageTicket: stats[0]?.averageTicket || 0,
            clientCount
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getRevenueTrends = async (req: AuthRequest, res: Response) => {
    try {
        const barberId = req.user._id;
        const days = parseInt(req.query.days as string) || 7;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const trends = await Appointment.aggregate([
            {
                $match: {
                    barber: new mongoose.Types.ObjectId(barberId),
                    status: 'completed',
                    startTime: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } },
                    revenue: { $sum: "$price" },
                    bookings: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        res.json(trends);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getServiceDistribution = async (req: AuthRequest, res: Response) => {
    try {
        const barberId = req.user._id;

        const distribution = await Appointment.aggregate([
            { $match: { barber: new mongoose.Types.ObjectId(barberId), status: 'completed' } },
            {
                $lookup: {
                    from: 'services',
                    localField: 'service',
                    foreignField: '_id',
                    as: 'serviceInfo'
                }
            },
            { $unwind: '$serviceInfo' },
            {
                $group: {
                    _id: '$serviceInfo.name',
                    value: { $sum: 1 },
                    revenue: { $sum: '$price' }
                }
            },
            { $sort: { value: -1 } }
        ]);

        res.json(distribution);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
