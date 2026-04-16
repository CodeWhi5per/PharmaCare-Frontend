/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { TrendingUp, Download, Calendar } from 'lucide-react';
import { analyticsAPI } from '../services/api';

export default function Analytics() {
    const [topMedicines, setTopMedicines] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [heatmap, setHeatmap] = useState<any[]>([]);
    const [revenue, setRevenue] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [topRes, predRes, heatRes, revRes] = await Promise.all([
                    analyticsAPI.getTopMedicines(),
                    analyticsAPI.getDemandForecast(),
                    analyticsAPI.getUsageHeatmap(),
                    analyticsAPI.getRevenue(),
                ]);
                setTopMedicines(topRes.data);
                setPredictions(predRes.data);
                setHeatmap(heatRes.data);
                setRevenue(revRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const riskStyles: Record<string, string> = {
        low: 'bg-green-50 text-green-600 border-green-200',
        high: 'bg-orange-50 text-orange-600 border-orange-200',
        critical: 'bg-red-50 text-red-600 border-red-200',
    };

    const barColors = [
        'from-[#2EBE76] to-[#21D6C3]',
        'from-blue-500 to-blue-600',
        'from-purple-500 to-purple-600',
        'from-orange-500 to-orange-600',
        'from-red-500 to-red-600',
    ];

    const maxDispensed = topMedicines[0]?.dispensed || 1;

    const heatColors = ['bg-gray-100', 'bg-[#21D6C3]/30', 'bg-[#2EBE76]/60', 'bg-[#0BAF8C]'];

    const getHeatColor = (count: number) => {
        if (count === 0) return heatColors[0];
        if (count <= 2) return heatColors[1];
        if (count <= 5) return heatColors[2];
        return heatColors[3];
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Predictive Analytics & Reports</h1>
                    <p className="text-[#6C757D] font-secondary">AI-powered insights and demand forecasting</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-medium text-[#1A1A1A] hover:border-[#2EBE76] transition-all">
                        <Calendar className="w-5 h-5" />Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        <Download className="w-5 h-5" />Export Report
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-[#6C757D]">Loading analytics...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Consumption Trends</h2>
                                    <p className="text-sm text-[#6C757D] font-secondary">Top medicines by daily consumption</p>
                                </div>
                                <TrendingUp className="w-5 h-5 text-[#2EBE76]" />
                            </div>
                            <div className="space-y-4">
                                {topMedicines.map((med, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-[#1A1A1A]">{med.name}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#1A1A1A]">{med.dispensed}</span>
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${med.trend?.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{med.trend}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div className={`bg-gradient-to-r ${barColors[i % barColors.length]} h-full rounded-full transition-all duration-500`} style={{ width: `${(med.dispensed / maxDispensed) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                                {topMedicines.length === 0 && <p className="text-sm text-[#6C757D] text-center py-4">No consumption data yet</p>}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <div className="mb-6">
                                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Demand Forecast</h2>
                                <p className="text-sm text-[#6C757D]">Predicted stock depletion timeline</p>
                            </div>
                            <div className="space-y-4">
                                {predictions.map((pred, i) => (
                                    <div key={i} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className="font-semibold text-[#1A1A1A] mb-1">{pred.medicine}</p>
                                                <p className="text-sm text-[#6C757D]">Predicted stockout: {pred.stockoutDate}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${riskStyles[pred.risk] || riskStyles.low}`}>{pred.risk?.toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-[#6C757D]">Confidence:</span>
                                            <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                                <div className="bg-gradient-to-r from-[#2EBE76] to-[#21D6C3] h-full rounded-full" style={{ width: `${pred.confidence}%` }}></div>
                                            </div>
                                            <span className="text-xs font-semibold text-[#1A1A1A]">{pred.confidence}%</span>
                                        </div>
                                    </div>
                                ))}
                                {predictions.length === 0 && <p className="text-sm text-[#6C757D] text-center py-4">No forecast data yet</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6">Usage Heatmap (Last 28 days)</h2>
                        <div className="grid grid-cols-7 gap-2">
                            {heatmap.map((day, i) => (
                                <div key={i} className={`aspect-square rounded-lg ${getHeatColor(day.count)} hover:scale-110 transition-transform cursor-pointer`} title={`${day.date}: ${day.count} activities`}></div>
                            ))}
                            {heatmap.length === 0 && Array.from({ length: 28 }).map((_, i) => (
                                <div key={i} className="aspect-square rounded-lg bg-gray-100"></div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 text-xs text-[#6C757D]">
                            <span>Less Activity</span>
                            <div className="flex gap-1">
                                {heatColors.map((c, i) => <div key={i} className={`w-4 h-4 rounded ${c}`}></div>)}
                            </div>
                            <span>More Activity</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-2xl p-6 text-white">
                            <p className="text-white/80 text-sm mb-2">Total Inventory Value</p>
                            <p className="text-4xl font-bold mb-2">${revenue.totalRevenue?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || '0'}</p>
                            <p className="text-sm text-white/90">Based on current stock</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                            <p className="text-white/80 text-sm mb-2">Avg. Daily Dispensing</p>
                            <p className="text-4xl font-bold mb-2">{revenue.avgDailyDispensing || 0}</p>
                            <p className="text-sm text-white/90">Units per day</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                            <p className="text-white/80 text-sm mb-2">Inventory Turnover</p>
                            <p className="text-4xl font-bold mb-2">{revenue.inventoryTurnover || '0'}x</p>
                            <p className="text-sm text-white/90">Optimal range</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
