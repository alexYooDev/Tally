// ================================================
// Services Actions - Server-side operations
// ================================================
'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import type { 
    Database,
    ServiceRow,
    CategoryResult,
} from '@/types/supabase';
import { insertRecord, updateRecord } from '@/lib/utils';

/**
 * Get all services for the current user
 */


export async function getServices() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
        .from('services')
        .select(`
            *,
            categories!category_id(
                id,
                name
            )
        `)
        .eq('user_id', user.id)
        .order('name');
    
    if (error) {
        console.log('Error fetching services:', error);
        return { error: error.message || 'Error fetching services'};
    }

    // Type assertion and transformation
    const rawData = data as unknown as ServiceRow[];
    const transformedData = rawData?.map(service => {
        const categoryData = Array.isArray(service.categories)
            ? service.categories[0]
            : service.categories;

        return {
            id: service.id,
            user_id: service.user_id,
            name: service.name,
            default_price: service.default_price,
            description: service.description,
            category_id: service.category_id,
            category: categoryData
                ? { id: categoryData.id, name: categoryData.name }
                : null,
        };
    });

    return { data: transformedData };
};

/**
 * Get a single service by ID
 */
export async function getService(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
    return { error: 'Not authenticated' };
    }

    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
    console.error('Invalid service ID:', id);
    return { error: 'Invalid service ID' };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
    console.error('Invalid UUID format:', id);
    return { error: 'Invalid service ID format' };
    }

    const { data, error } = await supabase
        .from('services')
        .select(`
            *,
            categories!category_id (
                id,
                name
            )
        `)
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (error) {
        console.error('Error fetching service:', error);
        return { error: error.message };
    }

    if (!data) {
        return { error: 'Service not found' };
    }

    // Type assertion and transformation
    const rawData = data as unknown as ServiceRow;
    const categoryData = Array.isArray(rawData.categories)
        ? rawData.categories[0]
        : rawData.categories;

    const transformedData = {
        id: rawData.id,
        user_id: rawData.user_id,
        name: rawData.name,
        default_price: rawData.default_price,
        description: rawData.description,
        category_id: rawData.category_id,
        category: categoryData
            ? { id: categoryData.id, name: categoryData.name }
            : null,
    };

    return { data: transformedData };
}

/**
 * Get all categories for services
 */
export async function getServiceCategories() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
    return { error: 'Not authenticated' };
    }

    // Query categories table directly - don't involve services table
    const { data, error } = await supabase
    .from('categories')
    .select('id, name, type')
    .eq('user_id', user.id)
    .eq('type', 'service')
    .order('name');

    if (error) {
    console.error('Error fetching categories:', error);
    return { error: error.message };
    }

    return { data: data || [] };
    }

/**
 * Check how many services use a specific category
 */
export async function checkCategoryUsage(categoryId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { count, error } = await supabase
        .from('services')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error checking category usage:', error);
        return { error: error.message };
    }

    return { count: count || 0 };
}

/**
 * Delete a category by ID (with usage check)
 */
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
            error: `Cannot delete category: ${usageCheck.count} service(s) are using this category. Please reassign or delete those services first.`,
            count: usageCheck.count
        };
    }

    // Delete the category (only if not in use)
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)
        .eq('user_id', user.id)
        .eq('type', 'service');

    if (error) {
        console.error('Error deleting category:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/services');
    revalidatePath('/dashboard/services/new');
    return { success: true };
}

/**
 * Create or get a category by name
 */

async function getOrCreateCategory(name: string): Promise<{ data?: { id: string }; error?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    /* Try to find existing category */
    const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name)
        .eq('type', 'service')
        .single();

    if (existing) {
        return { data: existing as CategoryResult };
    }

    /* if none exists, create new  */
    const insertData: Database['public']['Tables']['categories']['Insert'] = {
        user_id: user.id,
        name,
        type: 'service',
    };

    const insertResult = await insertRecord(supabase, 'categories', insertData);
    
    if (insertResult.error) {
        console.error('Error creating category:', insertResult.error);
        return { error: insertResult.error.message };
    }

    // Fetch the created category to get its ID
    const { data, error } = await supabase
        .from('categories')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name)
        .eq('type', 'service')
        .single();

    if (error || !data) {
        console.error('Error fetching created category:', error);
        return { error: error?.message || 'Failed to fetch created category' };
    }

    return { data: data as CategoryResult };
};

/**
 * Create a new service
 */
export async function createService(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { error: 'Not authenticated' };
    }

    /* Get form data */
    const name = formData.get('name') as string;
    const categoryName = formData.get('category') as string;
    const priceStr = formData.get('default_price') as string;
    const description = formData.get('description') as string;

    /* Validate */
    if (!name || !priceStr) {
        return { error: 'Name and price are required' };
    }

    const price = parseFloat(priceStr);
    
    if (isNaN(price) || price < 0) {
        return { error: 'Price must be a valid positive number' };
    }

    /* Get or create category */
    
    let categoryId = null;

    if (categoryName && categoryName.trim()) {

        const categoryResult = await getOrCreateCategory(categoryName.trim());
        
        if (categoryResult.error) {
            return { error: categoryResult.error };
        }
        
        categoryId = categoryResult.data?.id;
    }

    /* Create service */
    const insertData: Database['public']['Tables']['services']['Insert'] = {
        user_id: user.id,
        name: name.trim(),
        category_id: categoryId ?? null,
        default_price: price,
        description: description?.trim() ?? null,
    };

    const { error } = await insertRecord(supabase, 'services', insertData);

    if (error) {
        console.error('Error creating service', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/services');
    return { success: true };
};

/**
 * Update an existing service
 */
export async function updateService(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    // Get form data
    const name = formData.get('name') as string;
    const categoryName = formData.get('category') as string;
    const priceStr = formData.get('default_price') as string;
    const description = formData.get('description') as string;

    // Validate
    if (!name || !priceStr) {
        return { error: 'Name and price are required' };
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
        return { error: 'Price must be a valid positive number' };
    }

    // Get or create category
    let categoryId = null;
    if (categoryName && categoryName.trim()) {
        const categoryResult = await getOrCreateCategory(categoryName.trim());
        if (categoryResult.error) {
        return { error: categoryResult.error };
        }
        categoryId = categoryResult.data?.id;
    }

    // Update service
    const updateData: Database['public']['Tables']['services']['Update'] = {
        name: name.trim(),
        category_id: categoryId ?? null,
        default_price: price,
        description: description?.trim() ?? null,
    };

    const { error } = await updateRecord(supabase, 'services', updateData, {
        id,
        user_id: user.id,
    });

    if (error) {
        console.error('Error updating service:', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/services');
    return { success: true };
}

/**
 * Delete a service
 */
export async function deleteService(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error deleting service', error);
        return { error: error.message };
    }

    revalidatePath('/dashboard/services');
    return { success: true };
}