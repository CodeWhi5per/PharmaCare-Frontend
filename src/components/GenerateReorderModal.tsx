import { useState, useEffect } from 'react';
import { X, RefreshCw, AlertTriangle, Package, Loader2 } from 'lucide-react';
import { inventoryAPI } from '../services/api';

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
    id: string;
    name: string;
    currentStock: number;
    minStock: number;
    reorderQty: number;
    supplier: string;
    unitPrice: number;
}

export default function GenerateReorderModal({ isOpen, onClose, onGenerate }: GenerateReorderModalProps) {
    const [lowStockMedicines, setLowStockMedicines] = useState<ReorderMedicine[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [reorderQuantities, setReorderQuantities] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        setLoading(true);
        // Use the dedicated low-stock endpoint
        inventoryAPI.getLowStock()
            .then((res) => {
                const items: ReorderMedicine[] = res.data || [];
                setLowStockMedicines(items);
                setSelectedIds(items.map(m => m.id));

                // Initialize reorder quantities
                const quantities: Record<string, number> = {};
                items.forEach((m) => {
                    quantities[m.id] = m.reorderQty;
                });
                setReorderQuantities(quantities);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [isOpen]);

    const handleToggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleQuantityChange = (id: string, value: string) => {
        const qty = parseInt(value) || 0;
        setReorderQuantities(prev => ({
            ...prev,
            [id]: Math.max(0, qty)
        }));
    };

    const selectedItems = lowStockMedicines.filter(m => selectedIds.includes(m.id));
    const totalCost = selectedItems.reduce(
        (sum, m) => sum + (reorderQuantities[m.id] || m.reorderQty) * m.unitPrice,
        0
    );

    const handleGenerate = async () => {
        if (selectedItems.length === 0) return;
        setGenerating(true);
        try {
            // Use bulk reorder endpoint
            const medicines = selectedItems.map(m => ({
                id: m.id,
                quantity: reorderQuantities[m.id] || m.reorderQty
            }));
            await inventoryAPI.bulkReorder(medicines);

            const finalItems = selectedItems.map(m => ({
                ...m,
                reorderQty: reorderQuantities[m.id] || m.reorderQty
            }));

            onGenerate({
                medicines: finalItems,
                totalItems: finalItems.length,
                estimatedCost: totalCost
            });
            onClose();
        } catch (err) {
            console.error(err);
            alert('Failed to generate reorder. Please try again.');
        } finally {
            setGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
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
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-3">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                            <p className="text-[#6C757D]">Loading low stock medicines…</p>
                        </div>
                    ) : lowStockMedicines.length === 0 ? (
                        <div className="text-center py-16">
                            <Package className="w-12 h-12 text-[#2EBE76] mx-auto mb-3" />
                            <p className="text-lg font-semibold text-[#1A1A1A]">All stocks are sufficient!</p>
                            <p className="text-sm text-[#6C757D] mt-1">
                                No medicines currently below minimum stock level.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-orange-900">
                                        {lowStockMedicines.length} medicine
                                        {lowStockMedicines.length > 1 ? 's' : ''} below minimum stock level
                                    </p>
                                    <p className="text-sm text-orange-700 mt-1">
                                        Review suggested reorder quantities and select items for the purchase order.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {lowStockMedicines.map((medicine) => (
                                    <div
                                        key={medicine.id}
                                        onClick={() => handleToggle(medicine.id)}
                                        className={`border-2 rounded-xl p-4 transition-all cursor-pointer ${
                                            selectedIds.includes(medicine.id)
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-orange-300'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(medicine.id)}
                                                onChange={() => handleToggle(medicine.id)}
                                                onClick={e => e.stopPropagation()}
                                                className="mt-1 w-5 h-5 text-orange-600 rounded focus:ring-orange-500 flex-shrink-0"
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
                                                        <p className="text-sm text-[#6C757D]">Est. Cost</p>
                                                        <p className="text-lg font-bold text-orange-600">
                                                            ${((reorderQuantities[medicine.id] || medicine.reorderQty) * medicine.unitPrice).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-4 gap-3">
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
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={reorderQuantities[medicine.id] || medicine.reorderQty}
                                                            onChange={(e) => handleQuantityChange(medicine.id, e.target.value)}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="w-full text-sm font-bold text-orange-600 bg-transparent border-0 p-0 focus:ring-0 focus:outline-none"
                                                        />
                                                    </div>
                                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <p className="text-xs text-[#6C757D] mb-1">Unit Price</p>
                                                        <p className="text-sm font-bold text-[#1A1A1A]">${medicine.unitPrice.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                                <div className="flex items-center gap-3 mb-4">
                                    <Package className="w-6 h-6 text-orange-600" />
                                    <h3 className="text-lg font-semibold text-[#1A1A1A]">Order Summary</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-[#6C757D] mb-1">Selected Items</p>
                                        <p className="text-2xl font-bold text-[#1A1A1A]">{selectedItems.length}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-[#6C757D] mb-1">Estimated Total</p>
                                        <p className="text-2xl font-bold text-orange-600">${totalCost.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
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
                        disabled={generating || selectedItems.length === 0}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        {generating ? 'Generating…' : `Generate Order (${selectedItems.length})`}
                    </button>
                </div>
            </div>
        </div>
    );
}

