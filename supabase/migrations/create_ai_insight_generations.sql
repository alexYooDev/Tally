-- ================================================
-- AI Insights Rate Limiting Table
-- ================================================
-- Tracks AI insight generation events for rate limiting

CREATE TABLE IF NOT EXISTS ai_insight_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Index for efficient rate limit queries
    CONSTRAINT ai_insight_generations_user_id_created_at_idx 
        UNIQUE (user_id, created_at)
);

-- Index for querying by user and time range
CREATE INDEX IF NOT EXISTS idx_ai_insight_generations_user_time 
    ON ai_insight_generations(user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE ai_insight_generations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own generation records
CREATE POLICY "Users can view own generations"
    ON ai_insight_generations
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own generation records
CREATE POLICY "Users can insert own generations"
    ON ai_insight_generations
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Cleanup old records (older than 30 days) - Optional
-- Run this periodically via cron job or manually
-- DELETE FROM ai_insight_generations 
-- WHERE created_at < NOW() - INTERVAL '30 days';
