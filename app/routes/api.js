import express from 'express';
import apiController from '../controllers/ApiController.js';

const router = express.Router();

router.get('/brands', apiController.brands);
router.get('/lots', apiController.lots);

export default router;