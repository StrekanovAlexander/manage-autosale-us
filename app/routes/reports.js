import express from 'express';
import reportController from '../controllers/ReportController.js';
import lotController from '../controllers/LotController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/current-lots', auth, lotController.currentLots);
router.get('/accounts', auth, reportController.accounts);
router.get('/accounts/:id', auth, reportController.account);

export default router;