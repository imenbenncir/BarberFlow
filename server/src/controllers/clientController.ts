import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Client from '../models/Client';

export const getClients = async (req: AuthRequest, res: Response) => {
    try {
        const clients = await Client.find({ shopId: req.user._id }).sort({ createdAt: -1 });
        res.json(clients);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createClient = async (req: AuthRequest, res: Response) => {
    try {
        const { name, email, phone, notes } = req.body;

        // Check if client already exists for this shop
        const existingClient = await Client.findOne({
            shopId: req.user._id,
            email: email.toLowerCase().trim()
        });

        if (existingClient) {
            return res.status(400).json({ message: 'Client with this email already exists' });
        }

        const client = new Client({
            name,
            email: email.toLowerCase().trim(),
            phone,
            notes,
            shopId: req.user._id
        });

        await client.save();
        res.status(201).json(client);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateClient = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const client = await Client.findOneAndUpdate(
            { _id: id, shopId: req.user._id },
            updates,
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteClient = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const client = await Client.findOneAndDelete({ _id: id, shopId: req.user._id });

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({ message: 'Client deleted successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
