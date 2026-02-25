import express from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/clientController';
import { protect } from '../middleware/auth';

const router = express.Router();

// All client routes are protected
router.use(protect);

router.get('/', getClients);
router.post('/', createClient);
router.put('/:id', updateClient);
router.delete('/:id', deleteClient);

export default router;
