import { User, Bell, Shield, Database, Mail, Save } from 'lucide-react';

export default function Settings() {
    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Settings</h1>
                <p className="text-[#6C757D]">Manage your account and system preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl">
                                <User className="w-5 h-5 text-[#2EBE76]" />
                            </div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Profile Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Full Name</label>
                                <input
                                    type="text"
                                    defaultValue="Dr. Sarah Johnson"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Role</label>
                                <input
                                    type="text"
                                    defaultValue="Pharmacy Manager"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email</label>
                                <input
                                    type="email"
                                    defaultValue="sarah.johnson@pharmacare.com"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Phone</label>
                                <input
                                    type="tel"
                                    defaultValue="+1 (555) 987-6543"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl">
                                <Bell className="w-5 h-5 text-[#2EBE76]" />
                            </div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Notification Preferences</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'Low Stock Alerts', description: 'Get notified when items reach minimum threshold', enabled: true },
                                { label: 'Expiry Warnings', description: 'Alerts for medicines nearing expiration', enabled: true },
                                { label: 'Auto-Reorder Updates', description: 'Notifications for automatic reorder status', enabled: true },
                                { label: 'Supplier Messages', description: 'Communications from suppliers', enabled: false },
                                { label: 'Daily Summary Reports', description: 'Email digest of daily activities', enabled: true },
                            ].map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F7FDFC] transition-all">
                                    <div>
                                        <p className="font-medium text-[#1A1A1A] mb-1">{item.label}</p>
                                        <p className="text-sm text-[#6C757D]">{item.description}</p>
                                    </div>
                                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                                        <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2EBE76] rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#2EBE76] peer-checked:to-[#0BAF8C]"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl">
                                <Database className="w-5 h-5 text-[#2EBE76]" />
                            </div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Inventory Thresholds</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Critical Stock Level (%)</label>
                                <input
                                    type="number"
                                    defaultValue="20"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Low Stock Level (%)</label>
                                <input
                                    type="number"
                                    defaultValue="40"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Expiry Warning (days)</label>
                                <input
                                    type="number"
                                    defaultValue="30"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Auto-Reorder Buffer (%)</label>
                                <input
                                    type="number"
                                    defaultValue="150"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl">
                                <Shield className="w-5 h-5 text-[#2EBE76]" />
                            </div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Security</h2>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F7FDFC] transition-all">
                                <p className="font-medium text-[#1A1A1A] mb-1">Change Password</p>
                                <p className="text-xs text-[#6C757D]">Update your password regularly</p>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F7FDFC] transition-all">
                                <p className="font-medium text-[#1A1A1A] mb-1">Two-Factor Auth</p>
                                <p className="text-xs text-[#6C757D]">Add extra security layer</p>
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-[#F7FDFC] transition-all">
                                <p className="font-medium text-[#1A1A1A] mb-1">Active Sessions</p>
                                <p className="text-xs text-[#6C757D]">Manage logged in devices</p>
                            </button>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#E8F9F5] to-[#F7FDFC] rounded-2xl p-6 border border-[#2EBE76]/10">
                        <Mail className="w-8 h-8 text-[#2EBE76] mb-4" />
                        <h3 className="font-semibold text-[#1A1A1A] mb-2">Need Help?</h3>
                        <p className="text-sm text-[#6C757D] mb-4">
                            Our support team is available 24/7 to assist you with any questions or issues.
                        </p>
                        <button className="w-full bg-white text-[#2EBE76] py-2.5 rounded-xl font-medium hover:shadow-md transition-all">
                            Contact Support
                        </button>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all">
                        <Save className="w-5 h-5" />
                        Save All Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
