const { Order, OrderItem, CartItem, Product, User } = require('../models');

// Place order from cart (customer only)
exports.placeOrder = async (req, res) => {
  try {
    // Get user's cart items
    const cartItems = await CartItem.findAll({ where: { userId: req.user.id }, include: [Product] });
    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    // Check stock for each item
    for (const item of cartItems) {
      if (item.quantity > item.Product.stock) {
        return res.status(400).json({
          message: `Not enough stock for product: ${item.Product.name}. Available: ${item.Product.stock}, Requested: ${item.quantity}`
        });
      }
    }
    
    // Check for invalid quantity
    for (const item of cartItems) {
      if (item.quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for product: ${item.Product.name}. Quantity must be at least 1.`
        });
      }
    }

    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      total += item.quantity * item.Product.price;
    });

    // Create order
    const order = await Order.create({ userId: req.user.id, total });

    // Create order items
    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.Product.price,
      });
      // Optionally, decrease product stock
      item.Product.stock -= item.quantity;
      await item.Product.save();
    }

    // Clear cart
    await CartItem.destroy({ where: { userId: req.user.id } });

    res.status(201).json({ message: 'Order placed', orderId: order.id });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

// View orders (customer: own, admin: all)
exports.getOrders = async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'customer') {
      where.userId = req.user.id;
    }
    const orders = await Order.findAll({
      where,
      include: [
        { model: OrderItem, include: [Product] },
        { model: User, attributes: ['id', 'username', 'role'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
}; 