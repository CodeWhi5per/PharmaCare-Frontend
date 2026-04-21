import { useState, useEffect } from 'react';
import { Activity, Loader2, AlertTriangle } from 'lucide-react';
import { dashboardAPI } from '../services/api';

interface Prediction {
    name: string;
    currentStock: number;
    daysLeft: number;
    predictedStockout: string;
    consumptionRate: number;
}

export default function StockPredictionChart() {
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardAPI.getStockPrediction()
            .then((res) => setPredictions(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Stock Predictions</h2>
                    <p className="text-sm text-[#6C757D]">depletion forecasts</p>
                </div>
                <Activity className="w-5 h-5 text-[#2EBE76]" />
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#2EBE76] animate-spin" />
                </div>
            ) : predictions.length === 0 ? (
                <p className="text-sm text-[#6C757D] text-center py-6">No stock prediction data available.</p>
            ) : (
                <div className="space-y-4">
                    {predictions.map((item, index) => {
                        // Show remaining stock as % of a reasonable max (currentStock before depletion)
                        const maxEstimate = item.currentStock + item.consumptionRate * item.daysLeft;
                        const percentage = maxEstimate > 0
                            ? Math.min(100, Math.round((item.currentStock / maxEstimate) * 100))
                            : 0;
                        const isCritical = item.daysLeft <= 7;
                        const isLow = item.daysLeft <= 14;

                        return (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {isCritical && <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />}
                                        <span className="text-sm font-medium text-[#1A1A1A] truncate">{item.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                        <span className="text-xs text-[#6C757D]">
                                            Stockout: {item.predictedStockout}
                                        </span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${
                                            isCritical ? 'bg-red-50 text-red-600' :
                                            isLow      ? 'bg-orange-50 text-orange-600' :
                                                         'bg-green-50 text-green-600'
                                        }`}>
                                            ~{item.daysLeft}d
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-[#F7FDFC] rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                isCritical ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                                                isLow      ? 'bg-gradient-to-r from-orange-400 to-yellow-400' :
                                                             'bg-gradient-to-r from-[#2EBE76] to-[#21D6C3]'
                                            }`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-[#6C757D] min-w-[90px] text-right">
                                        {item.currentStock} units left
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
