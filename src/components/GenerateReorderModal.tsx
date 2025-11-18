import { useState } from 'react';
import { X, RefreshCw, AlertTriangle, Package } from 'lucide-react';

interface GenerateReorderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (reorderData: ReorderData) => void;
}

export interface ReorderData {
    medicines: ReorderMedicine[];
    totalItems: number;
    estimatedCost: number;
}

interface ReorderMedicine {
    name: string;
    currentStock: number;
    minStock: number;
    reorderQty: number;
    supplier: string;
    unitPrice: number;
}

export default function GenerateReorderModal({ isOpen, onClose, onGenerate }: GenerateReorderModalProps) {
    const lowStockMedicines: ReorderMedicine[] = [
        {
            name: 'Ibuprofen 400mg',
            currentStock: 95,
            minStock: 150,
            reorderQty: 200,
            supplier: 'PharmaDirect',
            unitPrice: 0.25,
        },
        {
            name: 'Aspirin 75mg',
            currentStock: 45,
            minStock: 100,
            reorderQty: 150,
            supplier: 'HealthPlus',
            unitPrice: 0.15,
        },
        {
            name: 'Amoxicillin 500mg',
            currentStock: 85,
            minStock: 150,
            reorderQty: 200,
            supplier: 'MedSupply Co.',
            unitPrice: 0.45,
        },
    ];

    const [selectedMedicines, setSelectedMedicines] = useState<string[]>(
        lowStockMedicines.map(m => m.name)
    );

    const handleToggleMedicine = (medicineName: string) => {
        if (selectedMedicines.includes(medicineName)) {
            setSelectedMedicines(selectedMedicines.filter(name => name !== medicineName));
        } else {
            setSelectedMedicines([...selectedMedicines, medicineName]);
        }
    };

    const handleGenerate = () => {
        const selectedItems = lowStockMedicines.filter(m => selectedMedicines.includes(m.name));
        const totalCost = selectedItems.reduce((sum, m) => sum + (m.reorderQty * m.unitPrice), 0);

        onGenerate({
            medicines: selectedItems,
            totalItems: selectedItems.length,
            estimatedCost: totalCost,
        });
        onClose();
    };

    const totalCost = lowStockMedicines
        .filter(m => selectedMedicines.includes(m.name))
        .reduce((sum, m) => sum + (m.reorderQty * m.unitPrice), 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                            <RefreshCw className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Generate Reorder</h2>
                            <p className="text-white text-opacity-90 text-sm font-secondary">
                                Review and generate purchase orders
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
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-orange-900">
                                {lowStockMedicines.length} medicines below minimum stock level
                            </p>
                            <p className="text-sm text-orange-700 mt-1">
                                Review the suggested reorder quantities and select items to include in the purchase order.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {lowStockMedicines.map((medicine) => (
                            <div
                                key={medicine.name}
                                className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                                    selectedMedicines.includes(medicine.name)
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-orange-300'
                                }`}
                                onClick={() => handleToggleMedicine(medicine.name)}
                            >
                                <div className="flex items-start gap-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedMedicines.includes(medicine.name)}
                                        onChange={() => handleToggleMedicine(medicine.name)}
                                        className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-[#1A1A1A]">{medicine.name}</h3>
                                                <p className="text-sm text-[#6C757D] font-secondary">
                                                    Supplier: {medicine.supplier}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-[#6C757D]">Total Cost</p>
                                                <p className="text-lg font-bold text-orange-600">
                                                    ${(medicine.reorderQty * medicine.unitPrice).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-[#6C757D] mb-1">Current Stock</p>
                                                <p className="text-sm font-bold text-red-600">{medicine.currentStock}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-[#6C757D] mb-1">Min Stock</p>
                                                <p className="text-sm font-bold text-[#1A1A1A]">{medicine.minStock}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-[#6C757D] mb-1">Reorder Qty</p>
                                                <p className="text-sm font-bold text-orange-600">{medicine.reorderQty}</p>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                <p className="text-xs text-[#6C757D] mb-1">Unit Price</p>
                                                <p className="text-sm font-bold text-[#1A1A1A]">${medicine.unitPrice}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Package className="w-6 h-6 text-orange-600" />
                                <h3 className="text-lg font-semibold text-[#1A1A1A]">Order Summary</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-[#6C757D] mb-1">Selected Items</p>
                                <p className="text-2xl font-bold text-[#1A1A1A]">{selectedMedicines.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[#6C757D] mb-1">Estimated Total</p>
                                <p className="text-2xl font-bold text-orange-600">${totalCost.toFixed(2)}</p>
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
                        onClick={handleGenerate}
                        disabled={selectedMedicines.length === 0}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Generate Purchase Order
                    </button>
                </div>
            </div>
        </div>
    );
}

