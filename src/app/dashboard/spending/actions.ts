// ================================================
// Spending Actions - Server-side operations
// ================================================
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import type { PaymentMethod } from '@/types/database';
import { insertRecord, updateRecord } from '@/lib/utils';

/* Spending transaction row as returned from Supabase with categories join */

export type SpendingTransactionRow = {
    id: string;
    user_id: string;
    date: string;
    description: string;
    category_id: string | null;
    amount: number;
    payment_method: string;
    notes: string | null;
    categories: { id: string, name: string } | { id: string, name: string }[] | null;
};

/* Spending transaction with transformed category field */
export type SpendingTransactionWithCategory = {
    id: string;
    user_id: string;
    date: string;
    description: string;
    category_id: string | null;
    amount: number;
    payment_method: string;
    notes: string | null;
    category: { id: string; name: string } | null;
};

/* Category with minimal fields (for description) */
export type CategoryMinimal = {
    id: string;
    name: string;
};

/* Get all spending transactions for the current user */
export async function getSpendingTransactions() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
        .from('spending_transactions')
        .select(`
            *,
            categories!category_id(
                id,
                name
            )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false});

        if (error) {
            console.error('Error fetching spending transactions:', error);
            return { error: error.message || 'Error fetching spending transactions'};
        }

        // Type assertion and transformation
        const rawData = data as unknown as SpendingTransactionRow[];
        const transformedData = rawData?.map(transaction => {
            const categoryData = Array.isArray(transaction.categories)
                ? transaction.categories[0]
                : transaction.categories;
            return {
                id: transaction.id,
                user_id: transaction.user_id,
                date: transaction.date,
                description: transaction.description,
                category_id: transaction.category_id,
                amount: transaction.amount,
                payment_method: transaction.payment_method,
                notes: transaction.notes,
                category: categoryData ? { id: categoryData.id, name: categoryData.name } : null,
            };
        });

        return { data: transformedData };
}

/* Get a single spending transaction by ID */
export async function getSpendingTransaction(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
        console.error('Invalid spending transaction ID:', id);
        return { error: 'Invalid transaction ID' };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        console.error('Invalid UUID format:', id);
        return { error: 'Invalid transaction ID format' };
    } 

    const { data, error } = await supabase
        .from('spending_transactions')
        .select(`
            *,
            categories!category_id(
                id,
                name
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();
    
    if (error) {
        console.error('Error fetching spending transaction:', error);
        return { error: error.message ||'Error fetching spending transaction' };
    }

    if (!data) {
        return { error: 'Transaction not found' };
    }

    // Type assertion and transformation
    const rawData = data as unknown as SpendingTransactionRow;
    const categoryData = Array.isArray(rawData.categories)
        ? rawData.categories[0]
        : rawData.categories;

    const transformedData: SpendingTransactionWithCategory = {
        id: rawData.id,
        user_id: rawData.user_id,
        date: rawData.date,
        description: rawData.description,
        category_id: rawData.category_id,
        amount: rawData.amount,
        payment_method: rawData.payment_method,
        notes: rawData.notes,
        category: categoryData
            ? { id: categoryData.id, name: categoryData.name }
            : null,
    };

    return { data: transformedData };
}

/* Get all spending categories for dropdown */
export async function getSpendingCategories () {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
        .from('categories')
        .select('id, name, type')
        .eq('user_id', user.id)
        .eq('type', 'spending')
        .order('name');

    if (error) {
        console.error('Error fetching spending categories:', error);
        return { error: error.message || 'Error fetching spending categories' };
    }

    return { data: data || [] };
}

/* Check how many spending transactions use a specific category */
export async function checkCategoryUsage(categoryId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { count, error } = await supabase
        .from('spending_transactions')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error checking category usage:', error);
        return { error: error.message };
    }

    return { count: count || 0 };
}

/* Delete a category by ID (with usage check) */
export async function deleteCategory(categoryId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(categoryId)) {
        return { error: 'Invalid category ID format' };
    }

    // Check if category is in use
    const usageCheck = await checkCategoryUsage(categoryId);
    if (usageCheck.error) {
        return { error: usageCheck.error };
    }

    if (usageCheck.count && usageCheck.count > 0) {
        return {
            error: `Cannot delete category: ${usageCheck.count} spending transaction(s) are using this category. Please reassign or delete those transactions first.`,
            count: usageCheck.count
        };
    }

    // Delete the category (only if not in use)
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user.id)
        .eq('type', 'spending');

    if (error) {
        console.error('Error deleting category:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/spending');
    revalidatePath('/dashboard/spending/new');
    return { success: true };
}

