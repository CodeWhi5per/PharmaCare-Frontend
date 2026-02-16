import { useState } from 'react';
import { X, Plus, Calendar } from 'lucide-react';

interface AddMedicineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (medicine: MedicineFormData) => void;
}

export interface MedicineFormData {
    name: string;
    category: string;
    stock: number;
    minStock: number;
    expiry: string;
    supplier: string;
    consumption: string;
    batchNumber: string;
    unitPrice: number;
}

export default function AddMedicineModal({ isOpen, onClose, onAdd }: AddMedicineModalProps) {
    const [formData, setFormData] = useState<MedicineFormData>({
        name: '',
        category: '',
        stock: 0,
        minStock: 0,
        expiry: '',
        supplier: '',
        consumption: '',
        batchNumber: '',
        unitPrice: 0,
    });

    const categories = [
        'Pain Relief',
        'Anti-inflammatory',
        'Cardiovascular',
        'Antibiotic',
        'Diabetes',
        'Respiratory',
        'Gastrointestinal',
        'Neurological',
        'Vitamins & Supplements',
        'Other',
    ];

    const suppliers = [
        'MedSupply Co.',
        'PharmaDirect',
        'HealthPlus',
        'MediCare Distributors',
        'Global Pharma',
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            name: '',
            category: '',
            stock: 0,
            minStock: 0,
            expiry: '',
            supplier: '',
            consumption: '',
            batchNumber: '',
            unitPrice: 0,
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Add New Medicine</h2>
                            <p className="text-white text-opacity-90 text-sm font-secondary">Fill in the details below</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Medicine Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Paracetamol 500mg"
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            >
                                <option value="">Select Category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Supplier <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map((sup) => (
                                    <option key={sup} value={sup}>
                                        {sup}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Stock Quantity <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Minimum Stock Level <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                value={formData.minStock}
                                onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                                placeholder="0"
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Expiry Date <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                <input
                                    type="date"
                                    required
                                    value={formData.expiry}
                                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                                    className="w-full pl-12 pr-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Batch Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.batchNumber}
                                onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                                placeholder="e.g., BATCH-2024-001"
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Daily Consumption Rate <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.consumption}
                                onChange={(e) => setFormData({ ...formData, consumption: e.target.value })}
                                placeholder="e.g., 10/day"
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                Unit Price ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={formData.unitPrice}
                                onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-6 py-3 bg-gray-100 text-[#1A1A1A] rounded-xl font-semibold hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-5 h-5" />
                            Add Medicine
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

