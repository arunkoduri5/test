const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static frontend files from current directory
app.use(express.static(__dirname));

// API: Auth Login
app.post('/api/auth/login', (req, res) => {
    const { mobile_number, name, location } = req.body;
    if (!mobile_number) return res.status(400).json({ error: 'Mobile number is required' });

    db.get('SELECT id, mobile_number, name, location FROM users WHERE mobile_number = ?', [mobile_number], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (row) {
            // Update name and location if requested again
            db.run('UPDATE users SET name = COALESCE(?, name), location = COALESCE(?, location) WHERE id = ?', [name, location, row.id], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, user: { id: row.id, mobile_number, name: name || row.name, location: location || row.location } });
            });
        } else {
            db.run('INSERT INTO users (mobile_number, name, location) VALUES (?, ?, ?)', [mobile_number, name, location], function(err) {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ success: true, user: { id: this.lastID, mobile_number, name, location } });
            });
        }
    });
});

// API: Get Equipment by category
app.get('/api/equipment', (req, res) => {
    const { category } = req.query;
    let query = 'SELECT * FROM equipment';
    let params = [];
    
    if (category) {
        query += ' WHERE type = ?';
        params.push(category);
    }
    
    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Create Booking
app.post('/api/bookings', (req, res) => {
    const { user_id, equipment_id, acres, required_date } = req.body;
    
    if (!user_id || !equipment_id || !required_date) {
        return res.status(400).json({ error: 'Missing required booking fields' });
    }

    const stmt = db.prepare(`INSERT INTO bookings (user_id, equipment_id, acres, required_date) VALUES (?, ?, ?, ?)`);
    stmt.run([user_id, equipment_id, acres || null, required_date], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, booking_id: this.lastID });
    });
    stmt.finalize();
});

// API: Get User's Bookings
app.get('/api/bookings/:userId', (req, res) => {
    const { userId } = req.params;
    
    const query = `
        SELECT b.id, b.status, b.required_date, b.acres, e.name as machine, e.price_per_hour as rate 
        FROM bookings b 
        JOIN equipment e ON b.equipment_id = e.id 
        WHERE b.user_id = ? 
        ORDER BY b.created_at DESC
    `;
    
    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
