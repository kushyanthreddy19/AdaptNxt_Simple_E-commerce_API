# AdaptNxt Simple E-commerce API & Frontend

A full-stack, modern e-commerce application built with Node.js, Express, Sequelize (SQLite), and a responsive HTML/CSS/JS frontend. This project demonstrates robust backend features, secure authentication, and a polished, interactive frontend UI.

---

## Features

### Backend (Node.js, Express, Sequelize)
- **User Authentication:** JWT-based login, registration (customer only), and role-based access (customer/admin).
- **Admin Management:** Only admins can create other admins; public registration is customer-only.
- **Product Management:** Admins can add, edit, delete products (with image upload).
- **Product Listing:** Pagination, search, and filtering for all users.
- **Cart Management:** Add, update, and remove items from cart.
- **Order Management:** Place orders, view order history.
- **Validation & Error Handling:** Robust validation for stock, quantities, and user actions.
- **Password Reset:** Secure password reset flow.
- **Database:** SQLite with Sequelize ORM, supporting migrations and data preservation.

### Frontend (HTML, CSS, JS)
- **Modern UI:** Glassmorphism/neumorphism, responsive design, smooth transitions.
- **Product Browsing:** List, search, and filter products with images.
- **Cart & Orders:** Add to cart, view cart, checkout, and view order history.
- **Admin Dashboard:** Product management forms, user management (admin only).
- **Toasts & Modals:** For notifications, errors, and confirmations.
- **Empty States & Error UI:** User-friendly feedback for empty lists and errors.
- **API Integration:** Communicates with backend via RESTful endpoints.

---

## Project Structure

```
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
├── frontend/
│   ├── assets/
│   ├── css/
│   ├── js/
│   └── index.html
├── .gitignore
├── README.md
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm (comes with Node.js)

### Backend Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables (if needed):
   - Default uses SQLite; see `config/database.js` for DB config.
3. Run migrations and seed data (if applicable):
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```
4. Start the backend server:
   ```bash
   npm start
   ```
   - Server runs on `http://localhost:3000` by default.

### Frontend Setup
1. Open `frontend/index.html` in your browser, or serve with a static server:
   ```bash
   cd frontend
   npx serve .
   ```
2. Ensure `API_BASE` in frontend JS points to your backend server.

---

## Usage
- **Register/Login:** Customers can register and log in. Admins are created by other admins.
- **Browse Products:** All users can view, search, and filter products.
- **Cart & Orders:** Add products to cart, update quantities, and place orders.
- **Admin Actions:** Admins can manage products and users via the dashboard.

---

## Security & Best Practices
- Passwords are hashed and never stored in plain text.
- JWT tokens are used for authentication and authorization.
- Only admins can perform sensitive actions (e.g., product/user management).
- CORS and API base URL are properly configured for frontend-backend communication.

---

## Troubleshooting
- **Database Issues:** Use Sequelize migrations to update schema without losing data.
- **Frontend/Backend Errors:** Check browser console and backend logs for details.
- **Git Issues:** Ensure `.gitignore` excludes `node_modules` and sensitive files before pushing.

---

## License

This project is for educational purposes. Feel free to use, modify, and share.

---

## Author

- [kushyanthreddy19](https://github.com/kushyanthreddy19) 