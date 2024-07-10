const express = require('express');
const operationController = require('../controllers/OperationController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, operationController.all);
router.post('/create', auth, operationController.store);
router.post('/edit', auth, operationController.update);
router.post('/remove', auth, operationController.remove);

router.post('/lot/create', auth, operationController.storeLot);

module.exports = router;