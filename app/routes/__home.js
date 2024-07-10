import express from 'express';
import homeController from '../controllers/HomeController.js';
import operationController from '../controllers/OperationController.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// router.get('/', auth, homeController.home);
router.get('/', auth, operationController.all);

router.get('/login', (req, res) => 
    res.render('home/login', { title: 'Вход', layout: false })
);

router.post('/login', homeController.login);
router.get('/logout', homeController.logout);

router.get('/404', auth, (req, res) => 
    res.render('home/404', { title: '404. Страница не найдена' }));

export default router;