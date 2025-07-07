const { Product } = require('../models');
const { Op } = require('sequelize');
const path = require('path');

// Public: List products with optional pagination and search
exports.getProducts = async (req, res) => {
  const { page = 1, limit = 10, search = '', category = '' } = req.query;
  const where = {};
  if (search) {
    where.name = { [Op.like]: `%${search}%` };
  }
  if (category) {
    where.category = category;
  }
  try {
    const products = await Product.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit: parseInt(limit),
    });
    res.json({
      products: products.rows,
      total: products.count,
      page: parseInt(page),
      totalPages: Math.ceil(products.count / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// Public: Get single product by id
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product', error: err.message });
  }
};

// Admin: Create product
exports.createProduct = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    const product = await Product.create({
      ...req.body,
      imageUrl,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

// Admin: Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let imageUrl = product.imageUrl;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }
    await product.update({
      ...req.body,
      imageUrl,
    });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};

// Admin: Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
}; 