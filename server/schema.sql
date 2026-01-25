-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    operator_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    time_completed VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on score for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);

-- Optional: Insert some initial mock data
INSERT INTO leaderboard (operator_name, score, time_completed) VALUES
('PHANTOM_ZERO', 9850, '45s'),
('CYBER_GHOST', 9720, '52s'),
('NET_SHADOW', 9580, '58s');
