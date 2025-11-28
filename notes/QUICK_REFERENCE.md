# 🎴 TALLY V2 - QUICK REFERENCE CARD

One-page project summary for quick reference.

---

## 📌 PROJECT AT A GLANCE

**Name**: Tally V2
**Type**: Cross-platform accounting app
**Target**: Small/independent business owners
**Status**: 🟢 Day 2 Complete (50%)
**Timeline**: 3-4 weeks (Started Nov 26, 2024)
**Tech**: Next.js 16, Supabase, PostgreSQL, TypeScript

---

## 🎯 CORE FEATURES

```
✅ Services Management    (100%) - Day 2
🔄 Income Logging         (0%)   - Day 3 NEXT
🔜 Spending Tracking      (0%)   - Day 4
🔜 Dashboard Analytics    (0%)   - Day 5
🔜 Polish & Testing       (0%)   - Day 6
🚀 Deployment            (0%)   - Day 7
```

---

## 📊 PROGRESS

```
Time:     12h / ~25h (48%)
Features: 2/6 complete
Code:     50% complete
Status:   On track
```

---

## 🗂️ KEY FILES

### Services (Complete)
```
src/app/dashboard/services/
├── page.tsx              # List
├── actions.ts            # CRUD
├── service-form.tsx      # Form
├── new/page.tsx          # Add
└── [id]/edit/page.tsx    # Edit
```

### Income (Next)
```
src/app/dashboard/income/
├── page.tsx              # To create
├── actions.ts            # To create
├── income-form.tsx       # To create
└── new/page.tsx          # To create
```

---

## 🗄️ DATABASE

### Ready
- ✅ services (complete)
- ✅ categories (complete)
- ✅ income_transactions (schema ready)
- ✅ spending_transactions (schema ready)

### Tables
```sql
services (id, user_id, name, category_id, price, description)
categories (id, user_id, name, type)
income_transactions (id, user_id, date, service_id, price, discount, total, payment_method)
spending_transactions (id, user_id, date, description, category, amount)
```

---

## 🚀 NEXT SESSION

**Goal**: Income Logging (2-3 hours)

**Tasks**:
1. [ ] Income list page (30 min)
2. [ ] Income form (45 min)
3. [ ] Server actions (30 min)
4. [ ] Edit/delete (30 min)
5. [ ] Testing (15 min)

**Prep**:
- Review services code
- Prepare test data
- Check schema

---

## 📋 QUICK COMMANDS

```bash
# Dev
npm run dev

# Build
npm run build

# Types
npm run type-check

# Database
# Run in Supabase SQL Editor
```

---

## 🔗 IMPORTANT LINKS

**Supabase**: [Project Dashboard](https://supabase.com/dashboard)
**Vercel**: TBD (Day 7)
**Repo**: [Your GitHub Repo]

---

## 👤 PERSONAS

**Sarah** - Lash Technician
- Services: Classic/Volume Full Set, Fills, Removal
- Prices: $30-$200
- Needs: Track income, manage services, see profit

---

## 🎯 SUCCESS CRITERIA

- [ ] Can add service < 1 min
- [ ] Can log income < 30 sec
- [ ] Dashboard loads < 2 sec
- [ ] Mobile responsive
- [ ] No data loss
- [ ] No critical bugs

---

## 📝 TODAY'S FOCUS

**Date**: [Current Date]
**Day**: Day X
**Feature**: [Current Feature]
**Status**: [In Progress/Complete]

**Top Priority**:
1. [Task 1]
2. [Task 2]
3. [Task 3]

**Blockers**: None

---

## 🏆 WINS

- ✅ Day 1: Foundation complete
- ✅ Day 2: Services complete
- 🔄 Day 3: Income logging (next)

---

## 💡 REMEMBER

- Use JavaScript joins (more reliable)
- Validate UUIDs before queries
- Test mobile responsiveness
- Document as you go
- Commit frequently

---

**Last Updated**: 2024-11-28
**Next Milestone**: Income Logging Complete
**Days to Launch**: 5 days remaining
