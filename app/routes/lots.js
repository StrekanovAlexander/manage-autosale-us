const express = require('express');
const lotController = require('../controllers/LotController.js');
const auth = require('../middleware/auth.js');

const router = express.Router();

router.get('/', auth, lotController.all);
router.get('/create', auth, lotController.create);
router.post('/create', auth, lotController.store);
router.get('/:id/edit', auth, lotController.edit);
router.post('/edit', auth, lotController.update);
router.get('/:id/details', auth, lotController.details);

router.post('/date/edit', auth, lotController.editDate);
router.post('/price/edit', auth, lotController.editPrice);

router.get('/:id/files', lotController.files);
router.post('/files/upload', lotController.upload);

router.post('/files/set-default', lotController.setImgDefault);

module.exports = router;