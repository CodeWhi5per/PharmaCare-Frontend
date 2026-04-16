import { useState } from 'react';
import { X, FileText, Download, FileSpreadsheet, File, Loader2 } from 'lucide-react';
import { inventoryAPI, suppliersAPI, alertsAPI } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface jsPDF {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        autoTable: (options: any) => jsPDF;
    }
}

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
    const [exporting, setExporting] = useState(false);

    const reportTypes = [
        { value: 'inventory', label: 'Inventory Report', description: 'Complete stock levels and medicine details' },
        { value: 'low-stock', label: 'Low Stock Report', description: 'Medicines below minimum stock level' },
        { value: 'expiring', label: 'Expiring Medicines', description: 'Medicines expiring in the next 90 days' },
        { value: 'consumption', label: 'Consumption Report', description: 'Medicine usage and consumption trends' },
        { value: 'suppliers', label: 'Supplier Report', description: 'Supplier performance and orders' },
        { value: 'alerts', label: 'Alerts Report', description: 'Active and resolved alerts' },
    ];

    const dateRanges = [
        { value: 'today', label: 'Today' },
        { value: 'last-7-days', label: 'Last 7 Days' },
        { value: 'last-30-days', label: 'Last 30 Days' },
        { value: 'last-90-days', label: 'Last 90 Days' },
        { value: 'this-year', label: 'This Year' },
    ];

    const handleExport = async () => {
        setExporting(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let rows: Record<string, any>[] = [];
            const ts = new Date().toISOString().split('T')[0];
            let reportTitle = '';

            if (reportType === 'inventory') {
                reportTitle = 'Inventory Report';
                const res = await inventoryAPI.getAll({ limit: '500' });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rows = (res.data as any[]).map(m => ({
                    Name: m.name, Category: m.category, Stock: m.stock,
                    'Min Stock': m.minStock, Status: m.status,
                    'Expiry Date': m.expiry ? new Date(m.expiry).toLocaleDateString() : '',
                    Supplier: m.supplier || '', 'Unit Price': m.unitPrice || 0,
                }));
            } else if (reportType === 'low-stock') {
                reportTitle = 'Low Stock Report';
                const res = await inventoryAPI.getLowStock();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rows = (res.data as any[]).map(m => ({
                    Name: m.name, Category: m.category || 'N/A', 'Current Stock': m.currentStock,
                    'Min Stock': m.minStock, Status: m.status || 'low', Supplier: m.supplier || '',
                }));
            } else if (reportType === 'expiring') {
                reportTitle = 'Expiring Medicines Report';
                const res = await inventoryAPI.getAll({ limit: '500' });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const allMeds = res.data as any[];
                rows = allMeds
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .filter((m: any) => m.status === 'expiring')
                    .map(m => ({
                        Name: m.name, Category: m.category, Stock: m.stock,
                        'Expiry Date': m.expiry ? new Date(m.expiry).toLocaleDateString() : '',
                        'Days Until Expiry': m.expiry
                            ? Math.ceil((new Date(m.expiry).getTime() - Date.now()) / 86400000)
                            : '',
                    }));
            } else if (reportType === 'consumption') {
                reportTitle = 'Consumption Report';
                const res = await inventoryAPI.getAll({ limit: '500' });
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rows = (res.data as any[]).map(m => ({
                    Name: m.name, Category: m.category,
                    'Consumption Rate (units/day)': m.consumptionRate || 0,
                    'Current Stock': m.stock,
                    'Est. Days Remaining': m.consumptionRate > 0
                        ? Math.floor(m.stock / m.consumptionRate) : 'N/A',
                }));
            } else if (reportType === 'suppliers') {
                reportTitle = 'Supplier Report';
                const res = await suppliersAPI.getAll();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rows = (res.data as any[]).map(s => ({
                    Name: s.name, Contact: s.contactPerson || '',
                    Email: s.email || '', Phone: s.phone || '',
                    Status: s.status, 'Total Orders': s.totalOrders || 0,
                }));
            } else if (reportType === 'alerts') {
                reportTitle = 'Alerts Report';
                const res = await alertsAPI.getAll();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rows = (res.data as any[]).map(a => ({
                    Title: a.title, Type: a.type, Category: a.category,
                    Message: a.message, Resolved: a.resolved ? 'Yes' : 'No',
                    Date: new Date(a.createdAt).toLocaleDateString(),
                }));
            }

            if (format === 'pdf') {
                // Generate PDF
                const doc = new jsPDF();

                // Add header
                doc.setFontSize(20);
                doc.setTextColor(44, 62, 80);
                doc.text(reportTitle, 14, 20);

                doc.setFontSize(10);
                doc.setTextColor(108, 117, 125);
                doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
                doc.text(`Date Range: ${dateRanges.find(r => r.value === dateRange)?.label}`, 14, 34);

                // Add table
                if (rows.length > 0) {
                    const headers = Object.keys(rows[0]);
                    const data = rows.map(row => headers.map(h => row[h]));

                    doc.autoTable({
                        head: [headers],
                        body: data,
                        startY: 40,
                        theme: 'striped',
                        headStyles: {
                            fillColor: [147, 51, 234], // purple-600
                            textColor: 255,
                            fontStyle: 'bold',
                            halign: 'center',
                        },
                        styles: {
                            fontSize: 9,
                            cellPadding: 3,
                        },
                        alternateRowStyles: {
                            fillColor: [249, 250, 251], // gray-50
                        },
                    });
                } else {
                    doc.setFontSize(12);
                    doc.text('No data available for this report.', 14, 45);
                }

                // Add footer
                const pageCount = doc.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text(
                        `Page ${i} of ${pageCount} - PharmaCare Management System`,
                        doc.internal.pageSize.getWidth() / 2,
                        doc.internal.pageSize.getHeight() - 10,
                        { align: 'center' }
                    );
                }

                // Download PDF
                const filename = `${reportType}-report-${ts}.pdf`;
                doc.save(filename);

            } else {
                // Generate Excel
                const ws = XLSX.utils.json_to_sheet(rows);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, reportTitle);

                // Set column widths for better readability
                ws['!cols'] = Object.keys(rows[0] || {}).map(key => ({
                    wch: Math.max(key.length, 15)
                }));

                // Download Excel
                const filename = `${reportType}-report-${ts}.xlsx`;
                XLSX.writeFile(wb, filename);
            }

            onExport({ reportType, format, dateRange });
            onClose();
        } catch (err) {
            console.error('Export failed', err);
            alert('Failed to export report. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
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

                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">

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
                        disabled={exporting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {exporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        {exporting ? 'Exporting…' : 'Export Report'}
                    </button>
                </div>
            </div>
        </div>
    );
}

