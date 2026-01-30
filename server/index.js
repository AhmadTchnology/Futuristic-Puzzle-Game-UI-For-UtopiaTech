const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get leaderboard
app.get('/api/leaderboard', async (req, res) => {
    try {
        // Sort by duration_seconds ASC (lowest time is best)
        const result = await db.query('SELECT * FROM leaderboard ORDER BY duration_seconds ASC LIMIT 100');
        // Map database columns to frontend interface if needed, or just return as is
        // Frontend expects: rank, operatorName, timeCompleted
        // DB has: id, operator_name, score, time_completed, duration_seconds, created_at

        const formattedData = result.rows.map((row, index) => ({
            rank: index + 1,
            operatorName: row.operator_name,
            // Score removed
            timeCompleted: row.time_completed
        }));

        res.json(formattedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Submit score
app.post('/api/leaderboard', async (req, res) => {
    const { operatorName, timeCompleted, durationSeconds } = req.body;

    if (!operatorName || !timeCompleted) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Score removed from schema
        const result = await db.query(
            'INSERT INTO leaderboard (operator_name, time_completed, duration_seconds) VALUES ($1, $2, $3) RETURNING *',
            [operatorName, timeCompleted, durationSeconds]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
