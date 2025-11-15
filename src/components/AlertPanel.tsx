import { AlertTriangle, Clock, Package } from 'lucide-react';

export default function AlertPanel() {
    const alerts = [
        {
            type: 'critical',
            icon: AlertTriangle,
            title: 'Critical Stock Level',
            message: 'Aspirin 500mg - Only 45 units left',
            time: '5 min ago',
        },
        {
            type: 'warning',
            icon: Clock,
            title: 'Expiring Soon',
            message: 'Amoxicillin expires in 7 days',
            time: '1 hour ago',
        },
        {
            type: 'info',
            icon: Package,
            title: 'Auto-Reorder Triggered',
            message: 'Ibuprofen 400mg order placed',
            time: '2 hours ago',
        },
    ];

    const typeStyles = {
        critical: 'bg-red-50 border-red-200',
        warning: 'bg-orange-50 border-orange-200',
        info: 'bg-[#E8F9F5] border-[#2EBE76]/20',
    };

    const iconStyles = {
        critical: 'text-red-600',
        warning: 'text-orange-600',
        info: 'text-[#2EBE76]',
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Urgent Alerts</h2>
                <button className="text-sm text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">
                    View All
                </button>
            </div>

            <div className="space-y-3">
                {alerts.map((alert, index) => {
                    const Icon = alert.icon;
                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border ${typeStyles[alert.type as keyof typeof typeStyles]} transition-all hover:scale-[1.02]`}
                        >
                            <div className="flex items-start gap-3">
                                <Icon className={`w-5 h-5 mt-0.5 ${iconStyles[alert.type as keyof typeof iconStyles]}`} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{alert.title}</p>
                                    <p className="text-xs text-[#6C757D] mb-2">{alert.message}</p>
                                    <p className="text-xs text-[#6C757D]">{alert.time}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
