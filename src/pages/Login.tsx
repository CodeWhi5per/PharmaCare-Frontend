import { useState, useEffect } from 'react';
import { Pill, Lock, Mail, User } from 'lucide-react';

interface LoginProps {
    onLogin: () => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [showSignUpForm, setShowSignUpForm] = useState(false); // delayed state for actual form display
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Delay form content change until after panel animation (700ms)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isSignUp) {
            // When switching to sign-up, wait for panels to finish moving
            timer = setTimeout(() => {
                setShowSignUpForm(true);
            }, 700);
        } else {
            // When switching to sign-in, wait for panels to finish moving
            timer = setTimeout(() => {
                setShowSignUpForm(false);
            }, 700);
        }
        return () => clearTimeout(timer);
    }, [isSignUp]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    const handleSignUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FDFC] via-white to-[#E8F9F5] flex overflow-hidden relative">
            {/* Green marketing panel */}
            <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] items-center justify-center p-12 overflow-hidden transition-all duration-700 ease-in-out absolute top-0 bottom-0 ${
                isSignUp ? 'left-1/2' : 'left-0'
            } z-30 will-change-[left]`}>
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

            {/* Auth panel (white) that swaps position with green panel */}
            <div className={`hidden lg:flex lg:w-1/2 items-center justify-center p-8 transition-all duration-700 ease-in-out absolute top-0 bottom-0 ${
                isSignUp ? 'left-0' : 'left-1/2'
            } z-10 will-change-[left]`}>
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 relative">
                        {/* Toggle header text */}
                        {!showSignUpForm ? (
                            <>
                                <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Welcome Back</h2>
                                <p className="text-[#6C757D] mb-8">Sign in to access your pharmacy dashboard</p>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
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
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
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
                                        <button type="button" className="text-sm text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">Forgot Password?</button>
                                    </div>
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200">Sign In</button>
                                </form>
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-[#6C757D]">
                                        Don't have an account?{' '}
                                        <button type="button" onClick={() => setIsSignUp(true)} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">Sign Up</button>
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Create Account</h2>
                                <p className="text-[#6C757D] mb-8">Sign up to get started with PharmaCare</p>
                                <form onSubmit={handleSignUpSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
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
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                                placeholder="Create a password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Confirm Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                                placeholder="Confirm your password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <button type="submit" className="w-full bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200">Create Account</button>
                                </form>
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-[#6C757D]">
                                        Already have an account?{' '}
                                        <button type="button" onClick={() => setIsSignUp(false)} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">Sign In</button>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                    <p className="text-center text-xs text-[#6C757D] mt-6">Secure healthcare data management • HIPAA Compliant</p>
                </div>
            </div>

            {/* Mobile view retains previous conditional rendering */}
            <div className="lg:hidden flex items-center justify-center p-8 w-full">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="bg-[#2EBE76] p-3 rounded-xl">
                            <Pill className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">PharmaCare</h1>
                            <p className="text-[#6C757D] text-sm">Inventory System</p>
                        </div>
                    </div>
                    {!showSignUpForm ? (
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Welcome Back</h2>
                            <p className="text-[#6C757D] mb-8">Sign in to access your pharmacy dashboard</p>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
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
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
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
                                    <button type="button" className="text-sm text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">Forgot Password?</button>
                                </div>
                                <button type="submit" className="w-full bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200">Sign In</button>
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-[#6C757D]">Don't have an account?{' '}<button type="button" onClick={() => setIsSignUp(true)} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">Sign Up</button></p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                            <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Create Account</h2>
                            <p className="text-[#6C757D] mb-8">Sign up to get started with PharmaCare</p>
                            <form onSubmit={handleSignUpSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
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
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                            placeholder="Create a password"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                                            placeholder="Confirm your password"
                                            required
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200">Create Account</button>
                            </form>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-[#6C757D]">Already have an account?{' '}<button type="button" onClick={() => setIsSignUp(false)} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">Sign In</button></p>
                            </div>
                        </div>
                    )}
                    <p className="text-center text-xs text-[#6C757D] mt-6">Secure healthcare data management • HIPAA Compliant</p>
                </div>
            </div>
        </div>
    );
}
