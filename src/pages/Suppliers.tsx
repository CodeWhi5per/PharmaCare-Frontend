import { Search, Mail, Phone, MapPin, TrendingUp, Package } from 'lucide-react';

export default function Suppliers() {
    const suppliers = [
        {
            id: 1,
            name: 'MedSupply Co.',
            contact: 'John Anderson',
            email: 'john@medsupply.com',
            phone: '+1 (555) 123-4567',
            location: 'New York, NY',
            activeOrders: 5,
            totalOrders: 142,
            rating: 4.8,
            responseTime: '2 hours',
            reliability: 98,
        },
        {
            id: 2,
            name: 'PharmaDirect',
            contact: 'Sarah Mitchell',
            email: 'sarah@pharmadirect.com',
            phone: '+1 (555) 234-5678',
            location: 'Los Angeles, CA',
            activeOrders: 3,
            totalOrders: 98,
            rating: 4.6,
            responseTime: '4 hours',
            reliability: 95,
        },
        {
            id: 3,
            name: 'HealthPlus Distributors',
            contact: 'Michael Chen',
            email: 'michael@healthplus.com',
            phone: '+1 (555) 345-6789',
            location: 'Chicago, IL',
            activeOrders: 2,
            totalOrders: 76,
            rating: 4.9,
            responseTime: '1 hour',
            reliability: 99,
        },
    ];

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Supplier Integration</h1>
                    <p className="text-[#6C757D]">Manage supplier relationships and track orders</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">
                    Add Supplier
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search suppliers by name, location, or contact..."
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {suppliers.map((supplier) => (
                    <div
                        key={supplier.id}
                        className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
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
                                <Mail className="w-4 h-4" />
                                <span>{supplier.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                <Phone className="w-4 h-4" />
                                <span>{supplier.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-[#6C757D]">
                                <MapPin className="w-4 h-4" />
                                <span>{supplier.location}</span>
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
                                <button className="px-4 py-2 bg-[#F7FDFC] text-[#2EBE76] rounded-lg text-sm font-medium hover:bg-[#E8F9F5] transition-all">
                                    Contact
                                </button>
                                <button className="px-4 py-2 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-lg text-sm font-medium hover:shadow-md transition-all">
                                    Order
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Recent Communications</h2>
                <div className="space-y-4">
                    {[
                        {
                            supplier: 'MedSupply Co.',
                            message: 'Order #ORD-2847 confirmed. Expected delivery: Feb 25, 2025',
                            time: '2 hours ago',
                            type: 'success',
                        },
                        {
                            supplier: 'PharmaDirect',
                            message: 'Price update notification for Ibuprofen 400mg',
                            time: '5 hours ago',
                            type: 'info',
                        },
                        {
                            supplier: 'HealthPlus Distributors',
                            message: 'Shipment delayed by 1 day due to weather conditions',
                            time: '1 day ago',
                            type: 'warning',
                        },
                    ].map((comm, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F7FDFC] transition-all">
                            <div className={`w-2 h-2 rounded-full mt-2 ${
                                comm.type === 'success' ? 'bg-green-500' : comm.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                            }`}></div>
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-[#1A1A1A] mb-1">{comm.supplier}</p>
                                <p className="text-sm text-[#6C757D] mb-1">{comm.message}</p>
                                <p className="text-xs text-[#6C757D]">{comm.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
