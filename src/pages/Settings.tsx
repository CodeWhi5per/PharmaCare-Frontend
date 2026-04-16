/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { User, Bell, Shield, Database, Mail, Save } from 'lucide-react';
import { settingsAPI } from '../services/api';

export default function Settings() {
    const [profile, setProfile] = useState({ name: '', email: '', phone: '', role: '' });
    const [notifications, setNotifications] = useState({
        lowStockAlerts: true, expiryWarnings: true, autoReorderUpdates: true,
        supplierMessages: false, dailySummaryReports: true,
    });
    const [thresholds, setThresholds] = useState({
        criticalStockPercent: 20, lowStockPercent: 40, expiryWarningDays: 30, autoReorderBuffer: 150,
    });
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        settingsAPI.getProfile().then((res) => {
            const u = res.data;
            setProfile({ name: u.name || '', email: u.email || '', phone: u.phone || '', role: u.role || '' });
            if (u.notificationPreferences) setNotifications(u.notificationPreferences);
            if (u.inventoryThresholds) setThresholds(u.inventoryThresholds);
        }).catch(console.error);
    }, []);

    const handleSaveAll = async () => {
        setSaving(true);
        setMessage('');
        try {
            await settingsAPI.updateProfile(profile);
            await settingsAPI.updateNotifications(notifications);
            await settingsAPI.updateThresholds(thresholds);
            if (passwords.currentPassword && passwords.newPassword) {
                await settingsAPI.changePassword(passwords.currentPassword, passwords.newPassword);
                setPasswords({ currentPassword: '', newPassword: '' });
            }
            setMessage('All changes saved successfully!');
        } catch (err: any) {
            setMessage(err.message || 'Failed to save changes');
        } finally {
            setSaving(false);
        }
    };

    const notifLabels = [
        { key: 'lowStockAlerts', label: 'Low Stock Alerts', description: 'Get notified when items reach minimum threshold' },
        { key: 'expiryWarnings', label: 'Expiry Warnings', description: 'Alerts for medicines nearing expiration' },
        { key: 'autoReorderUpdates', label: 'Auto-Reorder Updates', description: 'Notifications for automatic reorder status' },
        { key: 'supplierMessages', label: 'Supplier Messages', description: 'Communications from suppliers' },
        { key: 'dailySummaryReports', label: 'Daily Summary Reports', description: 'Email digest of daily activities' },
    ];

    const profileFields = [
        { label: 'Full Name', key: 'name', type: 'text' },
        { label: 'Role', key: 'role', type: 'text' },
        { label: 'Email', key: 'email', type: 'email' },
        { label: 'Phone', key: 'phone', type: 'tel' },
    ];

    const thresholdFields = [
        { label: 'Critical Stock Level (%)', key: 'criticalStockPercent' },
        { label: 'Low Stock Level (%)', key: 'lowStockPercent' },
        { label: 'Expiry Warning (days)', key: 'expiryWarningDays' },
        { label: 'Auto-Reorder Buffer (%)', key: 'autoReorderBuffer' },
    ];

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#1A1A1A] mb-2">Settings</h1>
                <p className="text-[#6C757D]">Manage your account and system preferences</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Profile */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl"><User className="w-5 h-5 text-[#2EBE76]" /></div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Profile Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {profileFields.map(({ label, key, type }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{label}</label>
                                    <input type={type} value={(profile as any)[key]} onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl"><Bell className="w-5 h-5 text-[#2EBE76]" /></div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Notification Preferences</h2>
                        </div>
                        <div className="space-y-4">
                            {notifLabels.map(({ key, label, description }) => (
                                <div key={key} className="flex items-center justify-between p-4 rounded-xl hover:bg-[#F7FDFC] transition-all">
                                    <div>
                                        <p className="font-medium text-[#1A1A1A] mb-1">{label}</p>
                                        <p className="text-sm text-[#6C757D]">{description}</p>
                                    </div>
                                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                                        <input type="checkbox" checked={(notifications as any)[key]} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} className="sr-only peer" />
                                        <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#2EBE76] rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#2EBE76] peer-checked:to-[#0BAF8C]"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Thresholds */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl"><Database className="w-5 h-5 text-[#2EBE76]" /></div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Inventory Thresholds</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {thresholdFields.map(({ label, key }) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{label}</label>
                                    <input type="number" value={(thresholds as any)[key]} onChange={(e) => setThresholds({ ...thresholds, [key]: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Security */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[#E8F9F5] rounded-xl"><Shield className="w-5 h-5 text-[#2EBE76]" /></div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Change Password</h2>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Current Password</label>
                                <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">New Password</label>
                                <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-[#E8F9F5] to-[#F7FDFC] rounded-2xl p-6 border border-[#2EBE76]/10">
                        <Mail className="w-8 h-8 text-[#2EBE76] mb-4" />
                        <h3 className="font-semibold text-[#1A1A1A] mb-2">Need Help?</h3>
                        <p className="text-sm text-[#6C757D] mb-4">Our support team is available 24/7 to assist you.</p>
                        <button className="w-full bg-white text-[#2EBE76] py-2.5 rounded-xl font-medium hover:shadow-md transition-all">Contact Support</button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm font-medium ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>
                    )}

                    <button onClick={handleSaveAll} disabled={saving}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                        <Save className="w-5 h-5" />
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}
