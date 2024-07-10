import express from 'express';
import userController from '../controllers/UserController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, userController.all);
router.get('/create', auth, userController.create);
router.post('/create', auth, userController.store);

router.get('/:id/edit', auth, userController.edit);
router.post('/edit', auth, userController.update);

router.get('/:id/pwd', auth, userController.pwd);
router.post('/pwd', auth, userController.savePwd);


export default router;