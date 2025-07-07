const { CartItem, Product } = require('../models');

// Get current user's cart
exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [Product],
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let cartItem = await CartItem.findOne({ where: { userId: req.user.id, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ userId: req.user.id, productId, quantity });
    }
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
};

// Update item quantity in cart
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cartItem = await CartItem.findOne({ where: { userId: req.user.id, productId: req.params.productId } });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    cartItem.quantity = quantity;
    await cartItem.save();
    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
};

// Remove item from cart
exports.removeCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({ where: { userId: req.user.id, productId: req.params.productId } });
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove cart item', error: err.message });
  }
}; 