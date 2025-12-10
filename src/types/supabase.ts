// ================================================
// TALLY - Supabase Database Types
// ================================================

// Auto-generated types from Supabase database
// 
// TO REGENERATE TYPES:
// 1. Ensure you're logged in: npx supabase login
// 2. Link to project: npx supabase link --project-ref YOUR_PROJECT_ID
// 3. Generate types: npx supabase gen types typescript --linked > src/types/supabase.generated.ts

/**
 * Export the auto-generated Database type from Supabase
 * This ensures types are always in sync with the actual database schema
 */
export type { Database } from './supabase.generated';

// ================================================
// Supabase Response Types
// ================================================

/**
 * Category with minimal fields (id and name only)
 */
export type CategoryMinimal = {
    id: string;
    name: string;
};

/**
 * Service row as returned from Supabase with categories join
 */
export type ServiceRow = {
    id: string;
    user_id: string;
    name: string;
    default_price: number;
    description: string | null;
    category_id: string | null;
    categories: CategoryMinimal | CategoryMinimal[] | null;
};

/**
 * Service with transformed category field (single object instead of join)
 */
export type ServiceWithCategory = {
    id: string;
    user_id: string;
    name: string;
    default_price: number;
    description: string | null;
    category_id: string | null;
    category: CategoryMinimal | null;
};

/**
 * Service with minimal fields (for dropdowns and references)
 */
export type ServiceMinimal = {
    id: string;
    name: string;
    default_price: number;
    categories?: CategoryMinimal | CategoryMinimal[] | null; // From Supabase join
    category?: { id: string, name: string } | null; // Transformed field
};

/**
 * Income transaction row as returned from Supabase with services join
 */
export type IncomeTransactionRow = {
    id: string;
    user_id: string;
    date: string;
    client_name: string | null;
    service_id: string | null;
    price: number;
    discount: number;
    total_received: number;
    payment_method: string;
    notes: string | null;
    services: ServiceMinimal | ServiceMinimal[] | null;
};

/**
 * Income transaction with transformed service field (single object instead of join)
 */
export type IncomeTransactionWithService = {
    id: string;
    user_id: string;
    date: string;
    client_name: string | null;
    service_id: string | null;
    price: number;
    discount: number;
    total_received: number;
    payment_method: string;
    notes: string | null;
    service: ServiceMinimal | null;
};

/**
 * Category result with just the ID (used for create/get operations)
 */
export type CategoryResult = {
    id: string;
};

/**
 * Generic action result type for server actions
 */
export type ActionResult<T = void> = {
    data?: T;
    error?: string;
    success?: boolean;
};

// ================================================
// Supabase Helper Types
// ================================================

/**
 * Type representing a Supabase client instance
 */
export type SupabaseClient = any; // Will be properly typed when createClient is available
