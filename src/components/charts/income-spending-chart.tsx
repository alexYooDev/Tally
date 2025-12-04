// ================================================
// Income vs Spending Chart - Area Chart
// ================================================
'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DailyData } from '@/lib/analytics';
import { formatCurrency } from '@/lib/utils';

interface IncomeSpendingChartProps {
    data: DailyData[];
}

export function IncomeSpendingChart({ data }: IncomeSpendingChartProps) {
    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const date = new Date(label);
            const formattedDate = date.toLocaleDateString('en-AU', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });

            return (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                        {formattedDate}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {entry.name}: <span className="font-semibold">{formatCurrency(entry.value)}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Format X-axis date labels
    const formatXAxis = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' });
    };

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No data available for this time period
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
            <AreaChart data={data} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis
                    dataKey="date"
                    tickFormatter={formatXAxis}
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    interval="preserveStartEnd"
                />
                <YAxis
                    tickFormatter={(value) => `$${value}`}
                    className="text-xs text-gray-600 dark:text-gray-400"
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    width={45}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                    iconType="circle"
                />
                <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#colorIncome)"
                />
                <Area
                    type="monotone"
                    dataKey="spending"
                    name="Spending"
                    stroke="#ef4444"
                    strokeWidth={2}
                    fill="url(#colorSpending)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
