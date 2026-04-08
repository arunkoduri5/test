const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, 'farm_app.db');
const db = new sqlite3.Database(dbPath);

const list = [
    { name: 'Power Tiller - Mahindra Yuvraj 215', price: 420, location: 'Village Tool Bank A' },
    { name: 'Power Tiller - VST Shakti 130 DI', price: 450, location: 'Village Tool Bank B' },
    { name: 'Power Tiller - KMW Mega T15', price: 400, location: 'Village Tool Bank C' },

    { name: 'Seed Drill - Dasmesh Multi-Crop SD100', price: 360, location: 'Village Tool Bank A' },
    { name: 'Seed Drill - Fieldking FKSD 9 Tyne', price: 340, location: 'Village Tool Bank B' },
    { name: 'Seed Drill - Landforce Smart Drill 11 Tyne', price: 380, location: 'Village Tool Bank C' },

    { name: 'Rotavator - Shaktiman Regular Plus', price: 520, location: 'Village Tool Bank A' },
    { name: 'Rotavator - Maschio Gaspardo W125', price: 560, location: 'Village Tool Bank B' },
    { name: 'Rotavator - Fieldking FKRTSG', price: 500, location: 'Village Tool Bank C' },

    { name: 'Cultivator - 9 Tyne Spring Loaded', price: 460, location: 'Village Tool Bank A' },
    { name: 'Cultivator - 11 Tyne Rigid', price: 470, location: 'Village Tool Bank B' },
    { name: 'Cultivator - Duckfoot Heavy Duty', price: 440, location: 'Village Tool Bank C' },

    { name: 'Disc Harrow - Mounted 12 Disc', price: 390, location: 'Village Tool Bank A' },
    { name: 'Disc Harrow - Trailed 16 Disc', price: 420, location: 'Village Tool Bank B' },
    { name: 'Disc Harrow - Offset 14 Disc', price: 410, location: 'Village Tool Bank C' },

    { name: 'Plough - MB Plough 2 Bottom', price: 260, location: 'Village Tool Bank A' },
    { name: 'Plough - Disc Plough 3 Disc', price: 300, location: 'Village Tool Bank B' },
    { name: 'Plough - Reversible MB Plough', price: 320, location: 'Village Tool Bank C' },

    { name: 'Paddy Transplanter - Kubota NSP-4W', price: 650, location: 'Village Tool Bank A' },
    { name: 'Paddy Transplanter - Yanmar AP4', price: 680, location: 'Village Tool Bank B' },
    { name: 'Paddy Transplanter - VST Walk Behind', price: 620, location: 'Village Tool Bank C' },

    { name: 'Reaper - Self Propelled 1.2m', price: 720, location: 'Village Tool Bank A' },
    { name: 'Reaper - Vertical Conveyor Type', price: 760, location: 'Village Tool Bank B' },
    { name: 'Reaper - Mini Reaper Deluxe', price: 700, location: 'Village Tool Bank C' },

    { name: 'Threshing Machine - Wheat Axial Flow', price: 860, location: 'Village Tool Bank A' },
    { name: 'Threshing Machine - Paddy Drum Type', price: 840, location: 'Village Tool Bank B' },
    { name: 'Threshing Machine - Multi-Crop Turbo', price: 900, location: 'Village Tool Bank C' }
];

console.log('Ensuring farm equipment variants exist...');
const stmt = db.prepare(`
    INSERT INTO equipment (name, type, price_per_hour, location, image_url)
    SELECT ?, 'equipment', ?, ?, 'images/equipment.png'
    WHERE NOT EXISTS (
        SELECT 1 FROM equipment WHERE type='equipment' AND name=?
    )
`);

list.forEach(eq => {
    stmt.run([eq.name, eq.price, eq.location, eq.name]);
});

stmt.finalize(() => {
    console.log('Farm equipment variants ensured successfully.');
    db.close();
});
