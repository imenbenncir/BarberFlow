import { Response } from 'express';
import Appointment from '../models/Appointment';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/auth';

export const getAppointments = async (req: AuthRequest, res: Response) => {
    try {
        const { start, end } = req.query;
        const filter: any = { barber: req.user._id };

        if (start && end) {
            filter.startTime = { $gte: new Date(start as string), $lte: new Date(end as string) };
        }

        const appointments = await Appointment.find(filter)
            .populate('service')
            .sort({ startTime: 1 });

        res.json(appointments);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const { clientName, clientEmail, serviceId, startTime, notes } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        const start = new Date(startTime);
        const end = new Date(start.getTime() + service.duration * 60000);

        // Conflict detection: Check for overlapping appointments for this barber
        const conflict = await Appointment.findOne({
            barber: req.user._id,
            status: { $ne: 'cancelled' },
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        if (conflict) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }

        const appointment = await Appointment.create({
            clientName,
            clientEmail,
            service: serviceId,
            barber: req.user._id,
            startTime: start,
            endTime: end,
            price: service.price,
            notes,
        });

        res.status(201).json(appointment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findOneAndUpdate(
            { _id: req.params.id, barber: req.user._id },
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
    try {
        const appointment = await Appointment.findOneAndDelete({
            _id: req.params.id,
            barber: req.user._id,
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json({ message: 'Appointment removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
