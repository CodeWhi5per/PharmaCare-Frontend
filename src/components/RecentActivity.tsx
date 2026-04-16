import { useState, useEffect } from 'react';
import { Package, ShoppingCart, AlertCircle, CheckCircle, User, Activity, Loader2 } from 'lucide-react';
import { dashboardAPI } from '../services/api';

interface ActivityItem {
    _id: string;
    action: string;
    entity: string;
    entityName: string;
    createdAt: string;
    performedBy?: { name: string };
}

const actionConfig = (action: string, entity: string) => {
    const key = `${action} ${entity}`.toLowerCase();
    if (key.includes('stock') || key.includes('medicine') || key.includes('inventory'))
        return { icon: Package, style: 'bg-green-50 text-green-600' };
    if (key.includes('order') || key.includes('reorder') || key.includes('supplier'))
        return { icon: ShoppingCart, style: 'bg-blue-50 text-blue-600' };
    if (key.includes('alert') || key.includes('low') || key.includes('expir'))
        return { icon: AlertCircle, style: 'bg-orange-50 text-orange-600' };
    if (key.includes('resolv') || key.includes('dismiss'))
        return { icon: CheckCircle, style: 'bg-[#E8F9F5] text-[#2EBE76]' };
    if (key.includes('user') || key.includes('login') || key.includes('register'))
        return { icon: User, style: 'bg-purple-50 text-purple-600' };
    return { icon: Activity, style: 'bg-gray-50 text-gray-600' };
};

const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
};

export default function RecentActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dashboardAPI.getRecentActivity()
            .then((res) => {
                // Exclude user auth actions - only show medicine/inventory/alert/supplier activity
                const filtered = (res.data as ActivityItem[]).filter(a => {
                    const entity = a.entity?.toLowerCase() ?? '';
                    const action = a.action?.toLowerCase() ?? '';
                    // Exclude login, register, user-only events
                    if (entity === 'user') return false;
                    if (action === 'logged in' || action === 'registered') return false;
                    return true;
                });
                setActivities(filtered);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Recent Activity</h2>
                <span className="text-xs text-[#6C757D] font-secondary">Last 10 actions</span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-[#2EBE76] animate-spin" />
                </div>
            ) : activities.length === 0 ? (
                <p className="text-sm text-[#6C757D] text-center py-6">No recent activity yet.</p>
            ) : (
                <div className="space-y-3">
                    {activities.map((activity) => {
                        const { icon: Icon, style } = actionConfig(activity.action, activity.entity);
                        return (
                            <div key={activity._id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-[#F7FDFC] transition-all">
                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${style}`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-[#1A1A1A]">
                                        {activity.action} – {activity.entity}
                                    </p>
                                    <p className="text-xs text-[#6C757D] font-secondary truncate">
                                        {activity.entityName}
                                        {activity.performedBy ? ` · by ${activity.performedBy.name}` : ''}
                                    </p>
                                    <p className="text-xs text-[#6C757D] font-secondary mt-0.5">{timeAgo(activity.createdAt)}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
