// ================================================
// Reusable No Results Message Component
// ================================================

interface NoResultsProps {
    message?: string;
    icon?: string;
}

export function NoResults({ message = 'No results found', icon }: NoResultsProps) {
    return (
        <div className='text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700'>
            {icon && <div className='text-4xl mb-2'>{icon}</div>}
            <p className='text-gray-500 dark:text-gray-400'>{message}</p>
        </div>
    );
}
