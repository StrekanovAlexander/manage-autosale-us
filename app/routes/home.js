const express = require('express');
const homeController = require('../controllers/HomeController');
const router = express.Router();

router.get('/',  homeController.home);

module.exports = router;