const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, 'ecommerce.sqlite');
const db = new sqlite3.Database(dbPath);

const username = 'admin';
const password = 'admin123';
const role = 'admin';

async function seedAdmin() {
  const hashedPassword = await bcrypt.hash(password, 10);
  db.serialize(() => {
    db.run(
      `INSERT OR IGNORE INTO Users (username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, datetime('now'), datetime('now'))`,
      [username, hashedPassword, role],
      function (err) {
        if (err) {
          console.error('Error inserting admin user:', err.message);
        } else if (this.changes === 0) {
          console.log('Admin user already exists.');
        } else {
          console.log('Admin user seeded successfully!');
        }
        db.close();
      }
    );
  });
}

seedAdmin(); 