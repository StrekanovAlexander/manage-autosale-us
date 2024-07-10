import express from 'express';
import operationController from '../controllers/OperationController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, operationController.all);
router.post('/create', auth, operationController.store);
router.post('/edit', auth, operationController.update);
router.post('/remove', auth, operationController.remove);

router.post('/lot/create', auth, operationController.storeLot);

export default router;