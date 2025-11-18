import { useState } from 'react';
import { X, FileText, Download, FileSpreadsheet, File } from 'lucide-react';

interface ExportReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onExport: (exportData: ExportData) => void;
}

export interface ExportData {
    reportType: string;
    format: 'pdf' | 'excel';
    dateRange: string;
}

export default function ExportReportModal({ isOpen, onClose, onExport }: ExportReportModalProps) {
    const [reportType, setReportType] = useState('inventory');
    const [format, setFormat] = useState<'pdf' | 'excel'>('pdf');
    const [dateRange, setDateRange] = useState('last-30-days');

    const reportTypes = [
        { value: 'inventory', label: 'Inventory Report', description: 'Complete stock levels and medicine details' },
        { value: 'low-stock', label: 'Low Stock Report', description: 'Medicines below minimum stock level' },
        { value: 'expiring', label: 'Expiring Medicines', description: 'Medicines expiring in the next 90 days' },
        { value: 'consumption', label: 'Consumption Report', description: 'Medicine usage and consumption trends' },
        { value: 'suppliers', label: 'Supplier Report', description: 'Supplier performance and orders' },
        { value: 'financial', label: 'Financial Summary', description: 'Cost analysis and financial overview' },
    ];

    const dateRanges = [
        { value: 'today', label: 'Today' },
        { value: 'last-7-days', label: 'Last 7 Days' },
        { value: 'last-30-days', label: 'Last 30 Days' },
        { value: 'last-90-days', label: 'Last 90 Days' },
        { value: 'this-year', label: 'This Year' },
        { value: 'custom', label: 'Custom Range' },
    ];

    const handleExport = () => {
        onExport({
            reportType,
            format,
            dateRange,
        });

        // Simulate download
        const fileName = `${reportType}-report-${Date.now()}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        console.log(`Exporting ${fileName}`);

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Export Report</h2>
                            <p className="text-white text-opacity-90 text-sm font-secondary">
                                Generate and download reports
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Report Type Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                            Select Report Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {reportTypes.map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    onClick={() => setReportType(type.value)}
                                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                                        reportType === type.value
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                    }`}
                                >
                                    <p className="font-semibold text-[#1A1A1A] mb-1">{type.label}</p>
                                    <p className="text-xs text-[#6C757D]">{type.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                            Export Format <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormat('pdf')}
                                className={`p-6 rounded-xl border-2 transition-all ${
                                    format === 'pdf'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`p-3 rounded-xl ${
                                        format === 'pdf' ? 'bg-purple-500' : 'bg-gray-200'
                                    }`}>
                                        <File className={`w-8 h-8 ${format === 'pdf' ? 'text-white' : 'text-gray-600'}`} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-[#1A1A1A]">PDF Document</p>
                                        <p className="text-xs text-[#6C757D] mt-1">Professional formatted report</p>
                                    </div>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormat('excel')}
                                className={`p-6 rounded-xl border-2 transition-all ${
                                    format === 'excel'
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-200 hover:border-purple-300'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`p-3 rounded-xl ${
                                        format === 'excel' ? 'bg-purple-500' : 'bg-gray-200'
                                    }`}>
                                        <FileSpreadsheet className={`w-8 h-8 ${format === 'excel' ? 'text-white' : 'text-gray-600'}`} />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-[#1A1A1A]">Excel Spreadsheet</p>
                                        <p className="text-xs text-[#6C757D] mt-1">Editable data format</p>
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Date Range Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#1A1A1A] mb-3">
                            Date Range <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        >
                            {dateRanges.map((range) => (
                                <option key={range.value} value={range.value}>
                                    {range.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Summary Box */}
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <h3 className="font-semibold text-[#1A1A1A] mb-3">Export Summary</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#6C757D]">Report Type:</span>
                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {reportTypes.find(t => t.value === reportType)?.label}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#6C757D]">Format:</span>
                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {format.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-[#6C757D]">Date Range:</span>
                                <span className="text-sm font-semibold text-[#1A1A1A]">
                                    {dateRanges.find(r => r.value === dateRange)?.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-6 py-3 bg-white border border-gray-200 text-[#1A1A1A] rounded-xl font-semibold hover:bg-gray-100 transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleExport}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                    >
                        <Download className="w-5 h-5" />
                        Export Report
                    </button>
                </div>
            </div>
        </div>
    );
}

