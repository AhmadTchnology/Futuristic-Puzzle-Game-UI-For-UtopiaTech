-- Create the leaderboard table
CREATE TABLE IF NOT EXISTS leaderboard (
    id SERIAL PRIMARY KEY,
    operator_name VARCHAR(50) NOT NULL,
    score INTEGER NOT NULL,
    time_completed VARCHAR(20) NOT NULL,
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on score for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_duration ON leaderboard(duration_seconds ASC);

-- Optional: Insert some initial mock data
INSERT INTO leaderboard (operator_name, score, time_completed, duration_seconds) VALUES
('PHANTOM_ZERO', 9955, '45s', 45),
('CYBER_GHOST', 9948, '52s', 52),
('NET_SHADOW', 9942, '58s', 58);
