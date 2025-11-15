import { Package, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import AlertPanel from '../components/AlertPanel';
import ConsumptionChart from '../components/ConsumptionChart';
import StockPredictionChart from '../components/StockPredictionChart';
import QuickActions from '../components/QuickActions';
import RecentActivity from '../components/RecentActivity';

export default function Dashboard() {
    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Dashboard</h1>
                <p className="text-[#6C757D] font-secondary">Welcome back! Here's what's happening with your pharmacy today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Medicines"
                    value="1,247"
                    change="+12"
                    changeType="increase"
                    icon={Package}
                    color="blue"
                />
                <StatCard
                    title="Low Stock Items"
                    value="23"
                    change="-5"
                    changeType="decrease"
                    icon={AlertTriangle}
                    color="orange"
                />
                <StatCard
                    title="Expiring Soon"
                    value="8"
                    change="+3"
                    changeType="increase"
                    icon={Calendar}
                    color="red"
                />
                <StatCard
                    title="Auto Orders"
                    value="15"
                    change="+7"
                    changeType="increase"
                    icon={TrendingUp}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <ConsumptionChart />
                    <StockPredictionChart />
                </div>

                <div className="space-y-6">
                    <AlertPanel />
                    <QuickActions />
                </div>
            </div>

            <RecentActivity />
        </div>
    );
}
