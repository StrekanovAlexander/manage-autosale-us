const express = require('express');
const auth = require('../middleware/auth.js');
const homeController = require('../controllers/HomeController');

const router = express.Router();

router.get('/', auth,  homeController.home);
router.get('/login', (req, res) => 
    res.render('home/login', { title: 'Вход', layout: false })
);

module.exports = router;