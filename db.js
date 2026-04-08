const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'farm_app.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.serialize(() => {
        // 1. Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            mobile_number TEXT UNIQUE NOT NULL,
            name TEXT,
            location TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS equipment (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            price_per_hour REAL NOT NULL,
            location TEXT,
            image_url TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            equipment_id INTEGER NOT NULL,
            acres REAL,
            required_date TEXT NOT NULL,
            status TEXT DEFAULT 'Confirmed',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (equipment_id) REFERENCES equipment (id)
        )`);

        // Seed equipment table if empty
        db.get("SELECT COUNT(*) as count FROM equipment", (err, row) => {
            if (!err && row.count === 0) {
                const equipmentList = [
                    { name: 'Mahindra Tractor', type: 'tractor', price: 800, loc: 'Village A', img: 'images/tractor.png' },
                    { name: 'Sonalika Tractor', type: 'tractor', price: 750, loc: 'Village B', img: 'images/tractor.png' },
                    { name: 'Wheat Harvester', type: 'harvester', price: 1500, loc: 'Village C', img: 'images/harvester.png' },
                    { name: 'Rice Harvester', type: 'harvester', price: 1400, loc: 'Village D', img: 'images/harvester.png' },
                    { name: 'Sugarcane Cutter 1', type: 'sugarcane', price: 2000, loc: 'Village E', img: 'images/sugarcane.png' },
                    { name: 'Sugarcane Cutter 2', type: 'sugarcane', price: 2100, loc: 'Village F', img: 'images/sugarcane.png' },
                    { name: 'JCB Loader', type: 'jcb', price: 1800, loc: 'Village G', img: 'images/jcb.png' },
                    { name: 'JCB Excavator', type: 'jcb', price: 1700, loc: 'Village H', img: 'images/jcb.png' },
                    { name: 'Agricopter AG 365', type: 'drone', price: 2500, loc: 'Nearby Village', img: 'images/drone.png' },
                    { name: 'STIHL SR430', type: 'sprayer', price: 500, loc: 'Village Equipment Center', img: 'images/sprayer.png' } // mapping mapping sprayer to manualspray
                ];

                const stmt = db.prepare(`INSERT INTO equipment (name, type, price_per_hour, location, image_url) VALUES (?, ?, ?, ?, ?)`);
                equipmentList.forEach(eq => {
                    stmt.run([eq.name, eq.type, eq.price, eq.loc, eq.img]);
                });
                stmt.finalize();
                console.log('Seeded database with initial equipment.');
            }
        });
    });
}

module.exports = db;
