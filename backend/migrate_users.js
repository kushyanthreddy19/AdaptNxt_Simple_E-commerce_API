const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ecommerce.sqlite');
const db = new sqlite3.Database(dbPath);

async function migrateUsers() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run('PRAGMA foreign_keys=OFF;');
      db.run('BEGIN TRANSACTION;');
      // 1. Create new Users table with timestamps
      db.run(`CREATE TABLE IF NOT EXISTS Users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL DEFAULT 'customer',
        createdAt DATETIME NOT NULL DEFAULT (datetime('now')),
        updatedAt DATETIME NOT NULL DEFAULT (datetime('now'))
      );`);
      // 2. Copy data (set createdAt/updatedAt to now)
      db.run(`INSERT INTO Users_new (id, username, password, role, createdAt, updatedAt)
        SELECT id, username, password, role, datetime('now'), datetime('now') FROM Users;`);
      // 3. Drop old Users table
      db.run('DROP TABLE Users;');
      // 4. Rename new table
      db.run('ALTER TABLE Users_new RENAME TO Users;');
      db.run('COMMIT;', (err) => {
        db.run('PRAGMA foreign_keys=ON;');
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

migrateUsers()
  .then(() => {
    console.log('Users table migrated successfully!');
    db.close();
  })
  .catch((err) => {
    console.error('Migration failed:', err);
    db.close();
  });