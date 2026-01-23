const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data/users.db');
console.log("Checking DB at:", dbPath);

try {
    const db = new Database(dbPath, { readonly: true });
    const columns = db.prepare("PRAGMA table_info(users)").all();
    console.log("Columns:", columns.map(c => c.name));
} catch (err) {
    console.error("Error:", err);
}
