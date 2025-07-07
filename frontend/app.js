// ====== CONFIG ======
const API_BASE = 'http://localhost:3000'; // Adjust if deploying separately
const AUTH_KEY = 'ecom_jwt';

// ====== STATE ======
let jwt = localStorage.getItem(AUTH_KEY) || '';
let user = null;
let currentPage = 1;
let currentSearch = '';
let currentCategory = '';
let totalPages = 1;

// ====== DOM ELEMENTS ======
const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const authMessage = document.getElementById('auth-message');

const navProducts = document.getElementById('nav-products');
const navCart = document.getElementById('nav-cart');
const navOrders = document.getElementById('nav-orders');
const navAdmin = document.getElementById('nav-admin');
const navLogout = document.getElementById('nav-logout');

const productSection = document.getElementById('product-section');
const productList = document.getElementById('product-list');
const productMessage = document.getElementById('product-message');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const searchBtn = document.getElementById('search-btn');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

const cartSection = document.getElementById('cart-section');
const cartList = document.getElementById('cart-list');
const cartMessage = document.getElementById('cart-message');
const placeOrderBtn = document.getElementById('place-order-btn');

const ordersSection = document.getElementById('orders-section');
const ordersList = document.getElementById('orders-list');
const ordersMessage = document.getElementById('orders-message');

const adminSection = document.getElementById('admin-section');
const adminProductForm = document.getElementById('admin-product-form');
const adminProductList = document.getElementById('admin-product-list');
const adminMessage = document.getElementById('admin-message');

const loading = document.getElementById('loading');

const adminEditForm = document.getElementById('admin-edit-form');
const editProductId = document.getElementById('edit-product-id');
const editProductName = document.getElementById('edit-product-name');
const editProductDesc = document.getElementById('edit-product-desc');
const editProductPrice = document.getElementById('edit-product-price');
const editProductCategory = document.getElementById('edit-product-category');
const editProductStock = document.getElementById('edit-product-stock');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

const showReset = document.getElementById('show-reset');
const resetFormContainer = document.getElementById('reset-form-container');
const resetForm = document.getElementById('reset-form');
const resetUsername = document.getElementById('reset-username');
const resetNewPassword = document.getElementById('reset-new-password');
const cancelResetBtn = document.getElementById('cancel-reset-btn');

const adminProductImage = document.getElementById('admin-product-image');
const adminProductImagePreview = document.getElementById('admin-product-image-preview');
const editProductImage = document.getElementById('edit-product-image');
const editProductImagePreview = document.getElementById('edit-product-image-preview');

const adminCreateAdminContainer = document.getElementById('admin-create-admin-container');
const adminCreateAdminForm = document.getElementById('admin-create-admin-form');
const adminCreateAdminUsername = document.getElementById('admin-create-admin-username');
const adminCreateAdminPassword = document.getElementById('admin-create-admin-password');

// ====== UTILS ======
function showLoading(show) {
  loading.style.display = show ? 'flex' : 'none';
}
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}
function showMessage(el, msg, color = '#e74c3c') {
  el.textContent = msg;
  el.style.color = color;
  showToast(msg, color === '#27ae60' ? 'success' : (color === '#e74c3c' ? 'error' : 'info'));
  setTimeout(() => { el.textContent = ''; }, 3000);
}
function setNavActive(section) {
  [navProducts, navCart, navOrders, navAdmin].forEach(btn => btn.classList.remove('active'));
  if (section === 'products') navProducts.classList.add('active');
  if (section === 'cart') navCart.classList.add('active');
  if (section === 'orders') navOrders.classList.add('active');
  if (section === 'admin') navAdmin.classList.add('active');
}
function setAuthUI(loggedIn) {
  authSection.style.display = loggedIn ? 'none' : 'block';
  navLogout.style.display = loggedIn ? 'inline-block' : 'none';
  navAdmin.style.display = (loggedIn && user && user.role === 'admin') ? 'inline-block' : 'none';
  if (loggedIn && user && user.role === 'admin') {
    adminCreateAdminContainer.style.display = 'block';
  } else {
    adminCreateAdminContainer.style.display = 'none';
  }
}
function setSection(section) {
  productSection.style.display = section === 'products' ? 'block' : 'none';
  cartSection.style.display = section === 'cart' ? 'block' : 'none';
  ordersSection.style.display = section === 'orders' ? 'block' : 'none';
  adminSection.style.display = section === 'admin' ? 'block' : 'none';
}
function apiUrl(path) {
  if (path.startsWith('/uploads/')) {
    return 'http://localhost:3000' + path;
  }
  return `${API_BASE}/api${path}`;
}
function apiHeaders(auth = false) {
  const h = { 'Content-Type': 'application/json' };
  if (auth && jwt) h['Authorization'] = 'Bearer ' + jwt;
  return h;
}

