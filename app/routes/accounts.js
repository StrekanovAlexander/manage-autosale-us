import express from 'express';
import accountController from '../controllers/AccountController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, accountController.all);
router.post('/create', auth, accountController.store);
router.post('/edit', auth, accountController.update);

export default router;