// ================================================
// Income Actions - Server-side operations
// ================================================
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type {
    Database,
    IncomeTransactionRow,
    IncomeTransactionWithService,
} from '@/types/supabase';
import type { PaymentMethod } from '@/types/database';
import { insertRecord, updateRecord } from '@/lib/utils';

/**
 * Get all income transactions for the current user
 */
export async function getIncomeTransactions() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
        .from('income_transactions')
        .select(`
            *,
            services!service_id(
                id,
                name,
                default_price,
                categories!category_id(
                    id,
                    name
                )
            )
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

    if (error) {
        console.error('Error fetching income transactions:', error);
        return { error: error.message || 'Error fetching income transactions' };
    }

    // Type assertion and transformation
    const rawData = data as unknown as IncomeTransactionRow[];
    const transformedData = rawData?.map(transaction => {
        const serviceData = Array.isArray(transaction.services)
            ? transaction.services[0]
            : transaction.services;

        // Extract category data from the nested structure
        const categoryData = serviceData?.categories
            ? (Array.isArray(serviceData.categories) ? serviceData.categories[0] : serviceData.categories)
            : null;

        return {
            id: transaction.id,
            user_id: transaction.user_id,
            date: transaction.date,
            client_name: transaction.client_name,
            service_id: transaction.service_id,
            price: transaction.price,
            discount: transaction.discount,
            total_received: transaction.total_received,
            payment_method: transaction.payment_method,
            notes: transaction.notes,
            service: serviceData
                ? {
                    id: serviceData.id,
                    name: serviceData.name,
                    default_price: serviceData.default_price,
                    category: categoryData ? { id: categoryData.id, name: categoryData.name } : null
                }
                : null,
        };
    });

    return { data: transformedData };
}

/**
 * Get a single income transaction by ID
 */
export async function getIncomeTransaction(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
        console.error('Invalid income transaction ID:', id);
        return { error: 'Invalid transaction ID' };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
        console.error('Invalid UUID format:', id);
        return { error: 'Invalid transaction ID format' };
    }

    const { data, error } = await supabase
        .from('income_transactions')
        .select(`
            *,
            services!service_id(
                id,
                name,
                default_price,
                categories!category_id(
                    id,
                    name
                )
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching income transaction:', error);
        return { error: error.message };
    }

    if (!data) {
        return { error: 'Transaction not found' };
    }

    // Type assertion and transformation
    const rawData = data as unknown as IncomeTransactionRow;
    const serviceData = Array.isArray(rawData.services)
        ? rawData.services[0]
        : rawData.services;

    // Extract category data from the nested structure
    const categoryData = serviceData?.categories
        ? (Array.isArray(serviceData.categories) ? serviceData.categories[0] : serviceData.categories)
        : null;

    const transformedData: IncomeTransactionWithService = {
        id: rawData.id,
        user_id: rawData.user_id,
        date: rawData.date,
        client_name: rawData.client_name,
        service_id: rawData.service_id,
        price: rawData.price,
        discount: rawData.discount,
        total_received: rawData.total_received,
        payment_method: rawData.payment_method,
        notes: rawData.notes,
        service: serviceData
            ? {
                id: serviceData.id,
                name: serviceData.name,
                default_price: serviceData.default_price,
                category: categoryData ? { id: categoryData.id, name: categoryData.name } : null
            }
            : null,
    };

    return { data: transformedData };
}

/**
 * Get all services for dropdown (from services management)
 */
export async function getServicesForDropdown() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
        .from('services')
        .select('id, name, default_price')
        .eq('user_id', user.id)
        .order('name');

    if (error) {
        console.error('Error fetching services:', error);
        return { error: error.message };
    }

    return { data: data || [] };
}

/**
 * Create a new income transaction
 */
export async function createIncomeTransaction(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    // Get form data
    const date = formData.get('date') as string;
    const clientName = formData.get('client_name') as string;
    const serviceId = formData.get('service_id') as string;
    const priceStr = formData.get('price') as string;
    const discountStr = formData.get('discount') as string;
    const paymentMethod = formData.get('payment_method') as string;
    const notes = formData.get('notes') as string;

    // Validate required fields
    if (!date || !priceStr || !paymentMethod) {
        return { success: false, error: 'Date, price, and payment method are required' };
    }

    const price = parseFloat(priceStr);
    const discount = discountStr ? parseFloat(discountStr) : 0;

    if (isNaN(price) || price < 0) {
        return { success: false, error: 'Price must be a valid positive number' };
    }

    if (isNaN(discount) || discount < 0) {
        return { success: false, error: 'Discount must be a valid positive number' };
    }

    if (discount > price) {
        return { success: false, error: 'Discount cannot be greater than price' };
    }

    // Calculate total received
    const totalReceived = price - discount;

    // Create income transaction
    const insertData: Database['public']['Tables']['income_transactions']['Insert'] = {
        user_id: user.id,
        date,
        client_name: clientName?.trim() || null,
        service_id: serviceId || null,
        price,
        discount,
        total_received: totalReceived,
        payment_method: paymentMethod as PaymentMethod,
        notes: notes?.trim() || null,
    };

    const { error } = await insertRecord(supabase, 'income_transactions', insertData);

    if (error) {
        console.error('Error creating income transaction:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/income');
    return { success: true, message: 'Income transaction created successfully' };
}

/**
 * Update an existing income transaction
 */
export async function updateIncomeTransaction(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    // Get form data
    const date = formData.get('date') as string;
    const clientName = formData.get('client_name') as string;
    const serviceId = formData.get('service_id') as string;
    const priceStr = formData.get('price') as string;
    const discountStr = formData.get('discount') as string;
    const paymentMethod = formData.get('payment_method') as string;
    const notes = formData.get('notes') as string;

    // Validate required fields
    if (!date || !priceStr || !paymentMethod) {
        return { success: false, error: 'Date, price, and payment method are required' };
    }

    const price = parseFloat(priceStr);
    const discount = discountStr ? parseFloat(discountStr) : 0;

    if (isNaN(price) || price < 0) {
        return { success: false, error: 'Price must be a valid positive number' };
    }

    if (isNaN(discount) || discount < 0) {
        return { success: false, error: 'Discount must be a valid positive number' };
    }

    if (discount > price) {
        return { success: false, error: 'Discount cannot be greater than price' };
    }

    // Calculate total received
    const totalReceived = price - discount;

    // Update income transaction
    const updateData: Database['public']['Tables']['income_transactions']['Update'] = {
        date,
        client_name: clientName?.trim() || null,
        service_id: serviceId || null,
        price,
        discount,
        total_received: totalReceived,
        payment_method: paymentMethod as PaymentMethod,
        notes: notes?.trim() || null,
    };

    const { error } = await updateRecord(supabase, 'income_transactions', updateData, {
        id,
        user_id: user.id,
    });

    if (error) {
        console.error('Error updating income transaction:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/income');
    return { success: true, message: 'Income transaction updated successfully' };
}

/**
 * Delete an income transaction
 */
export async function deleteIncomeTransaction(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('income_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting income transaction:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/income');
    return { success: true, message: 'Income transaction deleted successfully' };
}
