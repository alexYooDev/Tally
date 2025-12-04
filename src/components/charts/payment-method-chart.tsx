// ================================================
// Payment Method Distribution Chart - Donut Chart
// ================================================
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { PaymentMethodData } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';

interface PaymentMethodChartProps {
    data: PaymentMethodData[];
}

// Color palette for payment methods
const COLORS = [
    '#10b981', // emerald (cash)
    '#3b82f6', // blue (card)
    '#8b5cf6', // violet (bank transfer)
    '#f59e0b', // amber (paypal)
    '#6b7280', // gray (other)
];

export function PaymentMethodChart({ data }: PaymentMethodChartProps) {
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
    const renderLabel = (entry: PaymentMethodData) => {
        return `${entry.percentage.toFixed(0)}%`;
    };

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No payment method data available
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
                    innerRadius={45}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
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
