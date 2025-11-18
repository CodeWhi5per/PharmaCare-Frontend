import { Plus, RefreshCw, FileText, Users } from 'lucide-react';

interface QuickActionsProps {
    onAddMedicine?: () => void;
    onViewSuppliers?: () => void;
    onGenerateReorder?: () => void;
    onExportReport?: () => void;
}

export default function QuickActions({
    onAddMedicine,
    onViewSuppliers,
    onGenerateReorder,
    onExportReport
}: QuickActionsProps) {
    const actions = [
        { icon: Plus, label: 'Add Medicine', color: 'from-[#2EBE76] to-[#0BAF8C]', onClick: onAddMedicine },
        { icon: Users, label: 'View Suppliers', color: 'from-blue-500 to-blue-600', onClick: onViewSuppliers },
        { icon: RefreshCw, label: 'Generate Reorder', color: 'from-orange-500 to-orange-600', onClick: onGenerateReorder },
        { icon: FileText, label: 'Export Report', color: 'from-purple-500 to-purple-600', onClick: onExportReport },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action, index) => {
                    const Icon = action.icon;
                    return (
                        <button
                            key={index}
                            onClick={action.onClick}
                            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:shadow-md hover:scale-[1.02] transition-all duration-200 group"
                        >
                            <div className={`bg-gradient-to-br ${action.color} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs font-medium text-[#1A1A1A] text-center font-secondary">{action.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
