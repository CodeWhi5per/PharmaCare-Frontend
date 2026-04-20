/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { TrendingUp, Download, Calendar } from 'lucide-react';
import { analyticsAPI } from '../services/api';

export default function Analytics() {
    const [topMedicines, setTopMedicines] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30');
    const [showDateMenu, setShowDateMenu] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [topRes, predRes] = await Promise.all([
                    analyticsAPI.getTopMedicines(),
                    analyticsAPI.getDemandForecast(),
                ]);
                setTopMedicines(topRes.data);
                setPredictions(predRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [dateRange]);

    const handleExportReport = () => {
        try {
            // Create CSV content
            let csvContent = "PharmaCare Analytics Report\n\n";
            csvContent += `Date Range: Last ${dateRange} Days\n`;
            csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;

            // Consumption Trends Section
            csvContent += "CONSUMPTION TRENDS\n";
            csvContent += "Medicine,Dispensed,Trend\n";
            topMedicines.forEach(med => {
                csvContent += `${med.name},${med.dispensed},${med.trend || 'N/A'}\n`;
            });

            csvContent += "\n\nDEMAND FORECAST\n";
            csvContent += "Medicine,Stockout Date,Risk Level,Confidence\n";
            predictions.forEach(pred => {
                csvContent += `${pred.medicine},${pred.stockoutDate},${pred.risk},${pred.confidence}%\n`;
            });

            // Create blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `analytics_report_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Show success message
            alert('Report exported successfully!');
        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to export report. Please try again.');
        }
    };

    const handleDateRangeChange = (range: string) => {
        setDateRange(range);
        setShowDateMenu(false);
    };

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


    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Predictive Analytics & Reports</h1>
                    <p className="text-[#6C757D] font-secondary">AI-powered insights and demand forecasting</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <button
                            onClick={() => setShowDateMenu(!showDateMenu)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-medium text-[#1A1A1A] hover:border-[#2EBE76] transition-all"
                        >
                            <Calendar className="w-5 h-5" />
                            Last {dateRange} Days
                        </button>
                        {showDateMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-10">
                                <button
                                    onClick={() => handleDateRangeChange('7')}
                                    className="w-full px-4 py-2 text-left hover:bg-[#F7FDFC] transition-colors text-sm font-medium text-[#1A1A1A]"
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    onClick={() => handleDateRangeChange('30')}
                                    className="w-full px-4 py-2 text-left hover:bg-[#F7FDFC] transition-colors text-sm font-medium text-[#1A1A1A]"
                                >
                                    Last 30 Days
                                </button>
                                <button
                                    onClick={() => handleDateRangeChange('90')}
                                    className="w-full px-4 py-2 text-left hover:bg-[#F7FDFC] transition-colors text-sm font-medium text-[#1A1A1A]"
                                >
                                    Last 90 Days
                                </button>
                                <button
                                    onClick={() => handleDateRangeChange('365')}
                                    className="w-full px-4 py-2 text-left hover:bg-[#F7FDFC] transition-colors text-sm font-medium text-[#1A1A1A]"
                                >
                                    Last Year
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleExportReport}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                        <Download className="w-5 h-5" />
                        Export Report
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
                </>
            )}
        </div>
    );
}
