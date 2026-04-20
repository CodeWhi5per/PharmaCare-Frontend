/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X, Building2 } from 'lucide-react';

export interface SupplierFormData {
    name: string;
    contact: string;
    email: string;
    phone: string;
    location: string;
    rating: number;
    responseTime: string;
    reliability: number;
}

interface AddSupplierModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: SupplierFormData) => Promise<void>;
}

export default function AddSupplierModal({ isOpen, onClose, onAdd }: AddSupplierModalProps) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.email || !formData.phone) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await onAdd(formData);
            setFormData({
                name: '',
                contact: '',
                email: '',
                phone: '',
                location: '',
                rating: 0,
                responseTime: '24h',
                reliability: 85,
            });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to add supplier');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1A1A1A]">Add New Supplier</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-[#6C757D]" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                            {error}
                        </div>
                    )}

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
                                placeholder="Enter supplier name"
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
                                placeholder="Contact person name"
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
                                placeholder="email@example.com"
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
                                placeholder="+1 (555) 000-0000"
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
                                placeholder="City, Country"
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
                                placeholder="4.5"
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
                                placeholder="85"
                                className="w-full px-4 py-3 bg-[#F7FDFC] border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
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
                            {loading ? 'Adding...' : 'Add Supplier'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

