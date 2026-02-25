import { Response } from 'express';
import Service from '../models/Service';
import { AuthRequest } from '../middleware/auth';

export const getServices = async (req: AuthRequest, res: Response) => {
    try {
        const services = await Service.find({ barber: req.user._id });
        res.json(services);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createService = async (req: AuthRequest, res: Response) => {
    try {
        const { name, duration, price, description, category } = req.body;
        const service = await Service.create({
            name,
            duration,
            price,
            description,
            category,
            barber: req.user._id,
        });
        res.status(201).json(service);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateService = async (req: AuthRequest, res: Response) => {
    try {
        const service = await Service.findOneAndUpdate(
            { _id: req.params.id, barber: req.user._id },
            req.body,
            { new: true }
        );
        if (!service) {
            return res.status(404).json({ message: 'Service not found or unauthorized' });
        }
        res.json(service);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteService = async (req: AuthRequest, res: Response) => {
    try {
        const service = await Service.findOneAndDelete({
            _id: req.params.id,
            barber: req.user._id,
        });
        if (!service) {
            return res.status(404).json({ message: 'Service not found or unauthorized' });
        }
        res.json({ message: 'Service removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
