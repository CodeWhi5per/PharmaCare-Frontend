import { LucideIcon, ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: LucideIcon;
    color: 'blue' | 'orange' | 'red' | 'green';
}

const colorStyles = {
    blue: {
        bg: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50',
        text: 'text-blue-600',
    },
    orange: {
        bg: 'from-orange-500 to-orange-600',
        light: 'bg-orange-50',
        text: 'text-orange-600',
    },
    red: {
        bg: 'from-red-500 to-red-600',
        light: 'bg-red-50',
        text: 'text-red-600',
    },
    green: {
        bg: 'from-[#2EBE76] to-[#0BAF8C]',
        light: 'bg-[#E8F9F5]',
        text: 'text-[#2EBE76]',
    },
};

export default function StatCard({ title, value, change, changeType, icon: Icon, color }: StatCardProps) {
    const styles = colorStyles[color];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
                <div className={`${styles.light} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${styles.text}`} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${changeType === 'increase' ? 'bg-green-50' : 'bg-red-50'}`}>
                    {changeType === 'increase' ? (
                        <ArrowUp className="w-3 h-3 text-green-600" />
                    ) : (
                        <ArrowDown className="w-3 h-3 text-red-600" />
                    )}
                    <span className={`text-xs font-semibold ${changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
                </div>
            </div>
            <p className="text-[#6C757D] text-sm mb-1">{title}</p>
            <p className="text-3xl font-bold text-[#1A1A1A]">{value}</p>
        </div>
    );
}