// ====== AUTH ======
async function loginUser(e) {
  e.preventDefault();
  showLoading(true);
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  try {
    const res = await fetch(apiUrl('/auth/login'), {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (res.ok) {
      jwt = data.token;
      user = data.user;
      localStorage.setItem(AUTH_KEY, jwt);
      setAuthUI(true);
      showMessage(authMessage, 'Login successful!', '#27ae60');
      showSection('products');
      fetchProducts();
    } else {
      showMessage(authMessage, data.message || 'Login failed');
    }
  } catch (err) {
    showMessage(authMessage, 'Login error');
  }
  showLoading(false);
}

async function registerUser(e) {
  e.preventDefault();
  showLoading(true);
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const role = document.getElementById('register-role').value;
  try {
    const res = await fetch(apiUrl('/auth/register'), {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({ username, password, role })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(authMessage, 'Registration successful! Please login.', '#27ae60');
      showLoginForm();
    } else {
      showMessage(authMessage, data.message || 'Registration failed');
    }
  } catch (err) {
    showMessage(authMessage, 'Registration error');
  }
  showLoading(false);
}

function logoutUser() {
  jwt = '';
  user = null;
  localStorage.removeItem(AUTH_KEY);
  setAuthUI(false);
  showSection('auth');
}

function showLoginForm() {
  document.getElementById('login-form-container').style.display = 'block';
  document.getElementById('register-form-container').style.display = 'none';
  resetFormContainer.style.display = 'none';
}
function showRegisterForm() {
  document.getElementById('login-form-container').style.display = 'none';
  document.getElementById('register-form-container').style.display = 'block';
  resetFormContainer.style.display = 'none';
}
function showResetForm() {
  document.getElementById('login-form-container').style.display = 'none';
  document.getElementById('register-form-container').style.display = 'none';
  resetFormContainer.style.display = 'block';
}

// ====== NAVIGATION ======
function showSection(section) {
  // Restrict access to protected sections
  if (!jwt && section !== 'auth') {
    setSection('auth');
    setNavActive();
    showMessage(authMessage, 'Please login to access this page');
    return;
  }
  setSection(section);
  setNavActive(section);
  if (section === 'products') fetchProducts();
  if (section === 'cart') fetchCart();
  if (section === 'orders') fetchOrders();
  if (section === 'admin') fetchAdminProducts();
}

navProducts.onclick = () => showSection('products');
navCart.onclick = () => showSection('cart');
navOrders.onclick = () => showSection('orders');
navAdmin.onclick = () => showSection('admin');
navLogout.onclick = logoutUser;

showRegister.onclick = (e) => { e.preventDefault(); showRegisterForm(); };
showLogin.onclick = (e) => { e.preventDefault(); showLoginForm(); };
showReset.onclick = (e) => { e.preventDefault(); showResetForm(); };

loginForm.onsubmit = loginUser;
registerForm.onsubmit = registerUser;
cancelResetBtn.onclick = () => showLoginForm();
resetForm.onsubmit = async (e) => {
  e.preventDefault();
  showLoading(true);
  try {
    const res = await fetch(apiUrl('/auth/reset-password'), {
      method: 'POST',
      headers: apiHeaders(),
      body: JSON.stringify({
        username: resetUsername.value,
        newPassword: resetNewPassword.value
      })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(authMessage, 'Password reset successful! Please login.', '#27ae60');
      showLoginForm();
    } else {
      showMessage(authMessage, data.message || 'Password reset failed');
    }
  } catch (err) {
    showMessage(authMessage, 'Password reset error');
  }
  showLoading(false);
};

// ====== PRODUCTS (with Pagination & Search) ======
async function fetchProducts(page = 1, search = '', category = '') {
  showLoading(true);
  productList.innerHTML = '';
  productMessage.textContent = '';
  let url = apiUrl(`/products?page=${page}&limit=6`);
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (res.ok) {
      renderProducts(data.products);
      productMessage.textContent = '';
      currentPage = data.page;
      totalPages = data.totalPages;
      pageInfo.textContent = `Page ${data.page} of ${data.totalPages}`;
      prevPageBtn.disabled = currentPage <= 1;
      nextPageBtn.disabled = currentPage >= totalPages;
      // Populate categories
      populateCategories(data.products);
    } else {
      showMessage(productMessage, data.message || 'Failed to fetch products');
    }
  } catch (err) {
    showMessage(productMessage, 'Error loading products');
  }
  showLoading(false);
}

function renderProducts(products) {
  if (!products.length) {
    productList.innerHTML = '<div class="empty-state">No products found.</div>';
    return;
  }
  productList.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${product.imageUrl ? `<img src="${apiUrl(product.imageUrl)}" alt="${product.name}" style="max-width:100px;max-height:100px;object-fit:cover;" />` : ''}
      <h3>${product.name}</h3>
      <div class="category">${product.category || ''}</div>
      <div>${product.description || ''}</div>
      <div class="price">₹${product.price.toFixed(2)}</div>
      <div>Stock: ${product.stock}</div>
      <button data-id="${product.id}" class="add-cart-btn">Add to Cart</button>
    `;
    card.querySelector('.add-cart-btn').onclick = () => addToCart(product.id);
    productList.appendChild(card);
  });
}

function populateCategories(products) {
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  categorySelect.innerHTML = '<option value="">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categorySelect.appendChild(opt);
  });
}

searchBtn.onclick = () => {
  currentSearch = searchInput.value;
  currentCategory = categorySelect.value;
  fetchProducts(1, currentSearch, currentCategory);
};
prevPageBtn.onclick = () => {
  if (currentPage > 1) fetchProducts(currentPage - 1, currentSearch, currentCategory);
};
nextPageBtn.onclick = () => {
  if (currentPage < totalPages) fetchProducts(currentPage + 1, currentSearch, currentCategory);
};

// ====== CART ======
async function fetchCart() {
  showLoading(true);
  cartList.innerHTML = '';
  cartMessage.textContent = '';
  try {
    const res = await fetch(apiUrl('/cart'), { headers: apiHeaders(true) });
    const data = await res.json();
    if (res.ok) {
      renderCart(data);
    } else {
      showMessage(cartMessage, data.message || 'Failed to fetch cart');
    }
  } catch (err) {
    showMessage(cartMessage, 'Error loading cart');
  }
  showLoading(false);
}

function renderCart(items) {
  if (!items.length) {
    cartList.innerHTML = '<div class="empty-state">Your cart is empty.</div>';
    return;
  }
  cartList.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      ${item.Product.imageUrl ? `<img src="${apiUrl(item.Product.imageUrl)}" alt="${item.Product.name}" style="max-width:60px;max-height:60px;object-fit:cover;vertical-align:middle;margin-right:8px;" />` : ''}
      <span>${item.Product.name} (₹${item.Product.price.toFixed(2)})</span>
      <input type="number" min="1" value="${item.quantity}" style="width:60px;">
      <button class="remove-cart-btn">Remove</button>
    `;
    div.querySelector('input').onchange = (e) => updateCartItem(item.productId, e.target.value);
    div.querySelector('.remove-cart-btn').onclick = () => removeCartItem(item.productId);
    cartList.appendChild(div);
  });
}

async function addToCart(productId) {
  if (!jwt) {
    showMessage(productMessage, 'Please login to add to cart');
    return;
  }
  showLoading(true);
  try {
    const res = await fetch(apiUrl('/cart'), {
      method: 'POST',
      headers: apiHeaders(true),
      body: JSON.stringify({ productId, quantity: 1 })
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(productMessage, 'Added to cart!', '#27ae60');
    } else {
      showMessage(productMessage, data.message || 'Failed to add to cart');
    }
  } catch (err) {
    showMessage(productMessage, 'Error adding to cart');
  }
  showLoading(false);
}

async function updateCartItem(productId, quantity) {
  showLoading(true);
  try {
    const res = await fetch(apiUrl(`/cart/${productId}`), {
      method: 'PUT',
      headers: apiHeaders(true),
      body: JSON.stringify({ quantity: parseInt(quantity) })
    });
    const data = await res.json();
    if (res.ok) {
      fetchCart();
    } else {
      showMessage(cartMessage, data.message || 'Failed to update cart');
    }
  } catch (err) {
    showMessage(cartMessage, 'Error updating cart');
  }
  showLoading(false);
}

async function removeCartItem(productId) {
  showLoading(true);
  try {
    const res = await fetch(apiUrl(`/cart/${productId}`), {
      method: 'DELETE',
      headers: apiHeaders(true)
    });
    const data = await res.json();
    if (res.ok) {
      fetchCart();
    } else {
      showMessage(cartMessage, data.message || 'Failed to remove item');
    }
  } catch (err) {
    showMessage(cartMessage, 'Error removing item');
  }
  showLoading(false);
}

placeOrderBtn.onclick = async () => {
  showLoading(true);
  try {
    const res = await fetch(apiUrl('/orders'), {
      method: 'POST',
      headers: apiHeaders(true)
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(cartMessage, 'Order placed!', '#27ae60');
      fetchCart();
    } else {
      showMessage(cartMessage, data.message || 'Failed to place order');
    }
  } catch (err) {
    showMessage(cartMessage, 'Error placing order');
  }
  showLoading(false);
};

// ====== ORDERS ======
async function fetchOrders() {
  showLoading(true);
  ordersList.innerHTML = '';
  ordersMessage.textContent = '';
  try {
    const res = await fetch(apiUrl('/orders'), { headers: apiHeaders(true) });
    const data = await res.json();
    if (res.ok) {
      renderOrders(data);
    } else {
      showMessage(ordersMessage, data.message || 'Failed to fetch orders');
    }
  } catch (err) {
    showMessage(ordersMessage, 'Error loading orders');
  }
  showLoading(false);
}

function renderOrders(orders) {
  if (!orders.length) {
    ordersList.innerHTML = '<div class="empty-state">No orders found.</div>';
    return;
  }
  ordersList.innerHTML = '';
  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'order-item';
    div.innerHTML = `
      <span>Order #${order.id} | Total: ₹${order.total.toFixed(2)} | Placed: ${new Date(order.createdAt).toLocaleString()}</span>
      <div>Items: ${order.OrderItems.map(oi => `${oi.Product.imageUrl ? `<img src='${apiUrl(oi.Product.imageUrl)}' alt='${oi.Product.name}' style='max-width:40px;max-height:40px;object-fit:cover;vertical-align:middle;margin-right:4px;' />` : ''}${oi.Product.name} (x${oi.quantity})`).join(', ')}</div>
    `;
    ordersList.appendChild(div);
  });
}

// ====== ADMIN ======
async function fetchAdminProducts() {
  showLoading(true);
  adminProductList.innerHTML = '';
  adminMessage.textContent = '';
  try {
    const res = await fetch(apiUrl('/products'));
    const data = await res.json();
    if (res.ok) {
      renderAdminProducts(data.products);
    } else {
      showMessage(adminMessage, data.message || 'Failed to fetch products');
    }
  } catch (err) {
    showMessage(adminMessage, 'Error loading products');
  }
  showLoading(false);
}

function renderAdminProducts(products) {
  if (!products.length) {
    adminProductList.innerHTML = '<div class="empty-state">No products found.</div>';
    return;
  }
  adminProductList.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      ${product.imageUrl ? `<img src="${apiUrl(product.imageUrl)}" alt="${product.name}" style="max-width:100px;max-height:100px;object-fit:cover;" />` : ''}
      <h3>${product.name}</h3>
      <div class="category">${product.category || ''}</div>
      <div>${product.description || ''}</div>
      <div class="price">₹${product.price.toFixed(2)}</div>
      <div>Stock: ${product.stock}</div>
      <button data-id="${product.id}" class="edit-btn">Edit</button>
      <button data-id="${product.id}" class="delete-btn">Delete</button>
    `;
    card.querySelector('.delete-btn').onclick = () => deleteProduct(product.id);
    card.querySelector('.edit-btn').onclick = () => showEditForm(product);
    adminProductList.appendChild(card);
  });
}

function showEditForm(product) {
  adminEditForm.style.display = 'flex';
  editProductId.value = product.id;
  editProductName.value = product.name;
  editProductDesc.value = product.description;
  editProductPrice.value = product.price;
  editProductCategory.value = product.category;
  editProductStock.value = product.stock;
  editProductImage.value = '';
  if (product.imageUrl) {
    editProductImagePreview.src = apiUrl(product.imageUrl);
    editProductImagePreview.style.display = 'block';
  } else {
    editProductImagePreview.style.display = 'none';
  }
  adminMessage.textContent = '';
  window.scrollTo({ top: adminEditForm.offsetTop - 80, behavior: 'smooth' });
}

adminEditForm.onsubmit = async (e) => {
  e.preventDefault();
  showLoading(true);
  const id = editProductId.value;
  const formData = new FormData();
  formData.append('name', editProductName.value);
  formData.append('description', editProductDesc.value);
  formData.append('price', editProductPrice.value);
  formData.append('category', editProductCategory.value);
  formData.append('stock', editProductStock.value);
  if (editProductImage.files[0]) {
    formData.append('image', editProductImage.files[0]);
  }
  try {
    const res = await fetch(apiUrl(`/products/${id}`), {
      method: 'PUT',
      headers: { 'Authorization': 'Bearer ' + jwt },
      body: formData
    });
    const resp = await res.json();
    if (res.ok) {
      showMessage(adminMessage, 'Product updated!', '#27ae60');
      adminEditForm.reset();
      editProductImagePreview.style.display = 'none';
      adminEditForm.style.display = 'none';
      fetchAdminProducts();
    } else {
      showMessage(adminMessage, resp.message || 'Failed to update product');
    }
  } catch (err) {
    showMessage(adminMessage, 'Error updating product');
  }
  showLoading(false);
};

cancelEditBtn.onclick = () => {
  adminEditForm.reset();
  adminEditForm.style.display = 'none';
};

async function deleteProduct(id) {
  if (!confirm('Delete this product?')) return;
  showLoading(true);
  try {
    const res = await fetch(apiUrl(`/products/${id}`), {
      method: 'DELETE',
      headers: apiHeaders(true)
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(adminMessage, 'Product deleted!', '#27ae60');
      fetchAdminProducts();
    } else {
      showMessage(adminMessage, data.message || 'Failed to delete product');
    }
  } catch (err) {
    showMessage(adminMessage, 'Error deleting product');
  }
  showLoading(false);
}

adminProductImage.onchange = function() {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      adminProductImagePreview.src = e.target.result;
      adminProductImagePreview.style.display = 'block';
    };
    reader.readAsDataURL(this.files[0]);
  } else {
    adminProductImagePreview.style.display = 'none';
  }
};
editProductImage.onchange = function() {
  if (this.files && this.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      editProductImagePreview.src = e.target.result;
      editProductImagePreview.style.display = 'block';
    };
    reader.readAsDataURL(this.files[0]);
  } else {
    editProductImagePreview.style.display = 'none';
  }
};

adminProductForm.onsubmit = async (e) => {
  e.preventDefault();
  showLoading(true);
  const formData = new FormData();
  formData.append('name', document.getElementById('admin-product-name').value);
  formData.append('description', document.getElementById('admin-product-desc').value);
  formData.append('price', document.getElementById('admin-product-price').value);
  formData.append('category', document.getElementById('admin-product-category').value);
  formData.append('stock', document.getElementById('admin-product-stock').value);
  if (adminProductImage.files[0]) {
    formData.append('image', adminProductImage.files[0]);
  }
  try {
    const res = await fetch(apiUrl('/products'), {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + jwt },
      body: formData
    });
    const data = await res.json();
    if (res.ok) {
      showMessage(adminMessage, 'Product added!', '#27ae60');
      adminProductForm.reset();
      adminProductImagePreview.style.display = 'none';
      fetchAdminProducts();
    } else {
      showMessage(adminMessage, data.message || 'Failed to add product');
    }
  } catch (err) {
    showMessage(adminMessage, 'Error adding product');
  }
  showLoading(false);
};

if (adminCreateAdminForm) {
  adminCreateAdminForm.onsubmit = async (e) => {
    e.preventDefault();
    showLoading(true);
    try {
      const res = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + jwt },
        body: JSON.stringify({
          username: adminCreateAdminUsername.value,
          password: adminCreateAdminPassword.value,
          role: 'admin'
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Admin created successfully!', 'success');
        adminCreateAdminForm.reset();
      } else {
        showToast(data.message || 'Failed to create admin', 'error');
      }
    } catch (err) {
      showToast('Error creating admin', 'error');
    }
    showLoading(false);
  };
}

// ====== INIT ======
function init() {
  if (jwt) {
    // Try to get user info from token (decode payload)
    try {
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      user = { id: payload.id, role: payload.role };
      setAuthUI(true);
      showSection('products');
    } catch {
      logoutUser();
    }
  } else {
    setAuthUI(false);
    setSection('auth');
  }
}

init();
