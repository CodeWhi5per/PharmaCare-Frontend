/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertTriangle, Clock, Package, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { alertsAPI } from '../services/api';

export default function Alerts() {
    const [activeFilter, setActiveFilter] = useState('All');
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = async (filter = 'All') => {
        try {
            setLoading(true);
            const res = await alertsAPI.getAll(filter);
            setAlerts(res.data);
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAlerts(activeFilter); }, [activeFilter]);

    const handleResolve = async (id: string) => {
        try {
            await alertsAPI.resolve(id);
            setAlerts((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error('Failed to resolve alert', err);
        }
    };

    const handleDismiss = async (id: string) => {
        try {
            await alertsAPI.dismiss(id);
            setAlerts((prev) => prev.filter((a) => a._id !== id));
        } catch (err) {
            console.error('Failed to dismiss alert', err);
        }
    };

    const typeStyles: Record<string, any> = {
        critical: { bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-100', iconText: 'text-red-600', badge: 'bg-red-600' },
        warning:  { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'bg-orange-100', iconText: 'text-orange-600', badge: 'bg-orange-600' },
        info:     { bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', iconText: 'text-blue-600', badge: 'bg-blue-600' },
        success:  { bg: 'bg-green-50', border: 'border-green-200', iconBg: 'bg-green-100', iconText: 'text-green-600', badge: 'bg-green-600' },
    };

    const categoryIcon: Record<string, any> = {
        'Low Stock': AlertTriangle,
        'Expiring Soon': Clock,
        'Auto-Reorder': Package,
        'Supplier Response': CheckCircle,
    };

    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Smart Notifications & Alerts</h1>
                <p className="text-[#6C757D] font-secondary">Real-time monitoring and intelligent alerts for your pharmacy</p>
            </div>

            <div className="flex gap-4 flex-wrap">
                {['All', 'Critical', 'Low Stock', 'Expiring Soon', 'Auto-Reorder'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all ${
                            filter === activeFilter
                                ? 'bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white shadow-md'
                                : 'bg-white border border-gray-200 text-[#6C757D] hover:border-[#2EBE76] hover:text-[#2EBE76]'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="bg-white rounded-2xl p-12 text-center text-[#6C757D]">Loading alerts...</div>
                ) : alerts.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No alerts found</h3>
                        <p className="text-[#6C757D] font-secondary">There are no {activeFilter.toLowerCase()} alerts at the moment.</p>
                    </div>
                ) : (
                    alerts.map((alert) => {
                        const styles = typeStyles[alert.type] || typeStyles.info;
                        const Icon = categoryIcon[alert.category] || Package;
                        return (
                            <div key={alert._id} className={`bg-white rounded-2xl p-6 border-2 ${styles.border} hover:shadow-lg transition-all`}>
                                <div className="flex items-start gap-4">
                                    <div className={`${styles.iconBg} p-3 rounded-xl`}>
                                        <Icon className={`w-6 h-6 ${styles.iconText}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold text-white ${styles.badge}`}>{alert.category}</span>
                                                <span className="text-xs text-[#6C757D] font-secondary">{timeAgo(alert.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleResolve(alert._id)} className="p-2 hover:bg-[#E8F9F5] rounded-lg transition-colors" title="Mark resolved">
                                                    <CheckCircle className="w-5 h-5 text-[#6C757D]" />
                                                </button>
                                                <button onClick={() => handleDismiss(alert._id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Dismiss">
                                                    <X className="w-5 h-5 text-[#6C757D]" />
                                                </button>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{alert.title}</h3>
                                        <p className="text-sm text-[#6C757D] mb-4 font-secondary">{alert.message}</p>

                                        {alert.currentStock != null && (
                                            <div className="flex items-center gap-6 p-4 bg-[#F7FDFC] rounded-xl">
                                                <div>
                                                    <p className="text-xs text-[#6C757D] mb-1 font-secondary">Current Stock</p>
                                                    <p className="text-lg font-bold text-[#1A1A1A]">{alert.currentStock}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-[#6C757D] mb-1 font-secondary">Minimum Required</p>
                                                    <p className="text-lg font-bold text-[#1A1A1A]">{alert.minStock}</p>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <div
                                                            className="bg-red-500 h-full rounded-full"
                                                            style={{ width: `${Math.min((alert.currentStock / (alert.minStock || 1)) * 100, 100)}%` }}
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
                    })
                )}
            </div>
        </div>
    );
}
