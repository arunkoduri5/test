const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'farm_app.db');
const db = new sqlite3.Database(dbPath);

const list = [
    {name: "Power Tiller", price: 400},
    {name: "Seed Drill", price: 300},
    {name: "Rotavator", price: 500},
    {name: "Cultivator", price: 450},
    {name: "Disc Harrow", price: 350},
    {name: "Plough", price: 200},
    {name: "Paddy Transplanter", price: 600},
    {name: "Reaper", price: 700},
    {name: "Threshing Machine", price: 800}
];

db.get('SELECT COUNT(*) as c FROM equipment WHERE type="equipment"', (err, row) => {
    if(row && row.c === 0) {
        console.log("Seeding farm equipment items...");
        const stmt = db.prepare(`INSERT INTO equipment (name, type, price_per_hour, location, image_url) VALUES (?, ?, ?, ?, ?)`);
        list.forEach(eq => {
            stmt.run([eq.name, 'equipment', eq.price, 'Village Tool Bank', 'images/equipment.png']);
        });
        stmt.finalize(() => {
            console.log("Added new equipment successfully");
            db.close();
        });
    } else {
        console.log("Equipment already exists in DB");
        db.close();
    }
});
