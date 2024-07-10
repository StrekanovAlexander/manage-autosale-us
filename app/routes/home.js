const express = require('express');
const auth = require('../middleware/auth.js');
const homeController = require('../controllers/HomeController');
const operationController = require('../controllers/OperationController.js');

const router = express.Router();

// router.get('/', auth,  homeController.home);
router.get('/', auth, operationController.all);

router.get('/login', (req, res) => 
    res.render('home/login', { title: 'Вход', layout: false })
);

router.post('/login', homeController.login);

router.get('/logout', auth, homeController.logout);

router.get('/404', auth, (req, res) => 
    res.render('home/404', { title: '404. Page not found' }));

module.exports = router;