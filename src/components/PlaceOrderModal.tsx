/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2, Package, AlertCircle, Loader2, Calendar } from 'lucide-react';
import { inventoryAPI, ordersAPI } from '../services/api';

interface PlaceOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: any;
    onSuccess: () => void;
}

interface OrderItem {
    medicineId: string;
    medicineName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export default function PlaceOrderModal({ isOpen, onClose, supplier, onSuccess }: PlaceOrderModalProps) {
    const [medicines, setMedicines] = useState<any[]>([]);
    const [selectedMedicines, setSelectedMedicines] = useState<OrderItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [notes, setNotes] = useState('');
    const [expectedDelivery, setExpectedDelivery] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isOpen) {
            // Reset form when modal closes
            setSelectedMedicines([]);
            setSearchTerm('');
            setNotes('');
            setExpectedDelivery('');
            setError('');
            return;
        }

        // Fetch all medicines
        setLoading(true);
        inventoryAPI.getAll()
            .then((res) => {
                setMedicines(res.data || []);
            })
            .catch((err) => {
                console.error('Failed to fetch medicines', err);
                setError('Failed to load medicines');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isOpen]);

    const filteredMedicines = medicines.filter((med) =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddMedicine = (medicine: any) => {
        // Check if already added
        if (selectedMedicines.find((item) => item.medicineId === medicine._id)) {
            return;
        }

        const newItem: OrderItem = {
            medicineId: medicine._id,
            medicineName: medicine.name,
            quantity: 1,
            unitPrice: medicine.unitPrice || 0,
            totalPrice: medicine.unitPrice || 0,
        };

        setSelectedMedicines([...selectedMedicines, newItem]);
    };

    const handleUpdateQuantity = (medicineId: string, delta: number) => {
        setSelectedMedicines((prev) =>
            prev.map((item) => {
                if (item.medicineId === medicineId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return {
                        ...item,
                        quantity: newQty,
                        totalPrice: newQty * item.unitPrice,
                    };
                }
                return item;
            })
        );
    };

    const handleUpdatePrice = (medicineId: string, price: number) => {
        setSelectedMedicines((prev) =>
            prev.map((item) => {
                if (item.medicineId === medicineId) {
                    return {
                        ...item,
                        unitPrice: price,
                        totalPrice: item.quantity * price,
                    };
                }
                return item;
            })
        );
    };

    const handleRemoveMedicine = (medicineId: string) => {
        setSelectedMedicines((prev) => prev.filter((item) => item.medicineId !== medicineId));
    };

    const totalAmount = selectedMedicines.reduce((sum, item) => sum + item.totalPrice, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (selectedMedicines.length === 0) {
            setError('Please add at least one medicine to the order');
            return;
        }

        if (!expectedDelivery) {
            setError('Please select an expected delivery date');
            return;
        }

        try {
            setSubmitting(true);
            await ordersAPI.create({
                supplierId: supplier._id,
                items: selectedMedicines,
                notes,
                expectedDelivery,
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 p-2 rounded-xl">
                            <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">Place Order</h2>
                            <p className="text-white text-opacity-90 text-sm">
                                Order from {supplier?.name}
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
                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-red-900">Error</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(90vh-350px)] overflow-y-auto">
                        {/* Left: Medicine Selection */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                    Search Medicines
                                </label>
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by name or category..."
                                    className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                />
                            </div>

                            <div className="bg-[#F7FDFC] rounded-xl p-4 max-h-[400px] overflow-y-auto">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                                        <Loader2 className="w-8 h-8 text-[#2EBE76] animate-spin" />
                                        <p className="text-sm text-[#6C757D]">Loading medicines...</p>
                                    </div>
                                ) : filteredMedicines.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Package className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
                                        <p className="text-sm text-[#6C757D]">No medicines found</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {filteredMedicines.map((medicine) => {
                                            const isAdded = selectedMedicines.find(
                                                (item) => item.medicineId === medicine._id
                                            );
                                            return (
                                                <button
                                                    key={medicine._id}
                                                    type="button"
                                                    onClick={() => handleAddMedicine(medicine)}
                                                    disabled={!!isAdded}
                                                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                                                        isAdded
                                                            ? 'border-[#2EBE76] bg-green-50 cursor-not-allowed'
                                                            : 'border-gray-200 hover:border-[#2EBE76] hover:bg-white'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="font-semibold text-[#1A1A1A]">
                                                                {medicine.name}
                                                            </p>
                                                            <p className="text-xs text-[#6C757D]">
                                                                {medicine.category} • Stock: {medicine.stock}
                                                            </p>
                                                        </div>
                                                        {isAdded ? (
                                                            <span className="text-xs font-semibold text-[#2EBE76]">
                                                                Added
                                                            </span>
                                                        ) : (
                                                            <Plus className="w-5 h-5 text-[#2EBE76]" />
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Order Details */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                    Order Items ({selectedMedicines.length})
                                </label>
                                <div className="bg-[#F7FDFC] rounded-xl p-4 max-h-[300px] overflow-y-auto space-y-3">
                                    {selectedMedicines.length === 0 ? (
                                        <div className="text-center py-8">
                                            <ShoppingCart className="w-12 h-12 text-[#6C757D] mx-auto mb-3" />
                                            <p className="text-sm text-[#6C757D]">No items added yet</p>
                                        </div>
                                    ) : (
                                        selectedMedicines.map((item) => (
                                            <div
                                                key={item.medicineId}
                                                className="bg-white rounded-xl p-3 border border-gray-200"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <p className="font-semibold text-[#1A1A1A] text-sm">
                                                        {item.medicineName}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMedicine(item.medicineId)}
                                                        className="text-red-500 hover:text-red-700 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div>
                                                        <label className="text-xs text-[#6C757D] mb-1 block">
                                                            Quantity
                                                        </label>
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateQuantity(item.medicineId, -1)
                                                                }
                                                                className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                                            >
                                                                <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="text-sm font-semibold text-center flex-1">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUpdateQuantity(item.medicineId, 1)
                                                                }
                                                                className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-[#6C757D] mb-1 block">
                                                            Unit Price ($)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            value={item.unitPrice}
                                                            onChange={(e) =>
                                                                handleUpdatePrice(
                                                                    item.medicineId,
                                                                    parseFloat(e.target.value) || 0
                                                                )
                                                            }
                                                            className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#2EBE76]"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-[#6C757D] mb-1 block">
                                                            Total
                                                        </label>
                                                        <p className="text-sm font-bold text-[#2EBE76] py-1">
                                                            ${item.totalPrice.toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                    Expected Delivery Date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                    <input
                                        type="date"
                                        required
                                        value={expectedDelivery}
                                        onChange={(e) => setExpectedDelivery(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full pl-12 pr-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                    Notes (Optional)
                                </label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any special instructions or notes..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all resize-none"
                                />
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl p-4 text-white">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm opacity-90">Total Items:</span>
                                    <span className="font-bold">{selectedMedicines.length}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm opacity-90">Total Amount:</span>
                                    <span className="text-2xl font-bold">${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-6 py-3 bg-gray-100 text-[#1A1A1A] rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || selectedMedicines.length === 0}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Placing Order...
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Place Order
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

