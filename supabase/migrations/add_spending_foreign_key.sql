-- Add foreign key relationship for spending_transactions.category_id -> categories.id
-- This enables the join query: categories!category_id(id, name)

-- First, check if the foreign key already exists and drop it if needed
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE constraint_name = 'spending_transactions_category_id_fkey'
    ) THEN
        ALTER TABLE spending_transactions DROP CONSTRAINT spending_transactions_category_id_fkey;
    END IF;
END $$;

-- Add the foreign key constraint
-- ON DELETE SET NULL means if a category is deleted, set category_id to NULL in spending transactions
ALTER TABLE spending_transactions
ADD CONSTRAINT spending_transactions_category_id_fkey
FOREIGN KEY (category_id)
REFERENCES categories(id)
ON DELETE SET NULL;

-- Create an index on category_id for better query performance
CREATE INDEX IF NOT EXISTS idx_spending_transactions_category_id
ON spending_transactions(category_id);

-- Verify the constraint was created
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name='spending_transactions'
    AND kcu.column_name='category_id';
