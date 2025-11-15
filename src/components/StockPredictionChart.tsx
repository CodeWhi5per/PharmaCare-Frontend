import { Activity } from 'lucide-react';

export default function StockPredictionChart() {
    const predictions = [
        { medicine: 'Paracetamol 500mg', current: 450, predicted: 180, days: 12 },
        { medicine: 'Ibuprofen 400mg', current: 320, predicted: 95, days: 8 },
        { medicine: 'Aspirin 75mg', current: 280, predicted: 110, days: 15 },
        { medicine: 'Amoxicillin 500mg', current: 190, predicted: 55, days: 6 },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Stock Predictions</h2>
                    <p className="text-sm text-[#6C757D]">AI-powered depletion forecasts</p>
                </div>
                <Activity className="w-5 h-5 text-[#2EBE76]" />
            </div>

            <div className="space-y-4">
                {predictions.map((item, index) => {
                    const percentage = (item.predicted / item.current) * 100;
                    const isLow = percentage < 30;

                    return (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-[#1A1A1A]">{item.medicine}</span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${isLow ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                  ~{item.days} days
                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex-1 bg-[#F7FDFC] rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-[#2EBE76] to-[#21D6C3]'}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="text-right min-w-[80px]">
                                    <span className="text-xs text-[#6C757D]">{item.predicted}/{item.current}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
