const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// Giriş rotası
router.post('/login', login);

// Kayıt rotası
router.post('/register', register);

module.exports = router;
