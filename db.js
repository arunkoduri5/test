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
            booking_category TEXT,
            booking_target TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (equipment_id) REFERENCES equipment (id)
        )`);

        // Backward-compatible schema upgrade for existing DBs.
        db.run(`ALTER TABLE bookings ADD COLUMN booking_category TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
                console.error('Error adding booking_category column:', err.message);
            }
        });
        db.run(`ALTER TABLE bookings ADD COLUMN booking_target TEXT`, (err) => {
            if (err && !err.message.includes('duplicate column name')) {
                console.error('Error adding booking_target column:', err.message);
            }
        });

        // Seed equipment table if empty
        db.get("SELECT COUNT(*) as count FROM equipment", (err, row) => {
            if (!err && row.count === 0) {
                const equipmentList = [
                    { name: 'Mahindra Tractor', type: 'tractor', price: 800, loc: 'Village A', img: 'images/tractor.png' },
                    { name: 'Sonalika Tractor', type: 'tractor', price: 750, loc: 'Village B', img: 'images/tractor.png' },
                    { name: '4x4 Harvester', type: 'harvester', price: 1500, loc: 'Village C', img: 'images/harvester.png' },
                    { name: 'Track Harvester', type: 'harvester', price: 1400, loc: 'Village D', img: 'images/harvester.png' },
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

        // Ensure Farm Equipment & Machinery has 2-3 options for every target (idempotent).
        const farmEquipmentVariants = [
            { name: 'Power Tiller - Mahindra Yuvraj 215', type: 'equipment', price: 420, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Power Tiller - VST Shakti 130 DI', type: 'equipment', price: 450, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Power Tiller - KMW Mega T15', type: 'equipment', price: 400, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Seed Drill - Dasmesh Multi-Crop SD100', type: 'equipment', price: 360, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Seed Drill - Fieldking FKSD 9 Tyne', type: 'equipment', price: 340, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Seed Drill - Landforce Smart Drill 11 Tyne', type: 'equipment', price: 380, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Rotavator - Shaktiman Regular Plus', type: 'equipment', price: 520, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Rotavator - Maschio Gaspardo W125', type: 'equipment', price: 560, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Rotavator - Fieldking FKRTSG', type: 'equipment', price: 500, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Cultivator - 9 Tyne Spring Loaded', type: 'equipment', price: 460, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Cultivator - 11 Tyne Rigid', type: 'equipment', price: 470, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Cultivator - Duckfoot Heavy Duty', type: 'equipment', price: 440, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Disc Harrow - Mounted 12 Disc', type: 'equipment', price: 390, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Disc Harrow - Trailed 16 Disc', type: 'equipment', price: 420, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Disc Harrow - Offset 14 Disc', type: 'equipment', price: 410, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Plough - MB Plough 2 Bottom', type: 'equipment', price: 260, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Plough - Disc Plough 3 Disc', type: 'equipment', price: 300, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Plough - Reversible MB Plough', type: 'equipment', price: 320, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Paddy Transplanter - Kubota NSP-4W', type: 'equipment', price: 650, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Paddy Transplanter - Yanmar AP4', type: 'equipment', price: 680, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Paddy Transplanter - VST Walk Behind', type: 'equipment', price: 620, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Reaper - Self Propelled 1.2m', type: 'equipment', price: 720, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Reaper - Vertical Conveyor Type', type: 'equipment', price: 760, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Reaper - Mini Reaper Deluxe', type: 'equipment', price: 700, loc: 'Village Tool Bank C', img: 'images/equipment.png' },

            { name: 'Threshing Machine - Wheat Axial Flow', type: 'equipment', price: 860, loc: 'Village Tool Bank A', img: 'images/equipment.png' },
            { name: 'Threshing Machine - Paddy Drum Type', type: 'equipment', price: 840, loc: 'Village Tool Bank B', img: 'images/equipment.png' },
            { name: 'Threshing Machine - Multi-Crop Turbo', type: 'equipment', price: 900, loc: 'Village Tool Bank C', img: 'images/equipment.png' }
        ];

        const ensureStmt = db.prepare(`
            INSERT INTO equipment (name, type, price_per_hour, location, image_url)
            SELECT ?, ?, ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1 FROM equipment WHERE type = ? AND name = ?
            )
        `);

        farmEquipmentVariants.forEach(eq => {
            ensureStmt.run([eq.name, eq.type, eq.price, eq.loc, eq.img, eq.type, eq.name]);
        });
        ensureStmt.finalize(() => {
            console.log('Ensured farm equipment variants are present.');
        });

        // Normalize legacy harvester labels and ensure expected variants exist.
        db.run(`UPDATE equipment SET name = '4x4 Harvester' WHERE type = 'harvester' AND LOWER(name) = 'rice harvester'`);
        db.run(`UPDATE equipment SET name = 'Track Harvester' WHERE type = 'harvester' AND LOWER(name) = 'wheat harvester'`);

        const ensureHarvesterStmt = db.prepare(`
            INSERT INTO equipment (name, type, price_per_hour, location, image_url)
            SELECT ?, 'harvester', ?, ?, ?
            WHERE NOT EXISTS (
                SELECT 1 FROM equipment WHERE type = 'harvester' AND LOWER(name) = LOWER(?)
            )
        `);
        ensureHarvesterStmt.run(['4x4 Harvester', 1500, 'Village C', 'images/harvester.png', '4x4 Harvester']);
        ensureHarvesterStmt.run(['Track Harvester', 1400, 'Village D', 'images/harvester.png', 'Track Harvester']);
        ensureHarvesterStmt.finalize();
    });
}

module.exports = db;
