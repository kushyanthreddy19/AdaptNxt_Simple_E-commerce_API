const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

// Place order from cart (customer only)
router.post('/', authenticateToken, orderController.placeOrder);

// View orders (customer: own, admin: all)
router.get('/', authenticateToken, orderController.getOrders);

module.exports = router; 