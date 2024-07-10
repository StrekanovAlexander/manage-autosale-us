const express = require('express');
const reportController = require('../controllers/ReportController.js');
const lotController = require('../controllers/LotController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/current-lots', auth, lotController.currentLots);
router.get('/accounts', auth, reportController.accounts);
router.get('/accounts/:id', auth, reportController.account);

module.exports = router;