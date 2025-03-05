-- Seed data for premium_positions
-- This will mark some positions as unavailable to simulate a realistic environment

-- Mark some Top 10 positions as taken
UPDATE premium_positions
SET is_available = FALSE
WHERE tier = 'top10' AND position IN (2, 5, 7, 9);

-- Mark some Top 50 positions as taken
UPDATE premium_positions
SET is_available = FALSE
WHERE tier = 'top50' AND position IN (11, 13, 17, 22, 28, 35, 42);
