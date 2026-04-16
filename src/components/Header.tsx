import { Search, Bell, User, Settings, LogOut, UserCircle, Shield, HelpCircle, X, Mail, Phone, MessageCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    onLogout: () => void;
    onNavigate: (page: string) => void;
    user: { name?: string; email?: string; role?: string } | null;
}

export default function Header({ onLogout, onNavigate, user }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const displayName = user?.name || 'User';
    const displayEmail = user?.email || '';
    const displayRole = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : 'Staff';
    // Initials for avatar
    const initials = displayName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        onLogout();
    };

    const navigate = (page: string) => {
        setIsDropdownOpen(false);
        onNavigate(page);
    };

    return (
        <>
        <header className="bg-white border-b border-gray-100 px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search medicines, suppliers, orders..."
                            className="w-full pl-12 pr-4 py-2.5 bg-[#F7FDFC] border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 ml-6">
                    <button className="relative p-2.5 hover:bg-[#F7FDFC] rounded-xl transition-all">
                        <Bell className="w-5 h-5 text-[#6C757D]" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 pl-4 border-l border-gray-200 hover:bg-[#F7FDFC] px-3 py-2 rounded-xl transition-all"
                        >
                            <div className="text-right">
                                <p className="text-sm font-semibold text-[#1A1A1A]">{displayName}</p>
                                <p className="text-xs text-[#6C757D] font-secondary">{displayRole}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl flex items-center justify-center">
                                {initials ? (
                                    <span className="text-white text-sm font-bold">{initials}</span>
                                ) : (
                                    <User className="w-5 h-5 text-white" />
                                )}
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-[#1A1A1A]">{displayName}</p>
                                    <p className="text-xs text-[#6C757D] mt-0.5">{displayEmail}</p>
                                </div>

                                <div className="py-2">
                                    <button
                                        onClick={() => navigate('settings')}
                                        className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]"
                                    >
                                        <UserCircle className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">My Profile</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('settings')}
                                        className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]"
                                    >
                                        <Settings className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">Account Settings</span>
                                    </button>
                                    <button
                                        onClick={() => navigate('settings')}
                                        className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]"
                                    >
                                        <Shield className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">Privacy & Security</span>
                                    </button>
                                    <button
                                        onClick={() => { setIsDropdownOpen(false); setShowHelp(true); }}
                                        className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]"
                                    >
                                        <HelpCircle className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">Help & Support</span>
                                    </button>
                                </div>

                                <div className="border-t border-gray-100 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2.5 text-left hover:bg-red-50 transition-colors flex items-center gap-3 text-red-600"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="text-sm font-medium">Log Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>

        {/* Help & Support Modal */}
        {showHelp && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                    <button
                        onClick={() => setShowHelp(false)}
                        className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-[#6C757D]" />
                    </button>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#E8F9F5] p-3 rounded-xl">
                            <HelpCircle className="w-6 h-6 text-[#2EBE76]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">Help & Support</h2>
                            <p className="text-sm text-[#6C757D]">We're here to help</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <a
                            href="mailto:pharmacareinventory@gmail.com"
                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-[#F7FDFC] transition-colors group"
                        >
                            <div className="bg-[#E8F9F5] p-2.5 rounded-lg group-hover:bg-[#2EBE76] transition-colors">
                                <Mail className="w-5 h-5 text-[#2EBE76] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">Email Support</p>
                                <p className="text-xs text-[#6C757D]">pharmacareinventory@gmail.com</p>
                            </div>
                        </a>
                        <a
                            href="tel:+1800PHARMA"
                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-[#F7FDFC] transition-colors group"
                        >
                            <div className="bg-[#E8F9F5] p-2.5 rounded-lg group-hover:bg-[#2EBE76] transition-colors">
                                <Phone className="w-5 h-5 text-[#2EBE76] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">Phone Support</p>
                                <p className="text-xs text-[#6C757D]">+1-800-PHARMA (Mon–Fri, 9am–6pm)</p>
                            </div>
                        </a>
                        <a
                            href="https://docs.pharmacare.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-[#F7FDFC] transition-colors group"
                        >
                            <div className="bg-[#E8F9F5] p-2.5 rounded-lg group-hover:bg-[#2EBE76] transition-colors">
                                <MessageCircle className="w-5 h-5 text-[#2EBE76] group-hover:text-white transition-colors" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-[#1A1A1A]">Documentation</p>
                                <p className="text-xs text-[#6C757D]">Browse guides and FAQs</p>
                            </div>
                        </a>
                    </div>
                    <p className="text-center text-xs text-[#6C757D] mt-6">PharmaCare v1.0 • © 2026 PharmaCare Inc.</p>
                </div>
            </div>
        )}
        </>
    );
}
