// ================================================
// Reusable Results Count Component
// ================================================

interface ResultsCountProps {
    filtered: number;
    total: number;
    itemType?: string;
}

export function ResultsCount({ filtered, total, itemType = 'items' }: ResultsCountProps) {
    if (filtered === 0) return null;

    return (
        <div className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
            Showing {filtered} of {total} {itemType}
        </div>
    );
}
