/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Eye, X, Edit2, Trash2 } from 'lucide-react';
import AddMedicineModal, { MedicineFormData } from '../components/AddMedicineModal';
import EditMedicineModal from '../components/EditMedicineModal';
import ViewMedicineModal from '../components/ViewMedicineModal';
import ExportReportModal from '../components/ExportReportModal';
import { inventoryAPI } from '../services/api';
import { UserRole } from '../utils/permissions';
import usePermissions from '../hooks/usePermissions';

export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [medicines, setMedicines] = useState<any[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [allCategories, setAllCategories] = useState<string[]>([]);

    // Get user role from localStorage
    const storedUser = localStorage.getItem('pharmacare_user');
    const userRole = storedUser ? (JSON.parse(storedUser).role as UserRole) : undefined;
    const permissions = usePermissions(userRole);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const fetchMedicines = async (search = '', status = '', category = '') => {
        try {
            setLoading(true);
            const params: Record<string, string> = {};
            if (search) params.search = search;
            if (status) params.status = status;
            if (category) params.category = category;

            const res = await inventoryAPI.getAll(params);
            setMedicines(res.data);

            // Extract unique categories if we don't have filters applied
            if (!search && !status && !category) {
                const categories = Array.from(
                    new Set(res.data.map((m: any) => m.category).filter(Boolean))
                ).sort();
                setAllCategories(categories as string[]);
            }
        } catch (err) {
            console.error('Failed to fetch medicines', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMedicines(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchMedicines(searchTerm, statusFilter, categoryFilter), 400);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, categoryFilter]);

    const handleAddMedicine = async (medicineData: MedicineFormData) => {
        try {
            await inventoryAPI.create(medicineData);
            fetchMedicines(searchTerm, statusFilter, categoryFilter);
        } catch (err) {
            console.error('Failed to add medicine', err);
        }
    };

    const handleUpdateMedicine = async (id: string, medicineData: MedicineFormData) => {
        try {
            await inventoryAPI.update(id, medicineData);
            fetchMedicines(searchTerm, statusFilter, categoryFilter);
        } catch (err) {
            console.error('Failed to update medicine', err);
        }
    };

    const handleViewMedicine = (medicine: any) => {
        setSelectedMedicine(medicine);
        setIsViewModalOpen(true);
    };

    const handleEditMedicine = (medicine: any) => {
        setSelectedMedicine(medicine);
        setIsEditModalOpen(true);
    };

    const handleDeleteMedicine = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            try {
                await inventoryAPI.delete(id);
                fetchMedicines(searchTerm, statusFilter, categoryFilter);
            } catch (err) {
                console.error('Failed to delete medicine', err);
            }
        }
    };

    const clearFilters = () => {
        setStatusFilter('');
        setCategoryFilter('');
        setSearchTerm('');
    };

    const hasActiveFilters = statusFilter || categoryFilter || searchTerm;

    const statusStyles = {
        healthy: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', label: 'Healthy' },
        low: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', label: 'Low Stock' },
        critical: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', label: 'Critical' },
        expiring: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-200', label: 'Expiring Soon' },
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Inventory Management</h1>
                    <p className="text-[#6C757D] font-secondary">Monitor and manage your pharmacy stock levels</p>
                </div>
                {permissions.canDo('addMedicine') && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Medicine
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by medicine name, category, supplier..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-[#F7FDFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                        />
                        {searchTerm && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <span className="text-sm text-[#6C757D] font-secondary">
                                    {medicines.length} result{medicines.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 border rounded-xl font-medium transition-all ${
                            showFilters || hasActiveFilters
                                ? 'bg-[#2EBE76] text-white border-[#2EBE76]'
                                : 'bg-[#F7FDFC] border-gray-100 text-[#1A1A1A] hover:bg-[#E8F9F5] hover:border-[#2EBE76]'
                        }`}
                    >
                        <Filter className="w-5 h-5" />
                        Filters
                        {hasActiveFilters && (
                            <span className="bg-white text-[#2EBE76] px-2 py-0.5 rounded-full text-xs font-bold">
                                {[statusFilter, categoryFilter, searchTerm].filter(Boolean).length}
                            </span>
                        )}
                    </button>
                    {permissions.canDo('exportInventory') && (
                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-[#F7FDFC] border border-gray-100 rounded-xl font-medium text-[#1A1A1A] hover:bg-[#E8F9F5] hover:border-[#2EBE76] transition-all"
                        >
                            <Download className="w-5 h-5" />
                            Export
                        </button>
                    )}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="mt-4 p-4 bg-[#F7FDFC] border border-[#2EBE76] rounded-xl space-y-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-[#1A1A1A]">Filter Options</h3>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center gap-1 text-sm text-[#6C757D] hover:text-[#2EBE76] transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Clear All
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                    Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="healthy">Healthy</option>
                                    <option value="low">Low Stock</option>
                                    <option value="critical">Critical</option>
                                    <option value="expiring">Expiring Soon</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                    Category
                                </label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                >
                                    <option value="">All Categories</option>
                                    {allCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-sm text-[#6C757D]">
                                    Showing <span className="font-semibold text-[#2EBE76]">{medicines.length}</span> result{medicines.length !== 1 ? 's' : ''}
                                    {statusFilter && <span> with status <span className="font-semibold">{statusFilter}</span></span>}
                                    {categoryFilter && <span> in category <span className="font-semibold">{categoryFilter}</span></span>}
                                    {searchTerm && <span> matching <span className="font-semibold">"{searchTerm}"</span></span>}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Medicine Name</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Category</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Stock Level</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Expiry Date</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Supplier</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Consumption</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Status</th>
                                <th className="text-left py-4 px-4 text-sm font-semibold text-[#1A1A1A]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[#6C757D]">Loading...</td>
                                </tr>
                            ) : medicines.length > 0 ? (
                                medicines.map((medicine) => {
                                    const status = statusStyles[medicine.status as keyof typeof statusStyles] || statusStyles.healthy;
                                    const expiryDisplay = medicine.expiry
                                        ? new Date(medicine.expiry).toLocaleDateString()
                                        : '—';
                                    return (
                                        <tr key={medicine._id} className="border-b border-gray-50 hover:bg-[#F7FDFC] transition-colors">
                                            <td className="py-4 px-4">
                                                <p className="font-semibold text-[#1A1A1A] text-sm">{medicine.name}</p>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm text-[#6C757D] font-secondary">{medicine.category}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div>
                                                    <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{medicine.stock} units</p>
                                                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                                                        <div
                                                            className={`h-full rounded-full ${medicine.stock < medicine.minStock ? 'bg-red-500' : 'bg-[#2EBE76]'}`}
                                                            style={{ width: `${Math.min((medicine.stock / (medicine.minStock || 1)) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm text-[#6C757D] font-secondary">{expiryDisplay}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm text-[#6C757D] font-secondary">{medicine.supplier}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="text-sm font-medium text-[#1A1A1A]">{medicine.consumption}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleViewMedicine(medicine)}
                                                        className="p-2 hover:bg-[#E8F9F5] rounded-lg transition-colors group"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4 text-[#6C757D] group-hover:text-[#2EBE76]" />
                                                    </button>
                                                    {permissions.canDo('editMedicine') && (
                                                        <button
                                                            onClick={() => handleEditMedicine(medicine)}
                                                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                                            title="Edit Medicine"
                                                        >
                                                            <Edit2 className="w-4 h-4 text-[#6C757D] group-hover:text-blue-600" />
                                                        </button>
                                                    )}
                                                    {permissions.canDo('deleteMedicine') && (
                                                        <button
                                                            onClick={() => handleDeleteMedicine(medicine._id, medicine.name)}
                                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                            title="Delete Medicine"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-[#6C757D] group-hover:text-red-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Search className="w-12 h-12 text-gray-300" />
                                            <p className="text-lg font-semibold text-[#1A1A1A]">No medicines found</p>
                                            <p className="text-sm text-[#6C757D]">Try adjusting your search or add a new medicine</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddMedicineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMedicine}
            />

            <EditMedicineModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedMedicine(null);
                }}
                onUpdate={handleUpdateMedicine}
                medicine={selectedMedicine}
            />

            <ViewMedicineModal
                isOpen={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedMedicine(null);
                }}
                medicine={selectedMedicine}
            />

            <ExportReportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onExport={() => {
                    // Export handled inside the modal
                    setIsExportModalOpen(false);
                }}
            />
        </div>
    );
}
