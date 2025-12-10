# Commit Message

```
feat: add interactive insight details modal with action steps

- Create reusable Modal component with animations and accessibility
- Add actionSteps field to Insight type for detailed guidelines  
- Update OpenAI prompt to generate 3-5 actionable steps per insight
- Make insight cards clickable to display modal with step-by-step guidance
- Fix Supabase Json type conversion in insight-cache.ts

Closes #[issue-number]
```

---

# Alternative (Conventional Commits Format)

```
feat(insights): add interactive modal with detailed action steps

BREAKING CHANGE: None

Features:
- Reusable Modal component with ESC/backdrop/X close options
- Insight cards show detailed guidelines on click
- AI generates 3-5 actionable steps per insight
- Dark mode support and smooth animations

Fixes:
- Type casting for Supabase Json to InsightsResponse
```

---

# Short Version (if needed)

```
feat: add modal with detailed guidelines for AI insights
```
