import { TrendingUp } from 'lucide-react';

export default function ConsumptionChart() {
    const data = [
        { day: 'Mon', value: 65 },
        { day: 'Tue', value: 78 },
        { day: 'Wed', value: 70 },
        { day: 'Thu', value: 85 },
        { day: 'Fri', value: 92 },
        { day: 'Sat', value: 88 },
        { day: 'Sun', value: 75 },
    ];

    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">Consumption Trends</h2>
                    <p className="text-sm text-[#6C757D]">Daily medicine dispensing overview</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-600">+12%</span>
                </div>
            </div>

            <div className="flex items-end justify-between h-48 gap-4">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full bg-[#F7FDFC] rounded-t-lg overflow-hidden" style={{ height: '100%' }}>
                            <div
                                className="absolute bottom-0 w-full bg-gradient-to-t from-[#2EBE76] to-[#21D6C3] rounded-t-lg transition-all duration-500 hover:from-[#0BAF8C] hover:to-[#2EBE76]"
                                style={{ height: `${(item.value / maxValue) * 100}%` }}
                            >
                                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white opacity-0 hover:opacity-100 transition-opacity">
                    {item.value}
                  </span>
                                </div>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-[#6C757D]">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
