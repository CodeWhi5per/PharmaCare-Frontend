import { Package, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';

export default function RecentActivity() {
    const activities = [
        {
            icon: Package,
            title: 'Stock Updated',
            description: 'Paracetamol 500mg - Added 500 units',
            time: '10 minutes ago',
            type: 'success',
        },
        {
            icon: ShoppingCart,
            title: 'Order Placed',
            description: 'Auto-reorder: Ibuprofen 400mg (1000 units)',
            time: '45 minutes ago',
            type: 'info',
        },
        {
            icon: AlertCircle,
            title: 'Low Stock Alert',
            description: 'Aspirin 75mg reached minimum threshold',
            time: '2 hours ago',
            type: 'warning',
        },
        {
            icon: CheckCircle,
            title: 'Supplier Response',
            description: 'MedSupply Co. confirmed order #MS-2847',
            time: '3 hours ago',
            type: 'success',
        },
    ];

    const typeStyles = {
        success: 'bg-green-50 text-green-600',
        info: 'bg-blue-50 text-blue-600',
        warning: 'bg-orange-50 text-orange-600',
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Activity</h2>
            <div className="space-y-4">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F7FDFC] transition-all">
                            <div className={`p-2.5 rounded-xl ${typeStyles[activity.type as keyof typeof typeStyles]}`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{activity.title}</p>
                                <p className="text-sm text-[#6C757D] mb-1">{activity.description}</p>
                                <p className="text-xs text-[#6C757D]">{activity.time}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
