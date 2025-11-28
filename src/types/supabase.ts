// ================================================
// TALLY - Supabase Database Types
// ================================================

// Generated types for type-safe database access
// 
// TO GENERATE ACTUAL TYPES:
// 1. Install Supabase CLI: npm install -g supabase
// 2. Login: supabase login
// 3. Generate types: supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
//
// For now, using manual type definitions from database.ts

import type {
    Category,
    Service,
    IncomeTransaction,
    SpendingTransaction,
} from './database';

/**
 * Supabase Database schema type
 * This provides type safety for all database operations
 */

export type Database = {
    public: {
        Tables: {
            categories: {
                Row: Category;
                Insert: Omit<Category, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at'>>;

            };
            services: {
                Row: Service;
                Insert: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'is_active'>;
                Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;
            }
            income_transactions: {
                Row: IncomeTransaction;
                Insert: Omit<IncomeTransaction, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<IncomeTransaction, 'id' | 'created_at' | 'updated_at' | 'user_id'>>;
            };
            spending_transactions: {
                Row: SpendingTransaction;
                Insert: Omit<SpendingTransaction, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<SpendingTransaction, 'id' | 'created_at' | 'updated_at'>>;
            }
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
};

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
