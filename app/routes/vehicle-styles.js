import express from 'express';
import vehicleController from '../controllers/VehicleStyleController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, vehicleController.all);
router.get('/create', auth, vehicleController.create);
router.post('/create', auth, vehicleController.store);
router.get('/:id/edit', auth, vehicleController.edit);
router.post('/edit', auth, vehicleController.update);

export default router;