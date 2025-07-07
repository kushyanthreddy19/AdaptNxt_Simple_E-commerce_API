const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// All routes require authentication (customer or admin)
router.get('/', authenticateToken, cartController.getCart);
router.post('/', authenticateToken, cartController.addToCart);
router.put('/:productId', authenticateToken, cartController.updateCartItem);
router.delete('/:productId', authenticateToken, cartController.removeCartItem);

module.exports = router; 