/* Create or Get a spending category by name */
export async function getOrCreateCategoryByName(name: string): Promise<{ data?: { id: string }; error?: string}> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Try to find exisiting category
    const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name)
        .eq('type', 'spending')
        .single();

    if (existing) {
        return { data: existing }; 
    }

    // create a category by name
    const insertData: Database['public']['Tables']['categories']['Insert'] = {
        user_id: user.id,
        name,
        type: 'spending'
    };

    const insertResult = await insertRecord(supabase, 'categories', insertData);

    if (insertResult.error) {
        console.error('Error creating category:', insertResult.error);
        return { error: insertResult.error.message || 'Error creating category' };
    }

    // Fetch the created category to get its ID
    const { data, error } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name)
        .eq('type', 'spending')
        .single();

    if (error || !data) {
        console.error('Error fetching created categories:', error);
        return { error: error.message || 'Error fetching created categories' };
    }

    return { data };
}

/* Create a new spending transaction */
export async function createSpendingTransaction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Get form data
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const categoryName = formData.get('category') as string;
    const amountStr = formData.get('amount') as string;
    const paymentMethod = formData.get('payment_method') as string;
    const notes = formData.get('notes') as string;

    // Validate required fields
    if (!date || !description || !amountStr || !paymentMethod) {
        return { error: 'Date, description, amount, and payment method are required' };
    }

    const amount = parseFloat(amountStr);

    if (isNaN(amount) || amount < 0) {
        return { error: 'Amount must be a valid postive number' };
    }

    // Get or create category
    let categoryId = null;
    if (categoryName && categoryName.trim()) {
        const categoryResult = await getOrCreateCategoryByName(categoryName.trim());
        
        if (categoryResult.error) {
            return { error: categoryResult.error };
        }

        categoryId = categoryResult.data?.id;
    }

    // Create spending transaction
    const insertData: Database['public']['Tables']['spending_transactions']['Insert'] = {
        user_id: user.id,
        date,
        description: description.trim(),
        category_id: categoryId ?? null,
        amount,
        payment_method: paymentMethod as PaymentMethod,
        notes: notes?.trim() || null
    };

    const { error } = await insertRecord(supabase, 'spending_transactions', insertData);

    if (error) {
        console.error('Error creating spending transaction:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/spending');
    return { success: true };
}

/* Update an existing spending transaction */
export async function updateSpendingTransaction(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Get form data
    const date = formData.get('date') as string;
    const description = formData.get('description') as string;
    const categoryName = formData.get('category') as string;
    const amountStr = formData.get('amount') as string;
    const paymentMethod = formData.get('payment_method') as string;
    const notes = formData.get('notes') as string;

    // Validate required fields
    if (!date || !description || !amountStr || !paymentMethod) {
        return { error: 'Date, description, amount, and payment method are required' };
    }

    const amount = parseFloat(amountStr);

    if(isNaN(amount) || amount < 0) {
        return { error: 'amount must be a valid positive number' };
    }

    // Get or create category
    let categoryId = null;
    if (categoryName && categoryName.trim()) {
        const categoryResult = await getOrCreateCategoryByName(categoryName);
        if (categoryResult.error) {
            return { error: categoryResult.error };
        }
        categoryId = categoryResult.data?.id;
    }

    // Update spending transaction
    const updateData: Database['public']['Tables']['spending_transactions']['Update'] = {
        date,
        description: description.trim(),
        category_id: categoryId ?? null,
        amount,
        payment_method: paymentMethod as PaymentMethod,
        notes: notes?.trim() || null,
    };

    const { error } = await updateRecord(supabase, 'spending_transactions', updateData, {
        id,
        user_id: user.id
    });

    if (error) {
        console.error('Error updating spending transaction:', error);
        return { error: error.message || 'Error updating spending transaction' };
    }

    revalidatePath('/dashboard/spending');
    return { success: true };
}

/* Delete a spending transaction */
export async function deleteSpendingTransaction(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('spending_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
    
    if (error) {
        console.error('Error deleting spending transaction:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/spending');
    return { success: true };
}
