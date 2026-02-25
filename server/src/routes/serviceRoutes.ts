import express from 'express';
import {
    getServices,
    createService,
    updateService,
    deleteService
} from '../controllers/serviceController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getServices)
    .post(createService);

router.route('/:id')
    .patch(updateService)
    .delete(deleteService);

export default router;
