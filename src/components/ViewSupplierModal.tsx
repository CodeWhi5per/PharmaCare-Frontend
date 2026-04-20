/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { X, Building2, Mail, Phone, MapPin, TrendingUp, Edit2, Trash2, MessageSquare, ShoppingCart } from 'lucide-react';
import { SupplierFormData } from './AddSupplierModal';

interface ViewSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: any;
    onUpdate: (id: string, data: SupplierFormData) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onContact: (supplier: any) => void;
    onOrder: (supplier: any) => void;
}

export default function ViewSupplierModal({
    isOpen,
    onClose,
    supplier,
    onUpdate,
    onDelete,
    onContact,
    onOrder,
}: ViewSupplierModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<SupplierFormData>({
        name: '',
        contact: '',
        email: '',
        phone: '',
        location: '',
        rating: 0,
        responseTime: '24h',
        reliability: 85,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name || '',
                contact: supplier.contact || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                location: supplier.location || '',
                rating: supplier.rating || 0,
                responseTime: supplier.responseTime || '24h',
                reliability: supplier.reliability || 85,
            });
        }
    }, [supplier]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.phone) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await onUpdate(supplier._id, formData);
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message || 'Failed to update supplier');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setLoading(true);
            await onDelete(supplier._id);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to delete supplier');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    if (!isOpen || !supplier) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-[#1A1A1A]">
                                    {isEditing ? 'Edit Supplier' : 'Supplier Details'}
                                </h2>
                                <p className="text-sm text-[#6C757D]">{supplier.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-[#6C757D]" />
                        </button>
                    </div>

                    {!isEditing && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onContact(supplier)}
                                className="flex items-center gap-2 px-4 py-2 bg-[#F7FDFC] text-[#2EBE76] rounded-lg text-sm font-medium hover:bg-[#E8F9F5] transition-all"
                            >
                                <MessageSquare className="w-4 h-4" />
                                Contact
                            </button>
                            <button
                                onClick={() => onOrder(supplier)}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-lg text-sm font-medium hover:shadow-md transition-all"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Place Order
                            </button>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    {showDeleteConfirm && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                            <p className="text-sm font-semibold text-red-900 mb-3">
                                Are you sure you want to delete this supplier?
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    className="px-4 py-2 bg-white text-[#1A1A1A] rounded-lg text-sm font-medium hover:bg-gray-100 transition-all"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50"
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    )}

                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Supplier Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Contact Person
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Rating (0-5)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={formData.rating}
                                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Response Time
                                    </label>
                                    <select
                                        value={formData.responseTime}
                                        onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    >
                                        <option value="1h">1 hour</option>
                                        <option value="2h">2 hours</option>
                                        <option value="4h">4 hours</option>
                                        <option value="12h">12 hours</option>
                                        <option value="24h">24 hours</option>
                                        <option value="48h">48 hours</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                                        Reliability (%)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.reliability}
                                        onChange={(e) => setFormData({ ...formData, reliability: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            name: supplier.name || '',
                                            contact: supplier.contact || '',
                                            email: supplier.email || '',
                                            phone: supplier.phone || '',
                                            location: supplier.location || '',
                                            rating: supplier.rating || 0,
                                            responseTime: supplier.responseTime || '24h',
                                            reliability: supplier.reliability || 85,
                                        });
                                    }}
                                    className="flex-1 px-6 py-3 bg-gray-100 text-[#1A1A1A] rounded-xl font-semibold hover:bg-gray-200 transition-all"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Supplier'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#F7FDFC] rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Mail className="w-5 h-5 text-[#2EBE76]" />
                                        <p className="text-sm font-semibold text-[#1A1A1A]">Email</p>
                                    </div>
                                    <p className="text-[#6C757D]">{supplier.email}</p>
                                </div>

                                <div className="bg-[#F7FDFC] rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <Phone className="w-5 h-5 text-[#2EBE76]" />
                                        <p className="text-sm font-semibold text-[#1A1A1A]">Phone</p>
                                    </div>
                                    <p className="text-[#6C757D]">{supplier.phone}</p>
                                </div>

                                <div className="bg-[#F7FDFC] rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <MapPin className="w-5 h-5 text-[#2EBE76]" />
                                        <p className="text-sm font-semibold text-[#1A1A1A]">Location</p>
                                    </div>
                                    <p className="text-[#6C757D]">{supplier.location || 'Not specified'}</p>
                                </div>

                                <div className="bg-[#F7FDFC] rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <TrendingUp className="w-5 h-5 text-[#2EBE76]" />
                                        <p className="text-sm font-semibold text-[#1A1A1A]">Rating</p>
                                    </div>
                                    <p className="text-[#6C757D]">{supplier.rating}/5</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl p-4 text-white">
                                    <p className="text-sm opacity-90 mb-1">Active Orders</p>
                                    <p className="text-3xl font-bold">{supplier.activeOrders || 0}</p>
                                </div>
                                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                    <p className="text-sm opacity-90 mb-1">Total Orders</p>
                                    <p className="text-3xl font-bold">{supplier.totalOrders || 0}</p>
                                </div>
                            </div>

                            <div className="bg-[#F7FDFC] rounded-xl p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-sm font-semibold text-[#1A1A1A]">Reliability</p>
                                    <p className="text-lg font-bold text-[#2EBE76]">{supplier.reliability}%</p>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-[#2EBE76] to-[#21D6C3] h-full rounded-full transition-all"
                                        style={{ width: `${supplier.reliability}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between bg-[#F7FDFC] rounded-xl p-4">
                                <p className="text-sm font-semibold text-[#1A1A1A]">Average Response Time</p>
                                <p className="text-lg font-bold text-[#2EBE76]">{supplier.responseTime}</p>
                            </div>

                            {supplier.contact && (
                                <div className="bg-[#F7FDFC] rounded-xl p-4">
                                    <p className="text-sm font-semibold text-[#1A1A1A] mb-2">Contact Person</p>
                                    <p className="text-[#6C757D]">{supplier.contact}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

