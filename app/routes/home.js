const express = require('express');
const auth = require('../middleware/auth.js');
const homeController = require('../controllers/HomeController');
const lotController = require('../controllers/LotController.js');

const router = express.Router();

router.get('/', auth, lotController.all);

router.get('/login', (req, res) => 
    res.render('home/login', { title: 'Вход', layout: false })
);

router.post('/login', homeController.login);

router.get('/logout', auth, homeController.logout);

router.get('/404', auth, (req, res) => 
    res.render('home/404', { 
        title: '404. Page not found'
    }
));

module.exports = router;