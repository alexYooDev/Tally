// ================================================
// Dashboard Cash Flow API Route
// ================================================

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { jsonResponse, errorResponse, withAuth, handleSupabaseError } from '@/lib/api-helpers';

/**
 * GET /api/dashboard/cash-flow
 * Get combined income and spending transactions for cash flow analysis
 */
export async function GET(request: NextRequest) {
    return withAuth(request, async (_, userId) => {
        try {
            const supabase = await createClient();

            // Fetch income transactions
            const { data: incomeData, error: incomeError } = await supabase
                .from('income')
                .select(`
                    *,
                    service:services (
                        id,
                        name,
                        category:categories (
                            id,
                            name
                        )
                    )
                `)
                .eq('user_id', userId);

            if (incomeError) {
                return handleSupabaseError(incomeError);
            }

            // Fetch spending transactions
            const { data: spendingData, error: spendingError } = await supabase
                .from('spending')
                .select(`
                    *,
                    category:categories (
                        id,
                        name
                    )
                `)
                .eq('user_id', userId);

            if (spendingError) {
                return handleSupabaseError(spendingError);
            }

            // Transform income transactions
            const incomeTransactions = (incomeData || []).map((t: any) => ({
                id: t.id,
                date: t.date,
                description: t.service?.name || t.client_name || 'Income',
                amount: t.total_received,
                type: 'income' as const,
                payment_method: t.payment_method,
                category: t.service?.category?.name,
                notes: t.notes,
            }));

            // Transform spending transactions
            const spendingTransactions = (spendingData || []).map((t: any) => ({
                id: t.id,
                date: t.date,
                description: t.description,
                amount: t.amount,
                type: 'spending' as const,
                payment_method: t.payment_method,
                category: t.category?.name,
                notes: t.notes,
            }));

            // Combine and sort by date (newest first)
            const allTransactions = [...incomeTransactions, ...spendingTransactions].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return jsonResponse({ data: allTransactions }, 200);
        } catch (error: any) {
            console.error('Get cash flow error:', error);
            return errorResponse('Failed to fetch cash flow data', 500, error.message);
        }
    });
}
