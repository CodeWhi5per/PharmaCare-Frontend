import { Search, Bell, User, Settings, LogOut, UserCircle, Shield, HelpCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
    onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    return (
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
                                <p className="text-sm font-semibold text-[#1A1A1A]">Dr. Sarah Johnson</p>
                                <p className="text-xs text-[#6C757D] font-secondary">Pharmacy Manager</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                                {/* User Info Section */}
                                <div className="px-4 py-3 border-b border-gray-100">
                                    <p className="text-sm font-semibold text-[#1A1A1A]">Dr. Sarah Johnson</p>
                                    <p className="text-xs text-[#6C757D] mt-0.5">sarah.johnson@pharmacare.com</p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-2">
                                    <button className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]">
                                        <UserCircle className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">My Profile</span>
                                    </button>
                                    <button className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]">
                                        <Settings className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">Account Settings</span>
                                    </button>
                                    <button className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]">
                                        <Shield className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">Privacy & Security</span>
                                    </button>
                                    <button className="w-full px-4 py-2.5 text-left hover:bg-[#F7FDFC] transition-colors flex items-center gap-3 text-[#1A1A1A]">
                                        <HelpCircle className="w-4 h-4 text-[#6C757D]" />
                                        <span className="text-sm">Help & Support</span>
                                    </button>
                                </div>

                                {/* Logout Section */}
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
    );
}
