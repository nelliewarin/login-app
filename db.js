const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        answered 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
});

module.exports = db;
