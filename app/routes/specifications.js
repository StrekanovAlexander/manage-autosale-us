import express from 'express';
import specificationController from '../controllers/SpecificationController.js';
import specificationItemController from '../controllers/SpecificationItemController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, specificationController.all);
router.get('/create', auth, specificationController.create);
router.post('/create', auth, specificationController.store);
router.get('/:id/edit', auth, specificationController.edit);
router.post('/edit', auth, specificationController.update);

router.get('/:id/specification-items', auth, specificationItemController.all);
router.get('/:id/specification-items/create', auth, specificationItemController.create);
router.post('/specification-items/create', auth, specificationItemController.store);
router.get('/:specification_id/specification-items/:id/edit', auth, specificationItemController.edit);
router.post('/specification-items/edit', auth, specificationItemController.update);

export default router;