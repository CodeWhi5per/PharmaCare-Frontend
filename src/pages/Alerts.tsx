import { AlertTriangle, Clock, Package, CheckCircle, X } from 'lucide-react';

export default function Alerts() {
    const alerts = [
        {
            id: 1,
            type: 'critical',
            category: 'Low Stock',
            icon: AlertTriangle,
            title: 'Critical Stock Level - Aspirin 75mg',
            message: 'Only 45 units remaining. Minimum threshold is 100 units. Immediate reorder recommended.',
            time: '5 minutes ago',
            medicine: 'Aspirin 75mg',
            currentStock: 45,
            minStock: 100,
        },
        {
            id: 2,
            type: 'critical',
            category: 'Expiring Soon',
            icon: Clock,
            title: 'Medicine Expiring - Amoxicillin 500mg',
            message: 'Will expire in 7 days. 280 units in stock. Consider promotional pricing or return to supplier.',
            time: '1 hour ago',
            medicine: 'Amoxicillin 500mg',
            expiryDate: '2025-02-28',
            daysLeft: 7,
        },
        {
            id: 3,
            type: 'warning',
            category: 'Low Stock',
            icon: AlertTriangle,
            title: 'Low Stock Warning - Ibuprofen 400mg',
            message: 'Stock level at 95 units, below minimum of 150. Auto-reorder can be triggered.',
            time: '2 hours ago',
            medicine: 'Ibuprofen 400mg',
            currentStock: 95,
            minStock: 150,
        },
        {
            id: 4,
            type: 'info',
            category: 'Auto-Reorder',
            icon: Package,
            title: 'Auto-Reorder Triggered - Paracetamol 500mg',
            message: 'Automatic reorder placed for 1000 units. Order ID: ORD-2847. Supplier: MedSupply Co.',
            time: '3 hours ago',
            medicine: 'Paracetamol 500mg',
            orderQty: 1000,
            orderId: 'ORD-2847',
        },
        {
            id: 5,
            type: 'success',
            category: 'Supplier Response',
            icon: CheckCircle,
            title: 'Order Confirmed - Order #ORD-2845',
            message: 'PharmaDirect confirmed order. Expected delivery: 3-5 business days.',
            time: '5 hours ago',
            orderId: 'ORD-2845',
            supplier: 'PharmaDirect',
        },
    ];

    const typeStyles = {
        critical: {
            bg: 'bg-red-50',
            border: 'border-red-200',
            iconBg: 'bg-red-100',
            iconText: 'text-red-600',
            badge: 'bg-red-600',
        },
        warning: {
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            iconBg: 'bg-orange-100',
            iconText: 'text-orange-600',
            badge: 'bg-orange-600',
        },
        info: {
            bg: 'bg-blue-50',
            border: 'border-blue-200',
            iconBg: 'bg-blue-100',
            iconText: 'text-blue-600',
            badge: 'bg-blue-600',
        },
        success: {
            bg: 'bg-green-50',
            border: 'border-green-200',
            iconBg: 'bg-green-100',
            iconText: 'text-green-600',
            badge: 'bg-green-600',
        },
    };

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Smart Notifications & Alerts</h1>
                <p className="text-[#6C757D]">Real-time monitoring and intelligent alerts for your pharmacy</p>
            </div>

            <div className="flex gap-4">
                {['All', 'Critical', 'Low Stock', 'Expiring Soon', 'Auto-Reorder'].map((filter) => (
                    <button
                        key={filter}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            filter === 'All'
                                ? 'bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white shadow-md'
                                : 'bg-white border border-gray-200 text-[#6C757D] hover:border-[#2EBE76] hover:text-[#2EBE76]'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => {
                    const styles = typeStyles[alert.type as keyof typeof typeStyles];
                    const Icon = alert.icon;

                    return (
                        <div
                            key={alert.id}
                            className={`bg-white rounded-2xl p-6 border-2 ${styles.border} hover:shadow-lg transition-all`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`${styles.iconBg} p-3 rounded-xl`}>
                                    <Icon className={`w-6 h-6 ${styles.iconText}`} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold text-white ${styles.badge}`}>
                        {alert.category}
                      </span>
                                            <span className="text-xs text-[#6C757D]">{alert.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-[#E8F9F5] rounded-lg transition-colors">
                                                <CheckCircle className="w-5 h-5 text-[#6C757D]" />
                                            </button>
                                            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                <X className="w-5 h-5 text-[#6C757D]" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{alert.title}</h3>
                                    <p className="text-sm text-[#6C757D] mb-4">{alert.message}</p>

                                    {alert.currentStock && (
                                        <div className="flex items-center gap-6 p-4 bg-[#F7FDFC] rounded-xl">
                                            <div>
                                                <p className="text-xs text-[#6C757D] mb-1">Current Stock</p>
                                                <p className="text-lg font-bold text-[#1A1A1A]">{alert.currentStock}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[#6C757D] mb-1">Minimum Required</p>
                                                <p className="text-lg font-bold text-[#1A1A1A]">{alert.minStock}</p>
                                            </div>
                                            <div className="flex-1">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-red-500 h-full rounded-full"
                                                        style={{ width: `${(alert.currentStock / alert.minStock) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {alert.type === 'critical' && alert.category === 'Low Stock' && (
                                        <div className="flex gap-3 mt-4">
                                            <button className="px-6 py-2.5 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-md transition-all">
                                                Trigger Reorder
                                            </button>
                                            <button className="px-6 py-2.5 bg-white border border-gray-200 text-[#1A1A1A] rounded-xl font-semibold hover:border-[#2EBE76] transition-all">
                                                View Details
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
