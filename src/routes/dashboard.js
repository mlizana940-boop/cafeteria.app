const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const auth = require('../middlewares/authenticate'); 

router.get('/', auth, getDashboard); // ← sin destructuring

module.exports = router;