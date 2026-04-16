/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Search, Mail, Phone, MapPin, TrendingUp, Package, Plus } from 'lucide-react';
import { suppliersAPI } from '../services/api';

export default function Suppliers() {
    const [search, setSearch] = useState('');
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [communications, setCommunications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSuppliers = async (q = '') => {
        try {
            setLoading(true);
            const res = await suppliersAPI.getAll(q);
            setSuppliers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComms = async () => {
        try {
            const res = await suppliersAPI.getCommunications();
            setCommunications(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { fetchSuppliers(); fetchComms(); }, []);

    useEffect(() => {
        const t = setTimeout(() => fetchSuppliers(search), 400);
        return () => clearTimeout(t);
    }, [search]);

    const timeAgo = (date: string) => {
        const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Supplier Integration</h1>
                    <p className="text-[#6C757D]">Manage supplier relationships and track orders</p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">
                    <Plus className="w-5 h-5" />
                    Add Supplier
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search suppliers by name, location, or contact..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                />
            </div>

            {loading ? (
                <div className="text-center py-12 text-[#6C757D]">Loading suppliers...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {suppliers.map((supplier) => (
                        <div key={supplier._id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl flex items-center justify-center">
                                        <Package className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[#1A1A1A]">{supplier.name}</h3>
                                        <p className="text-xs text-[#6C757D]">{supplier.contact}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded-lg">
                                    <TrendingUp className="w-3 h-3 text-green-600" />
                                    <span className="text-xs font-semibold text-green-600">{supplier.rating}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                    <Mail className="w-4 h-4" /><span>{supplier.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                    <Phone className="w-4 h-4" /><span>{supplier.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                    <MapPin className="w-4 h-4" /><span>{supplier.location}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-[#F7FDFC] rounded-xl p-3">
                                    <p className="text-xs text-[#6C757D] mb-1">Active Orders</p>
                                    <p className="text-xl font-bold text-[#1A1A1A]">{supplier.activeOrders}</p>
                                </div>
                                <div className="bg-[#F7FDFC] rounded-xl p-3">
                                    <p className="text-xs text-[#6C757D] mb-1">Total Orders</p>
                                    <p className="text-xl font-bold text-[#1A1A1A]">{supplier.totalOrders}</p>
                                </div>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#6C757D]">Reliability</span>
                                    <span className="font-semibold text-[#1A1A1A]">{supplier.reliability}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-[#2EBE76] to-[#21D6C3] h-full rounded-full"
                                        style={{ width: `${supplier.reliability}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div>
                                    <p className="text-xs text-[#6C757D]">Avg. Response</p>
                                    <p className="text-sm font-semibold text-[#1A1A1A]">{supplier.responseTime}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 bg-[#F7FDFC] text-[#2EBE76] rounded-lg text-sm font-medium hover:bg-[#E8F9F5] transition-all">Contact</button>
                                    <button className="px-4 py-2 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-lg text-sm font-medium hover:shadow-md transition-all">Order</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Communications</h2>
                <div className="space-y-4">
                    {communications.map((comm) => (
                        <div key={comm._id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F7FDFC] transition-all">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                comm.type === 'success' ? 'bg-green-500' : comm.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{comm.supplier}</p>
                                <p className="text-sm text-[#6C757D] mb-1">{comm.message}</p>
                                <p className="text-xs text-[#6C757D]">{timeAgo(comm.createdAt)}</p>
                            </div>
                        </div>
                    ))}
                    {communications.length === 0 && (
                        <p className="text-sm text-[#6C757D] text-center py-4">No communications yet</p>
                    )}
                </div>
            </div>
        </div>
    );
}
