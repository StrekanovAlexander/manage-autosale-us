import express from 'express';
import operationTypeController from '../controllers/OperationTypeController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, operationTypeController.all);
router.post('/create', auth, operationTypeController.store);
router.post('/edit', auth, operationTypeController.update);

export default router;