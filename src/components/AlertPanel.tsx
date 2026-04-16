import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Package, CheckCircle, X, Loader2 } from 'lucide-react';
import { alertsAPI } from '../services/api';

interface AlertPanelProps {
    onViewAll?: () => void;
}

interface Alert {
    _id: string;
    type: 'critical' | 'warning' | 'info';
    category: string;
    title: string;
    message: string;
    createdAt: string;
    resolved: boolean;
    dismissed: boolean;
}

export default function AlertPanel({ onViewAll }: AlertPanelProps) {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAlerts = () => {
        setLoading(true);
        alertsAPI.getAll()
            .then((res) => setAlerts((res.data as Alert[]).slice(0, 4)))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchAlerts(); }, []);

    const handleResolve = async (id: string) => {
        try {
            await alertsAPI.resolve(id);
            setAlerts(prev => prev.filter(a => a._id !== id));
        } catch (err) { console.error(err); }
    };

    const handleDismiss = async (id: string) => {
        try {
            await alertsAPI.dismiss(id);
            setAlerts(prev => prev.filter(a => a._id !== id));
        } catch (err) { console.error(err); }
    };

    const timeAgo = (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
        return `${Math.floor(hrs / 24)} day${Math.floor(hrs / 24) > 1 ? 's' : ''} ago`;
    };

    const typeStyles: Record<string, string> = {
        critical: 'bg-red-50 border-red-200',
        warning: 'bg-orange-50 border-orange-200',
        info: 'bg-[#E8F9F5] border-[#2EBE76]/20',
    };
    const iconStyles: Record<string, string> = {
        critical: 'text-red-600',
        warning: 'text-orange-600',
        info: 'text-[#2EBE76]',
    };
    const IconMap: Record<string, React.ElementType> = {
        critical: AlertTriangle,
        warning: Clock,
        info: Package,
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Urgent Alerts</h2>
                <button
                    onClick={onViewAll}
                    className="text-sm text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors"
                >
                    View All
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#2EBE76] animate-spin" />
                </div>
            ) : alerts.length === 0 ? (
                <div className="text-center py-8">
                    <CheckCircle className="w-10 h-10 text-[#2EBE76] mx-auto mb-2" />
                    <p className="text-sm text-[#6C757D]">No active alerts</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {alerts.map((alert) => {
                        const Icon = IconMap[alert.type] || AlertTriangle;
                        return (
                            <div
                                key={alert._id}
                                className={`p-3 rounded-xl border ${typeStyles[alert.type] || typeStyles.info} transition-all hover:scale-[1.01]`}
                            >
                                <div className="flex items-start gap-3">
                                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconStyles[alert.type] || iconStyles.info}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#1A1A1A]">{alert.title}</p>
                                        <p className="text-xs text-[#6C757D] mt-0.5 font-secondary">{alert.message}</p>
                                        <p className="text-xs text-[#6C757D] mt-1 font-secondary">{timeAgo(alert.createdAt)}</p>
                                    </div>
                                    <div className="flex gap-1 flex-shrink-0">
                                        <button
                                            onClick={() => handleResolve(alert._id)}
                                            title="Resolve"
                                            className="p-1 hover:bg-green-100 rounded-lg transition-colors"
                                        >
                                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                        </button>
                                        <button
                                            onClick={() => handleDismiss(alert._id)}
                                            title="Dismiss"
                                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5 text-[#6C757D]" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
