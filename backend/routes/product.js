const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Public
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);

// Admin only
router.post('/', authenticateToken, authorizeRole('admin'), upload.single('image'), productController.createProduct);
router.put('/:id', authenticateToken, authorizeRole('admin'), upload.single('image'), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRole('admin'), productController.deleteProduct);

module.exports = router; 