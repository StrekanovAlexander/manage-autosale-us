const express = require('express');
const brandController = require('../controllers/BrandController.js');
const modelController = require('../controllers/ModelController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, brandController.all);
router.get('/create', auth, brandController.create);
router.post('/create', auth, brandController.store);
router.get('/:id/edit', auth, brandController.edit);
router.post('/edit', auth, brandController.update);

router.get('/:id/models', auth, modelController.all);
router.get('/:id/models/create', auth, modelController.create);
router.post('/models/create', auth, modelController.store);
router.get('/:brand_id/models/:id/edit', auth, modelController.edit);
router.post('/models/edit', auth, modelController.update);

router.get('/:brand_id/models/json', modelController.jsonByBrand);

module.exports = router;