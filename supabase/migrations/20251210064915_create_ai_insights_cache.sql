-- ================================================
-- AI Insights Cache Table
-- ================================================
-- Stores generated AI insights to reduce API calls and improve performance
-- Insights expire after 24 hours and can be manually regenerated

CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    insights JSONB NOT NULL,           -- The full InsightsResponse object
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- One cache entry per user (upsert will replace old cache)
    CONSTRAINT unique_user_insights UNIQUE (user_id)
);

-- Index for efficient queries by user and expiration
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_expiry 
    ON ai_insights(user_id, expires_at);

-- Enable Row Level Security
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own cached insights
CREATE POLICY "Users can view own insights"
    ON ai_insights
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own cached insights
CREATE POLICY "Users can insert own insights"
    ON ai_insights
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own cached insights
CREATE POLICY "Users can update own insights"
    ON ai_insights
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own cached insights
CREATE POLICY "Users can delete own insights"
    ON ai_insights
    FOR DELETE
    USING (auth.uid() = user_id);

-- Optional: Function to auto-delete expired insights (run via cron)
-- DELETE FROM ai_insights WHERE expires_at < NOW();
