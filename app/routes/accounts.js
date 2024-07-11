const express = require('express');
const accountController = require('../controllers/AccountController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, accountController.all);
router.post('/create', auth, accountController.store);
router.post('/edit', auth, accountController.update);

module.exports = router;