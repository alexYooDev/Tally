# Fixing Supabase Type Errors

## Issue

The build is failing with TypeScript errors for Supabase `.insert()` and `.update()` operations:

```
Argument of type '{ user_id: string; ... }' is not assignable to parameter of type 'never'.
```

## Root Cause

The Supabase generated types in `src/types/supabase.ts` appear to have strict type inference that's causing parameters to infer as `never`. This typically happens when:

1. Supabase types are out of sync with database schema
2. Type generation configuration needs adjustment
3. Database schema changes haven't been reflected in types

## Solution

### Option 1: Regenerate Supabase Types (Recommended)

```bash
# If you have Supabase CLI installed and linked to your project:
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

# Or if you have a local database:
npx supabase gen types typescript --local > src/types/supabase.ts
```

### Option 2: Add explicit type casts

In each file, cast the insert/update parameters:

```typescript
import type { Database } from '@/types/supabase';

// For insert
.insert({
    user_id: userId,
    // ...other fields
} as Database['public']['Tables']['income']['Insert'])

// For update  
.update({
    // ...fields
} as Database['public']['Tables']['income']['Update'])
```

### Option 3: Use @ts-expect-error (Temporary)

Add comment before problematic lines (build may fail with "unused" error if types actually work):

```typescript
// @ts-expect-error - Temporary: Supabase type generation issue
const { data, error } = await supabase.from('income').insert(...)
```

## Affected Files

- `src/app/api/income/route.ts` - line 97 (insert)
- `src/app/api/income/[id]/route.ts` - line 98 (update)
- `src/app/api/spending/route.ts` - likely similar issues
- `src/app/api/spending/categories/route.ts` - likely similar issues
- `src/app/api/services/route.ts` - likely similar issues
- `src/app/api/services/categories/route.ts` - likely similar issues

## Recommended Action

**Regenerate Supabase types** as this is the cleanest solution and ensures types match your current database schema.

```bash
cd /Users/alexyoodev/2025/sem-break/side-project/tally-app
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
npm run build
```

If you don't have access to regenerate types, I can add the explicit type casts to all affected files.
