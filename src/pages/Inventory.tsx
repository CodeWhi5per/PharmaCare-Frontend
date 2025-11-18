import { useState } from 'react';
import { Search, Filter, Download, Plus, Eye } from 'lucide-react';
import AddMedicineModal, { MedicineFormData } from '../components/AddMedicineModal';

export default function Inventory() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [medicines, setMedicines] = useState([
        {
            id: 1,
            name: 'Paracetamol 500mg',
            category: 'Pain Relief',
            stock: 450,
            minStock: 200,
            expiry: '2025-08-15',
            supplier: 'MedSupply Co.',
            consumption: '12/day',
            status: 'healthy',
        },
        {
            id: 2,
            name: 'Ibuprofen 400mg',
            category: 'Anti-inflammatory',
            stock: 95,
            minStock: 150,
            expiry: '2025-06-20',
            supplier: 'PharmaDirect',
            consumption: '8/day',
            status: 'low',
        },
        {
            id: 3,
            name: 'Aspirin 75mg',
            category: 'Cardiovascular',
            stock: 45,
            minStock: 100,
            expiry: '2025-03-10',
            supplier: 'HealthPlus',
            consumption: '15/day',
            status: 'critical',
        },
        {
            id: 4,
            name: 'Amoxicillin 500mg',
            category: 'Antibiotic',
            stock: 280,
            minStock: 150,
            expiry: '2025-02-28',
            supplier: 'MedSupply Co.',
            consumption: '6/day',
            status: 'expiring',
        },
        {
            id: 5,
            name: 'Metformin 850mg',
            category: 'Diabetes',
            stock: 620,
            minStock: 300,
            expiry: '2026-01-15',
            supplier: 'PharmaDirect',
            consumption: '10/day',
            status: 'healthy',
        },
    ]);

    const handleAddMedicine = (medicineData: MedicineFormData) => {
        const newMedicine = {
            id: medicines.length + 1,
            name: medicineData.name,
            category: medicineData.category,
            stock: medicineData.stock,
            minStock: medicineData.minStock,
            expiry: medicineData.expiry,
            supplier: medicineData.supplier,
            consumption: medicineData.consumption,
            status: medicineData.stock < medicineData.minStock
                ? (medicineData.stock < medicineData.minStock * 0.5 ? 'critical' : 'low')
                : 'healthy',
        };
        setMedicines([...medicines, newMedicine]);
    };

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
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Add Medicine
                </button>
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
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#F7FDFC] border border-gray-100 rounded-xl font-medium text-[#1A1A1A] hover:bg-[#E8F9F5] hover:border-[#2EBE76] transition-all">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#F7FDFC] border border-gray-100 rounded-xl font-medium text-[#1A1A1A] hover:bg-[#E8F9F5] hover:border-[#2EBE76] transition-all">
                        <Download className="w-5 h-5" />
                        Export
                    </button>
                </div>

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
                        {medicines.map((medicine) => {
                            const status = statusStyles[medicine.status as keyof typeof statusStyles];
                            return (
                                <tr key={medicine.id} className="border-b border-gray-50 hover:bg-[#F7FDFC] transition-colors">
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
                                                    style={{ width: `${Math.min((medicine.stock / medicine.minStock) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-sm text-[#6C757D] font-secondary">{medicine.expiry}</span>
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
                                        <button className="p-2 hover:bg-[#E8F9F5] rounded-lg transition-colors">
                                            <Eye className="w-4 h-4 text-[#6C757D]" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddMedicineModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddMedicine}
            />
        </div>
    );
}
