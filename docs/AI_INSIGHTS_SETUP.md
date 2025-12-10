# AI Insights - Environment Setup

## Quick Start (Development Mode - FREE)

By default, AI Insights uses **mock data** - no API keys needed! This is perfect for:
- UI development and testing
- Learning the feature
- Demoing to users

Just start your dev server and visit `/dashboard/insights`.

---

## Production Mode (Real OpenAI)

To enable real AI-powered insights:

### 1. Get OpenAI API Key
Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys) and create an API key.

### 2. Add to `.env.local`

```env
# Enable Real AI
USE_REAL_AI=true

# OpenAI Configuration
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-3.5-turbo  # or gpt-4-turbo for better quality
```

### 3. Run Database Migration

Execute the migration file in Supabase SQL Editor:
```
supabase/migrations/create_ai_insight_generations.sql
```

This creates the `ai_insight_generations` table for rate limiting.

---

## Cost Estimates

### Mock Mode (Default)
- **Cost:** $0 (completely free)
- **API Calls:** None
- **Quality:** Realistic sample insights based on your data

### Real Mode with GPT-3.5-turbo (Recommended)
- **Cost per insight:** ~$0.001-0.003
- **Monthly (10 generations):** ~$0.03
- **Monthly (100 generations):** ~$0.30

### Real Mode with GPT-4-turbo (Higher Quality)
- **Cost per insight:** ~$0.02-0.05
- **Monthly (10 generations):** ~$0.50
- **Monthly (100 generations):** ~$5.00

---

## Rate Limiting

Production mode includes automatic rate limiting:
- **Limit:** 10 insight generations per day per user
- **Purpose:** Prevent excessive API costs
- **Bypass:** Disabled in mock mode

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `USE_REAL_AI` | No | `false` | Enable OpenAI API (`true` or `false`) |
| `OPENAI_API_KEY` | Only if `USE_REAL_AI=true` | - | Your OpenAI API key |
| `OPENAI_MODEL` | No | `gpt-3.5-turbo` | Model to use |

---

## Switching Between Modes

### Development → Production
1. Set `USE_REAL_AI=true` in `.env.local`
2. Add `OPENAI_API_KEY`
3. Run database migration
4. Restart dev server

### Production → Development
1. Set `USE_REAL_AI=false` or remove it
2. Restart dev server

---

## Troubleshooting

**"OpenAI API key not configured"**
- Make sure `.env.local` exists with `OPENAI_API_KEY`
- Restart your dev server after adding variables

**Rate limit errors in development**
- Check that `USE_REAL_AI` is not set to `true`
- Mock mode has no rate limits

**Database errors**
- Run the migration file in Supabase SQL Editor
- Check that RLS policies are enabled
