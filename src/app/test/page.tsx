import { createClient } from '@/lib/supabase/server';

export default async function TestPage() {
    const supabase = await createClient();

    /* Test database connection */
    const { data, error } = await supabase
        .from('categories')
        .select('count');

    return (
        <div style={{ padding: '20px' }}>
            <h1>Tally Database Connection Test</h1>
            {error ? (
                <p style={{ color: 'red' }}>❌ Error: {error.message}</p>
            ) : (
                <p style={{ color: 'green' }}>✅ Database connected!</p>
            )}
        </div>
    );
}