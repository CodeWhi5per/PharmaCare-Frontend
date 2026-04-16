import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { dashboardAPI } from '../services/api';

interface Dataset { label: string; data: number[]; }
interface ChartData { labels: string[]; datasets: Dataset[]; }

const STROKE_COLORS = ['#2EBE76', '#3B82F6', '#A855F7'];

export default function ConsumptionChart() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardAPI.getConsumptionChart()
            .then((res) => setChartData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Build recharts-compatible row data: [{day:'Mon', Antibiotics:42, Analgesics:28, ...}]
    const rows = (chartData?.labels ?? []).map((label, i) => {
        const row: Record<string, string | number> = { day: label };
        chartData?.datasets.forEach(ds => { row[ds.label] = ds.data[i] ?? 0; });
        return row;
    });

    const categoryKeys = chartData?.datasets.map(ds => ds.label) ?? [];

    // Trend: compare first half vs second half of the week
    const first = chartData?.datasets[0];
    const half = Math.floor((first?.data.length ?? 0) / 2);
    const a = first?.data.slice(0, half).reduce((s, v) => s + v, 0) ?? 0;
    const b = first?.data.slice(half).reduce((s, v) => s + v, 0) ?? 0;
    const trendPct = a > 0 ? Math.round(((b - a) / a) * 100) : 0;
    const totalAll = chartData?.datasets.reduce(
        (sum, ds) => sum + ds.data.reduce((s, v) => s + v, 0), 0
    ) ?? 0;

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Consumption Trends</h2>
                    <p className="text-sm text-[#6C757D]">Daily medicine dispensing overview</p>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${trendPct >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                    {trendPct >= 0
                        ? <TrendingUp className="w-4 h-4 text-green-600" />
                        : <TrendingDown className="w-4 h-4 text-red-600" />}
                    <span className={`text-sm font-semibold ${trendPct >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {trendPct >= 0 ? '+' : ''}{trendPct}%
                    </span>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-56">
                    <Loader2 className="w-6 h-6 text-[#2EBE76] animate-spin" />
                </div>
            ) : rows.length === 0 ? (
                <div className="flex items-center justify-center h-56">
                    <p className="text-sm text-[#6C757D]">No consumption data available.</p>
                </div>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={rows} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                {categoryKeys.map((key, i) => (
                                    <linearGradient key={key} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%"  stopColor={STROKE_COLORS[i % STROKE_COLORS.length]} stopOpacity={0.25} />
                                        <stop offset="95%" stopColor={STROKE_COLORS[i % STROKE_COLORS.length]} stopOpacity={0} />
                                    </linearGradient>
                                ))}
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 11, fill: '#6C757D' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: '#6C757D' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                }}
                                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
                            />
                            {categoryKeys.length > 1 && (
                                <Legend
                                    wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
                                    iconType="circle"
                                    iconSize={8}
                                />
                            )}
                            {categoryKeys.map((key, i) => (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={STROKE_COLORS[i % STROKE_COLORS.length]}
                                    strokeWidth={2.5}
                                    fill={`url(#grad${i})`}
                                    dot={{ r: 3, fill: STROKE_COLORS[i % STROKE_COLORS.length], strokeWidth: 0 }}
                                    activeDot={{ r: 5, strokeWidth: 0 }}
                                />
                            ))}
                        </AreaChart>
                    </ResponsiveContainer>

                    <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-xs text-[#6C757D] font-secondary">Total dispensed this week</span>
                        <span className="text-sm font-bold text-[#1A1A1A]">{totalAll.toLocaleString()} units</span>
                    </div>
                </>
            )}
        </div>
    );
}
