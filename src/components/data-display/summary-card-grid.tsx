// ================================================
// Reusable Summary Card Grid Component
// ================================================

interface SummaryCardGridProps {
    children: React.ReactNode;
    columns?: 2 | 3 | 4;
}

export function SummaryCardGrid({ children, columns = 3 }: SummaryCardGridProps) {
    const gridCols = {
        2: 'grid-cols-2 md:grid-cols-2',
        3: 'grid-cols-3 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-4',
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-2 md:gap-4 mb-6`}>
            {children}
        </div>
    );
}
