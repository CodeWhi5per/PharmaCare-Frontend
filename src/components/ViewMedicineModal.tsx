import { X, Package, Calendar, DollarSign, TrendingDown, Tag, Building2, Activity } from 'lucide-react';

interface ViewMedicineModalProps {
    isOpen: boolean;
    onClose: () => void;
    medicine: any | null;
}

export default function ViewMedicineModal({ isOpen, onClose, medicine }: ViewMedicineModalProps) {
    if (!isOpen || !medicine) return null;

    const statusStyles = {
        healthy: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', label: 'Healthy' },
        low: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', label: 'Low Stock' },
        critical: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Critical' },
        expiring: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', label: 'Expiring Soon' },
    };

    const status = statusStyles[medicine.status as keyof typeof statusStyles] || statusStyles.healthy;
    const expiryDate = medicine.expiry ? new Date(medicine.expiry).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : '—';

    const createdAt = medicine.createdAt ? new Date(medicine.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : '—';

    const updatedAt = medicine.updatedAt ? new Date(medicine.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }) : '—';

    const stockPercentage = Math.min((medicine.stock / (medicine.minStock || 1)) * 100, 100);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{medicine.name}</h2>
                            <p className="text-white text-opacity-90 text-sm font-secondary">Medicine Details</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {/* Status Badge */}
                    <div className="mb-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {status.label}
                        </span>
                    </div>

                    {/* Stock Level Progress */}
                    <div className="mb-6 p-4 bg-[#F7FDFC] border border-gray-100 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-[#1A1A1A]">Stock Level</span>
                            <span className="text-sm text-[#6C757D]">{medicine.stock} / {medicine.minStock} units</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-full rounded-full transition-all ${medicine.stock < medicine.minStock ? 'bg-red-500' : 'bg-[#2EBE76]'}`}
                                style={{ width: `${stockPercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-[#6C757D] mt-2 font-secondary">
                            {medicine.stock < medicine.minStock
                                ? `⚠️ Below minimum stock level by ${medicine.minStock - medicine.stock} units`
                                : `✓ Stock level is healthy`}
                        </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#E8F9F5] rounded-lg">
                                    <Tag className="w-5 h-5 text-[#2EBE76]" />
                                </div>
                                <span className="text-sm font-semibold text-[#6C757D]">Category</span>
                            </div>
                            <p className="text-lg font-bold text-[#1A1A1A] ml-11">{medicine.category}</p>
                        </div>

                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#E8F9F5] rounded-lg">
                                    <Building2 className="w-5 h-5 text-[#2EBE76]" />
                                </div>
                                <span className="text-sm font-semibold text-[#6C757D]">Supplier</span>
                            </div>
                            <p className="text-lg font-bold text-[#1A1A1A] ml-11">{medicine.supplier || '—'}</p>
                        </div>

                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#E8F9F5] rounded-lg">
                                    <Calendar className="w-5 h-5 text-[#2EBE76]" />
                                </div>
                                <span className="text-sm font-semibold text-[#6C757D]">Expiry Date</span>
                            </div>
                            <p className="text-lg font-bold text-[#1A1A1A] ml-11">{expiryDate}</p>
                        </div>

                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#E8F9F5] rounded-lg">
                                    <Package className="w-5 h-5 text-[#2EBE76]" />
                                </div>
                                <span className="text-sm font-semibold text-[#6C757D]">Batch Number</span>
                            </div>
                            <p className="text-lg font-bold text-[#1A1A1A] ml-11">{medicine.batchNumber || '—'}</p>
                        </div>

                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#E8F9F5] rounded-lg">
                                    <TrendingDown className="w-5 h-5 text-[#2EBE76]" />
                                </div>
                                <span className="text-sm font-semibold text-[#6C757D]">Consumption Rate</span>
                            </div>
                            <p className="text-lg font-bold text-[#1A1A1A] ml-11">{medicine.consumption || '—'}</p>
                        </div>

                        <div className="p-4 bg-white border border-gray-100 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#E8F9F5] rounded-lg">
                                    <DollarSign className="w-5 h-5 text-[#2EBE76]" />
                                </div>
                                <span className="text-sm font-semibold text-[#6C757D]">Unit Price</span>
                            </div>
                            <p className="text-lg font-bold text-[#1A1A1A] ml-11">${medicine.unitPrice?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="p-4 bg-[#F7FDFC] border border-gray-100 rounded-xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-5 h-5 text-[#2EBE76]" />
                            <h3 className="text-sm font-semibold text-[#1A1A1A]">Record Information</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <p className="text-xs text-[#6C757D] font-secondary mb-1">Created At</p>
                                <p className="text-sm font-medium text-[#1A1A1A]">{createdAt}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#6C757D] font-secondary mb-1">Last Updated</p>
                                <p className="text-sm font-medium text-[#1A1A1A]">{updatedAt}</p>
                            </div>
                        </div>
                    </div>

                    {/* Total Value */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] rounded-xl">
                        <div className="flex items-center justify-between text-white">
                            <div>
                                <p className="text-sm text-white text-opacity-90 font-secondary mb-1">Total Stock Value</p>
                                <p className="text-2xl font-bold">${((medicine.stock || 0) * (medicine.unitPrice || 0)).toFixed(2)}</p>
                            </div>
                            <Package className="w-12 h-12 text-white text-opacity-30" />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

