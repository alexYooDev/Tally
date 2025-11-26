// ================================================
// Services Actions - Server-side operations
// ================================================
'use server';

import { revalidatePath } from 'next/cache';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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
            category:category_id(
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

    return { data };
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

    const { data, error } = await supabase
        .from('services')
        .select(`
            *,
            category:category_id (
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

    return { data };
};

/**
 * Get all categories for services
 */

export async function getServiceCategories() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        return { error: 'Not authenticated' };
    }

    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'service')
        .order('name');

    if (error) {
        console.error('Error fetching service categories:', error);
        return { error: error.message };
    }

    return { data: data || [] };
};

/**
 * Create or get a category by name
 */

async function getOrCreateCategory(name: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'Not authenticated' };
    }

    /* Try to find existing category */
    const { data: existing } = await supabase
        .from('services')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', name)
        .eq('type', 'service')
        .single();

    if (existing) {
        return { data: existing };
    }

    /* if none exists, create new  */
    const { data, error } = await supabase
        .from('categories')
        .insert({
        user_id: user.id,
        name,
        type: 'service',
        })
        .select('id')
        .single();

    if (error) {
        console.error('Error creating category:', error);
        return { error: error.message };
    }

    return { data };
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

    const { error } = await supabase
        .from('services')
        .insert({
            user_id: user.id,
            name: name.trim(),
            category_id: categoryId,
            default_price: price,
            description: description.trim() || null,
        });

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

    const name = formData.get('name') as string;
    const categoryName = formData.get('category') as string;
    const priceStr = formData.get('default_price') as string;
    const description = formData.get('description') as string;

    /* Get form data */
    if (!name || !priceStr) {
        return { error: 'Name and price are required' };
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
        return { error: 'Price must be a valid positive number' };
    }

    let categoryId = null;
    if (categoryName && categoryName.trim()) {
        const categoryResult = await getOrCreateCategory(categoryName.trim());
        
        if (categoryResult.error) {
            return { error: categoryResult.error };
        }
        
        categoryId = categoryResult.data?.id;
    }

    /* Update service */
    const { error } = await supabase
        .from('services')
        .update({
            name: name.trim(),
            category_id: categoryId,
            default_price: price,
            description: description.trim() || null,
        })
        .eq('id', id)
        .eq('user_id', user.id);

    if (error) {
        console.error('Error updating service', error);
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