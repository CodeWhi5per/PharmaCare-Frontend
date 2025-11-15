import { useState } from 'react';
import { Pill, Lock, Mail } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FDFC] via-white to-[#E8F9F5] flex">
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] items-center justify-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 text-white max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                            <Pill className="w-12 h-12" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">PharmaCare</h1>
                            <p className="text-white/80 text-sm">Inventory Management System</p>
                        </div>
                    </div>

                    <h2 className="text-3xl font-semibold mb-4">Smart Pharmacy Management</h2>
                    <p className="text-white/90 text-lg leading-relaxed mb-8">
                        Automated inventory tracking, predictive reordering, and real-time analytics
                        to keep your pharmacy running smoothly.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="w-2 h-2 rounded-full bg-[#21D6C3]"></div>
                            <p className="text-sm">Real-time stock monitoring</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="w-2 h-2 rounded-full bg-[#21D6C3]"></div>
                            <p className="text-sm">Automated reorder predictions</p>
                        </div>
                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <div className="w-2 h-2 rounded-full bg-[#21D6C3]"></div>
                            <p className="text-sm">Supplier integration & tracking</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
                        <div className="bg-[#2EBE76] p-3 rounded-xl">
                            <Pill className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">PharmaCare</h1>
                            <p className="text-[#6C757D] text-sm">Inventory System</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Welcome Back</h2>
                        <p className="text-[#6C757D] mb-8">Sign in to access your pharmacy dashboard</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                        placeholder="you@pharmacy.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input type="checkbox" className="w-4 h-4 text-[#2EBE76] border-gray-300 rounded focus:ring-[#2EBE76]" />
                                    <span className="ml-2 text-sm text-[#6C757D]">Remember me</span>
                                </label>
                                <button type="button" className="text-sm text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">
                                    Forgot Password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-[#6C757D]">
                                Don't have an account?{' '}
                                <button className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">
                                    Contact Admin
                                </button>
                            </p>
                        </div>
                    </div>

                    <p className="text-center text-xs text-[#6C757D] mt-6">
                        Secure healthcare data management • HIPAA Compliant
                    </p>
                </div>
            </div>
        </div>
    );
}
