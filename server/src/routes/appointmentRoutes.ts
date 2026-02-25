import express from 'express';
import {
    getAppointments,
    createAppointment,
    updateAppointmentStatus,
    deleteAppointment
} from '../controllers/appointmentController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All appointment routes are protected

router.route('/')
    .get(getAppointments)
    .post(createAppointment);

router.route('/:id')
    .patch(updateAppointmentStatus)
    .delete(deleteAppointment);

export default router;
