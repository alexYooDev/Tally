// ================================================
// Reusable Filter Tabs Component
// ================================================
'use client';

export interface FilterTab {
    label: string;
    value: string;
    count?: number;
    color?: 'indigo' | 'green' | 'red' | 'blue' | 'gray';
}

interface FilterTabsProps<T extends string> {
    tabs: FilterTab[];
    activeTab: T;
    onTabChange: (tab: T) => void;
}

const colorClasses = {
    indigo: {
        active: 'text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
    },
    green: {
        active: 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
    },
    red: {
        active: 'text-red-600 dark:text-red-400 border-red-600 dark:border-red-400',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
    },
    blue: {
        active: 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
    },
    gray: {
        active: 'text-gray-900 dark:text-gray-100 border-gray-900 dark:border-gray-100',
        inactive: 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
    },
};

export function FilterTabs<T extends string>({ tabs, activeTab, onTabChange }: FilterTabsProps<T>) {
    return (
        <div className='flex gap-2 border-b border-gray-200 dark:border-gray-700'>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                const colors = colorClasses[tab.color || 'indigo'];
                const colorClass = isActive ? colors.active : colors.inactive;

                return (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value as T)}
                        className={`px-4 py-2 font-medium text-sm transition cursor-pointer ${colorClass} ${
                            isActive ? 'border-b-2' : ''
                        }`}
                    >
                        {tab.label}
                        {tab.count !== undefined && ` (${tab.count})`}
                    </button>
                );
            })}
        </div>
    );
}
