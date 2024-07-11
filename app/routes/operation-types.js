const express = require('express');
const operationTypeController = require('../controllers/OperationTypeController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, operationTypeController.all);
router.post('/create', auth, operationTypeController.store);
router.post('/edit', auth, operationTypeController.update);

module.exports = router;