import { TrendingUp, Download, Calendar } from 'lucide-react';

export default function Analytics() {
    const topMedicines = [
        { name: 'Paracetamol 500mg', dispensed: 1847, trend: '+12%', color: 'from-[#2EBE76] to-[#21D6C3]' },
        { name: 'Ibuprofen 400mg', dispensed: 1523, trend: '+8%', color: 'from-blue-500 to-blue-600' },
        { name: 'Aspirin 75mg', dispensed: 1298, trend: '+15%', color: 'from-purple-500 to-purple-600' },
        { name: 'Metformin 850mg', dispensed: 1156, trend: '+5%', color: 'from-orange-500 to-orange-600' },
        { name: 'Amoxicillin 500mg', dispensed: 987, trend: '-3%', color: 'from-red-500 to-red-600' },
    ];

    const predictions = [
        { medicine: 'Paracetamol 500mg', stockoutDate: 'Feb 28, 2025', confidence: 95, risk: 'low' },
        { medicine: 'Ibuprofen 400mg', stockoutDate: 'Feb 22, 2025', confidence: 92, risk: 'high' },
        { medicine: 'Aspirin 75mg', stockoutDate: 'Feb 18, 2025', confidence: 98, risk: 'critical' },
        { medicine: 'Metformin 850mg', stockoutDate: 'Mar 15, 2025', confidence: 88, risk: 'low' },
    ];

    const riskStyles = {
        low: 'bg-green-50 text-green-600 border-green-200',
        high: 'bg-orange-50 text-orange-600 border-orange-200',
        critical: 'bg-red-50 text-red-600 border-red-200',
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
                        <Calendar className="w-5 h-5" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                        <Download className="w-5 h-5" />
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Consumption Trends</h2>
                            <p className="text-sm text-[#6C757D] font-secondary">Top 5 most dispensed medicines</p>
                        </div>
                        <TrendingUp className="w-5 h-5 text-[#2EBE76]" />
                    </div>

                    <div className="space-y-4">
                        {topMedicines.map((med, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-[#1A1A1A]">{med.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-[#1A1A1A]">{med.dispensed}</span>
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${med.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {med.trend}
                    </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className={`bg-gradient-to-r ${med.color} h-full rounded-full transition-all duration-500`}
                                        style={{ width: `${(med.dispensed / topMedicines[0].dispensed) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Demand Forecast</h2>
                        <p className="text-sm text-[#6C757D]">Predicted stock depletion timeline</p>
                    </div>

                    <div className="space-y-4">
                        {predictions.map((pred, index) => (
                            <div key={index} className="p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <p className="font-semibold text-[#1A1A1A] mb-1">{pred.medicine}</p>
                                        <p className="text-sm text-[#6C757D]">Predicted stockout: {pred.stockoutDate}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${riskStyles[pred.risk as keyof typeof riskStyles]}`}>
                    {pred.risk.toUpperCase()}
                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-[#6C757D]">Confidence:</span>
                                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                                        <div
                                            className="bg-gradient-to-r from-[#2EBE76] to-[#21D6C3] h-full rounded-full"
                                            style={{ width: `${pred.confidence}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-semibold text-[#1A1A1A]">{pred.confidence}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-6">Usage Heatmap</h2>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 28 }).map((_, index) => {
                        const intensity = Math.floor(Math.random() * 4);
                        const colors = ['bg-gray-100', 'bg-[#21D6C3]/30', 'bg-[#2EBE76]/60', 'bg-[#0BAF8C]'];
                        return (
                            <div
                                key={index}
                                className={`aspect-square rounded-lg ${colors[intensity]} hover:scale-110 transition-transform cursor-pointer`}
                                title={`Day ${index + 1}`}
                            ></div>
                        );
                    })}
                </div>
                <div className="flex items-center justify-between mt-4 text-xs text-[#6C757D]">
                    <span>Less Activity</span>
                    <div className="flex gap-1">
                        <div className="w-4 h-4 rounded bg-gray-100"></div>
                        <div className="w-4 h-4 rounded bg-[#21D6C3]/30"></div>
                        <div className="w-4 h-4 rounded bg-[#2EBE76]/60"></div>
                        <div className="w-4 h-4 rounded bg-[#0BAF8C]"></div>
                    </div>
                    <span>More Activity</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-2xl p-6 text-white">
                    <p className="text-white/80 text-sm mb-2">Total Revenue (30 days)</p>
                    <p className="text-4xl font-bold mb-2">$47,284</p>
                    <p className="text-sm text-white/90">+18% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <p className="text-white/80 text-sm mb-2">Avg. Daily Dispensing</p>
                    <p className="text-4xl font-bold mb-2">287</p>
                    <p className="text-sm text-white/90">+8% from last month</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                    <p className="text-white/80 text-sm mb-2">Inventory Turnover</p>
                    <p className="text-4xl font-bold mb-2">6.2x</p>
                    <p className="text-sm text-white/90">Optimal range</p>
                </div>
            </div>
        </div>
    );
}
