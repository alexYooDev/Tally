// ================================================
// Category Breakdown Chart - Pie Chart
// ================================================
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { CategoryData } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';

interface CategoryBreakdownChartProps {
    data: CategoryData[];
}

// Color palette for categories
const COLORS = [
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#3b82f6', // blue
    '#ef4444', // red
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#a855f7', // purple
];

export function CategoryBreakdownChart({ data }: CategoryBreakdownChartProps) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const entry = payload[0];
            return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {entry.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Amount: <span className="font-semibold">{formatCurrency(entry.value)}</span>
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Percentage: <span className="font-semibold">{entry.payload.percentage.toFixed(1)}%</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom label renderer
    const renderLabel = (entry: CategoryData) => {
        return `${entry.percentage.toFixed(0)}%`;
    };

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No category data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '11px' }}
                    formatter={(value, entry: any) => (
                        <span className="text-[10px] sm:text-xs text-gray-700 dark:text-gray-300">
                            {value} ({formatCurrency(entry.payload.value)})
                        </span>
                    )}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
