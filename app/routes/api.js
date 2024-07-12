const express = require('express');
const apiController = require('../controllers/ApiController.js');

const router = express.Router();

router.get('/brands', apiController.brands);
router.get('/lots', apiController.lots);

module.exports = router;