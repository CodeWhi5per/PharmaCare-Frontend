import { Search, Bell, User } from 'lucide-react';

export default function Header() {
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

                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-[#1A1A1A]">Dr. Sarah Johnson</p>
                            <p className="text-xs text-[#6C757D]">Pharmacy Manager</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-white" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
