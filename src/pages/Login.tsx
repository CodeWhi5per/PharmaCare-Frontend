import { useState, useEffect, useRef } from 'react';
import { Pill, Lock, Mail, User, KeyRound, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';

interface LoginProps {
    onLogin: () => void;
}

const errMsg = (err: unknown, fallback: string) =>
    err instanceof Error ? err.message : fallback;

// ── OTP Input (outside Login to prevent remount) ──────────────────────────────
function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const r0 = useRef<HTMLInputElement>(null);
    const r1 = useRef<HTMLInputElement>(null);
    const r2 = useRef<HTMLInputElement>(null);
    const r3 = useRef<HTMLInputElement>(null);
    const r4 = useRef<HTMLInputElement>(null);
    const r5 = useRef<HTMLInputElement>(null);
    const refs = [r0, r1, r2, r3, r4, r5];
    const digits = value.padEnd(6, ' ').split('');

    const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            const next = digits.map((d, idx) => (idx === i ? '' : d));
            onChange(next.join('').trimEnd());
            if (i > 0) refs[i - 1].current?.focus();
        }
    };
    const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value.replace(/\D/, '').slice(-1);
        const next = digits.map((d, idx) => (idx === i ? v : d));
        onChange(next.join('').replace(/ /g, ''));
        if (v && i < 5) refs[i + 1].current?.focus();
    };
    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        onChange(pasted);
        refs[Math.min(pasted.length, 5)].current?.focus();
        e.preventDefault();
    };
    return (
        <div className="flex gap-3 justify-center my-4" onPaste={handlePaste}>
            {digits.map((d, i) => (
                <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
                    value={d === ' ' ? '' : d}
                    onChange={e => handleChange(i, e)}
                    onKeyDown={e => handleKey(i, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:outline-none focus:border-[#2EBE76] transition-all"
                />
            ))}
        </div>
    );
}

// ── ErrorMsg / SuccessMsg (outside Login to prevent remount) ──────────────────
const ErrorMsg = ({ msg }: { msg: string }) =>
    msg ? <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{msg}</p> : null;

const SuccessMsg = ({ msg }: { msg: string }) =>
    msg ? <p className="text-sm text-green-600 bg-green-50 p-3 rounded-xl">{msg}</p> : null;

// ── PasswordField (outside Login to prevent remount) ──────────────────────────
function PasswordField({ label, value, show, onToggle, onChange, placeholder, required = true }: {
    label: string; value: string; show: boolean; onToggle: () => void;
    onChange: (v: string) => void; placeholder: string; required?: boolean;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-[#1A1A1A] mb-2">{label}</label>
            <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                <input
                    type={show ? 'text' : 'password'} value={value}
                    onChange={e => onChange(e.target.value)}
                    className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all"
                    placeholder={placeholder} required={required}
                />
                <button type="button" onClick={onToggle} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#2EBE76]">
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
        </div>
    );
}

type Screen = 'login' | 'signup-form' | 'signup-otp' | 'forgot-email' | 'forgot-otp' | 'forgot-reset';

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Login({ onLogin }: LoginProps) {
    const [screen, setScreen] = useState<Screen>('login');
    const [showPanel, setShowPanel] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [resetToken, setResetToken] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const isSignUp = screen.startsWith('signup') || screen.startsWith('forgot');

    useEffect(() => {
        let t: NodeJS.Timeout;
        if (isSignUp) t = setTimeout(() => setShowPanel(true), 20);
        else setShowPanel(false);
        return () => clearTimeout(t);
    }, [isSignUp]);

    useEffect(() => {
        if (resendTimer <= 0) return;
        const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
        return () => clearTimeout(t);
    }, [resendTimer]);

    const reset = () => { setError(''); setSuccess(''); setOtp(''); };
    const goLogin = () => { setScreen('login'); reset(); };
    const goSignUp = () => { setScreen('signup-form'); reset(); };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const data = await authAPI.login(email, password);
            localStorage.setItem('pharmacare_token', data.token);
            localStorage.setItem('pharmacare_user', JSON.stringify(data.user));
            onLogin();
        } catch (err: unknown) { setError(errMsg(err, 'Login failed')); }
        finally { setLoading(false); }
    };

    const handleSendSignUpOtp = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        if (password !== confirmPassword) { setError('Passwords do not match'); setLoading(false); return; }
        try {
            await authAPI.sendRegistrationOtp(email);
            setOtp(''); setScreen('signup-otp'); setResendTimer(60);
        } catch (err: unknown) { setError(errMsg(err, 'Failed to send OTP')); }
        finally { setLoading(false); }
    };

    const handleVerifySignUpOtp = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const data = await authAPI.verifyRegistrationOtp(name, email, password, otp);
            localStorage.setItem('pharmacare_token', data.token);
            localStorage.setItem('pharmacare_user', JSON.stringify(data.user));
            onLogin();
        } catch (err: unknown) { setError(errMsg(err, 'OTP verification failed')); }
        finally { setLoading(false); }
    };

    const handleForgotSendOtp = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            await authAPI.forgotPassword(email);
            setOtp(''); setScreen('forgot-otp'); setResendTimer(60);
        } catch (err: unknown) { setError(errMsg(err, 'Failed to send OTP')); }
        finally { setLoading(false); }
    };

    const handleVerifyForgotOtp = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        try {
            const data = await authAPI.verifyForgotOtp(email, otp);
            setResetToken(data.resetToken); setScreen('forgot-reset');
        } catch (err: unknown) { setError(errMsg(err, 'OTP verification failed')); }
        finally { setLoading(false); }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault(); setError(''); setLoading(true);
        if (newPassword !== confirmNewPassword) { setError('Passwords do not match'); setLoading(false); return; }
        try {
            await authAPI.resetPassword(email, resetToken, newPassword);
            setSuccess('Password reset successful! You can now sign in.');
            setTimeout(() => goLogin(), 2000);
        } catch (err: unknown) { setError(errMsg(err, 'Failed to reset password')); }
        finally { setLoading(false); }
    };

    const handleResend = async (purpose: 'register' | 'forgot') => {
        if (resendTimer > 0) return;
        setError(''); setLoading(true);
        try {
            if (purpose === 'register') await authAPI.sendRegistrationOtp(email);
            else await authAPI.forgotPassword(email);
            setResendTimer(60); setSuccess('New OTP sent!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: unknown) { setError(errMsg(err, 'Failed to resend OTP')); }
        finally { setLoading(false); }
    };

    const ic = 'w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2EBE76] focus:border-transparent transition-all';
    const bc = 'w-full bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed';

    const renderScreen = () => {
        if (screen === 'login') return (
            <>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] bg-clip-text text-transparent mb-2">Welcome Back</h2>
                <p className="text-[#6C757D] mb-8 font-secondary">Sign in to access your pharmacy dashboard</p>
                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={ic} placeholder="you@pharmacy.com" required />
                        </div>
                    </div>
                    <PasswordField label="Password" value={password} show={showPassword} onToggle={() => setShowPassword(p => !p)} onChange={setPassword} placeholder="Enter your password" />
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input type="checkbox" className="w-4 h-4 text-[#2EBE76] border-gray-300 rounded focus:ring-[#2EBE76]" />
                            <span className="ml-2 text-sm text-[#6C757D]">Remember me</span>
                        </label>
                        <button type="button" onClick={() => { setScreen('forgot-email'); reset(); }} className="text-sm text-[#2EBE76] hover:text-[#0BAF8C] font-medium transition-colors">Forgot Password?</button>
                    </div>
                    <ErrorMsg msg={error} />
                    <button type="submit" disabled={loading} className={bc}>{loading ? 'Signing in…' : 'Sign In'}</button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-[#6C757D]">Don't have an account?{' '}<button type="button" onClick={goSignUp} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium">Sign Up</button></p>
                </div>
            </>
        );

        if (screen === 'signup-form') return (
            <>
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-[#2EBE76] to-[#0BAF8C] bg-clip-text text-transparent mb-2">Create Account</h2>
                <p className="text-[#6C757D] mb-6 font-secondary">Sign up to get started with PharmaCare</p>
                <form onSubmit={handleSendSignUpOtp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                            <input type="text" value={name} onChange={e => setName(e.target.value)} className={ic} placeholder="John Doe" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={ic} placeholder="you@pharmacy.com" required />
                        </div>
                    </div>
                    <PasswordField label="Password" value={password} show={showPassword} onToggle={() => setShowPassword(p => !p)} onChange={setPassword} placeholder="Create a password" />
                    <PasswordField label="Confirm Password" value={confirmPassword} show={showConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} onChange={setConfirmPassword} placeholder="Confirm your password" />
                    <ErrorMsg msg={error} />
                    <button type="submit" disabled={loading} className={bc}>{loading ? 'Sending OTP…' : 'Continue'}</button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-[#6C757D]">Already have an account?{' '}<button type="button" onClick={goLogin} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium">Sign In</button></p>
                </div>
            </>
        );

        if (screen === 'signup-otp') return (
            <>
                <button type="button" onClick={() => setScreen('signup-form')} className="flex items-center gap-2 text-[#6C757D] hover:text-[#2EBE76] text-sm mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex justify-center mb-4">
                    <div className="bg-[#E8F9F5] p-4 rounded-2xl"><KeyRound className="w-10 h-10 text-[#2EBE76]" /></div>
                </div>
                <h2 className="text-2xl font-semibold text-center text-[#1A1A1A] mb-2">Verify Your Email</h2>
                <p className="text-[#6C757D] text-center text-sm mb-1 font-secondary">We've sent a 6-digit OTP to</p>
                <p className="text-[#2EBE76] text-center font-semibold text-sm mb-6">{email}</p>
                <form onSubmit={handleVerifySignUpOtp} className="space-y-4">
                    <OtpInput value={otp} onChange={setOtp} />
                    <ErrorMsg msg={error} /><SuccessMsg msg={success} />
                    <button type="submit" disabled={loading || otp.length < 6} className={bc}>{loading ? 'Verifying…' : 'Verify & Create Account'}</button>
                </form>
                <p className="text-center text-sm text-[#6C757D] mt-4">
                    Didn't receive it?{' '}
                    <button type="button" onClick={() => handleResend('register')} disabled={resendTimer > 0} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                </p>
            </>
        );

        if (screen === 'forgot-email') return (
            <>
                <button type="button" onClick={goLogin} className="flex items-center gap-2 text-[#6C757D] hover:text-[#2EBE76] text-sm mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Sign In
                </button>
                <div className="flex justify-center mb-4">
                    <div className="bg-[#E8F9F5] p-4 rounded-2xl"><KeyRound className="w-10 h-10 text-[#2EBE76]" /></div>
                </div>
                <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Forgot Password</h2>
                <p className="text-[#6C757D] mb-6 font-secondary">Enter your registered email and we'll send you an OTP to reset your password.</p>
                <form onSubmit={handleForgotSendOtp} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6C757D] w-5 h-5" />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={ic} placeholder="you@pharmacy.com" required />
                        </div>
                    </div>
                    <ErrorMsg msg={error} />
                    <button type="submit" disabled={loading} className={bc}>{loading ? 'Sending OTP…' : 'Send OTP'}</button>
                </form>
            </>
        );

        if (screen === 'forgot-otp') return (
            <>
                <button type="button" onClick={() => setScreen('forgot-email')} className="flex items-center gap-2 text-[#6C757D] hover:text-[#2EBE76] text-sm mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <div className="flex justify-center mb-4">
                    <div className="bg-[#E8F9F5] p-4 rounded-2xl"><KeyRound className="w-10 h-10 text-[#2EBE76]" /></div>
                </div>
                <h2 className="text-2xl font-semibold text-center text-[#1A1A1A] mb-2">Enter OTP</h2>
                <p className="text-[#6C757D] text-center text-sm mb-1 font-secondary">We've sent a 6-digit OTP to</p>
                <p className="text-[#2EBE76] text-center font-semibold text-sm mb-6">{email}</p>
                <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
                    <OtpInput value={otp} onChange={setOtp} />
                    <ErrorMsg msg={error} /><SuccessMsg msg={success} />
                    <button type="submit" disabled={loading || otp.length < 6} className={bc}>{loading ? 'Verifying…' : 'Verify OTP'}</button>
                </form>
                <p className="text-center text-sm text-[#6C757D] mt-4">
                    Didn't receive it?{' '}
                    <button type="button" onClick={() => handleResend('forgot')} disabled={resendTimer > 0} className="text-[#2EBE76] hover:text-[#0BAF8C] font-medium disabled:text-gray-400 disabled:cursor-not-allowed">
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                </p>
            </>
        );

        // forgot-reset
        return (
            <>
                <div className="flex justify-center mb-4">
                    <div className="bg-[#E8F9F5] p-4 rounded-2xl"><Lock className="w-10 h-10 text-[#2EBE76]" /></div>
                </div>
                <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">Reset Password</h2>
                <p className="text-[#6C757D] mb-6 font-secondary">Enter your new password below.</p>
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <PasswordField label="New Password" value={newPassword} show={showNewPassword} onToggle={() => setShowNewPassword(p => !p)} onChange={setNewPassword} placeholder="Enter new password" />
                    <PasswordField label="Confirm New Password" value={confirmNewPassword} show={showConfirmNewPassword} onToggle={() => setShowConfirmNewPassword(p => !p)} onChange={setConfirmNewPassword} placeholder="Confirm new password" />
                    <ErrorMsg msg={error} /><SuccessMsg msg={success} />
                    <button type="submit" disabled={loading} className={bc}>{loading ? 'Resetting…' : 'Reset Password'}</button>
                </form>
            </>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7FDFC] via-white to-[#E8F9F5] flex overflow-hidden relative">
            {/* Green marketing panel */}
            <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#2EBE76] to-[#0BAF8C] items-center justify-center p-12 overflow-hidden transition-all duration-700 ease-in-out absolute top-0 bottom-0 ${showPanel ? 'left-1/2' : 'left-0'} z-30 will-change-[left]`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 text-white max-w-md">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl"><Pill className="w-12 h-12" /></div>
                        <div>
                            <h1 className="text-4xl font-bold">PharmaCare</h1>
                            <p className="text-white/80 text-sm font-secondary">Inventory Management System</p>
                        </div>
                    </div>
                    <h2 className="text-3xl font-semibold mb-4">Smart Pharmacy Management</h2>
                    <p className="text-white/90 text-lg leading-relaxed mb-8 font-secondary">Automated inventory tracking, predictive reordering, and real-time analytics to keep your pharmacy running smoothly.</p>
                    <div className="space-y-4">
                        {['Real-time stock monitoring', 'Automated reorder predictions', 'Supplier integration & tracking'].map(t => (
                            <div key={t} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <div className="w-2 h-2 rounded-full bg-[#21D6C3]" />
                                <p className="text-sm font-secondary">{t}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Form panel (desktop) */}
            <div className={`hidden lg:flex lg:w-1/2 items-center justify-center p-8 transition-all duration-700 ease-in-out absolute top-0 bottom-0 ${showPanel ? 'left-0' : 'left-1/2'} z-10 will-change-[left]`}>
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        {renderScreen()}
                    </div>
                    <p className="text-center text-xs text-[#6C757D] mt-6 font-secondary">Secure healthcare data management • HIPAA Compliant</p>
                </div>
            </div>

            {/* Mobile */}
            <div className="lg:hidden flex items-center justify-center p-8 w-full">
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-3 mb-8 justify-center">
                        <div className="bg-[#2EBE76] p-3 rounded-xl"><Pill className="w-8 h-8 text-white" /></div>
                        <div>
                            <h1 className="text-2xl font-bold text-[#1A1A1A]">PharmaCare</h1>
                            <p className="text-[#6C757D] text-sm font-secondary">Inventory System</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        {renderScreen()}
                    </div>
                    <p className="text-center text-xs text-[#6C757D] mt-6 font-secondary">Secure healthcare data management • HIPAA Compliant</p>
                </div>
            </div>
        </div>
    );
}
