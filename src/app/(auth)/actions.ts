'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

/**
 * Sign up a new user
 */
export async function signup(formData: FormData) {
    const supabase = await createClient();

    /* Get form data */
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    /* Validate */
    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    if (password !== confirmPassword) {
        return { error: 'Password do not match' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters long' };
    }

    /* Create User */
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth//callback`,
        },
    });

    /* Handle errors */
    if (error) {
        return { error: error.message };   
    }

    /* Check if email confirmation is required */
    if (data.user && !data.session) {
        return {
            success: true,
            message: 'Check your email to confirm your account!'
        };
    }   

    /* Success - revalidate and return success */
    revalidatePath('/', 'layout');
    return { success: true };
}

/**
 * Sign in an existing user
 */
export async function login(formData: FormData) {
    const supabase = await createClient();

    /* Get form data */
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    /* Validate */
    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.error('Login error:', error);
        return { error: error.message || 'Invalid email and password' };
    }

    /* Success - revalidate and return success */
    revalidatePath('/', 'layout');
    return { success: true };
}

/**
 * Sign out the current user
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}

/**
 * Request password reset
 */

export async function resetPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;

    if (!email) {
        return { error: 'Email is required' };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return {
        success: true,
        message: 'Check your email for the password reset link!'
    }
}