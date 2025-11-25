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
                Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at' >>; 
            }
            income_transactions: {
                Row: IncomeTransaction;
                Insert: Omit<IncomeTransaction, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>;
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
