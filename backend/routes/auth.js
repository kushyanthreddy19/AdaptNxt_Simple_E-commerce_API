const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public registration (customer only) or admin registration (if authenticated as admin)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);

module.exports = router; 