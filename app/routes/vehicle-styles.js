const express = require('express');
const vehicleController = require('../controllers/VehicleStyleController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, vehicleController.all);
router.get('/create', auth, vehicleController.create);
router.post('/create', auth, vehicleController.store);
router.get('/:id/edit', auth, vehicleController.edit);
router.post('/edit', auth, vehicleController.update);

module.exports = router;