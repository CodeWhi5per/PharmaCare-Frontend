import {
    LayoutDashboard,
    Package,
    Bell,
    Users,
    TrendingUp,
    Settings,
    Pill
} from 'lucide-react';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'alerts', label: 'Alerts', icon: Bell },
        { id: 'suppliers', label: 'Suppliers', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] p-2.5 rounded-xl">
                        <Pill className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-[#1A1A1A]">PharmaCare</h1>
                        <p className="text-xs text-[#6C757D] font-secondary">Inventory System</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                isActive
                                    ? 'bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white shadow-md shadow-[#2EBE76]/20'
                                    : 'text-[#6C757D] hover:bg-[#F7FDFC] hover:text-[#2EBE76]'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="bg-gradient-to-br from-[#E8F9F5] to-[#F7FDFC] rounded-xl p-4 border border-[#2EBE76]/10">
                    <p className="text-xs font-semibold text-[#2EBE76] mb-1">Need Help?</p>
                    <p className="text-xs text-[#6C757D] mb-3 font-secondary">Contact support team</p>
                    <button className="w-full bg-white text-[#2EBE76] text-xs font-medium py-2 rounded-lg hover:shadow-sm transition-all">
                        Get Support
                    </button>
                </div>
            </div>
        </aside>
    );
}
