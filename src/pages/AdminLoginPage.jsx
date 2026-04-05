import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HiEye, HiEyeOff, HiScale, HiLockClosed, HiMail, HiOutlineDeviceMobile, HiPhone } from 'react-icons/hi'
import { FcGoogle } from 'react-icons/fc'
import useAuthStore from '../store/useAuthStore'
import { motion } from 'framer-motion'

const DEMO_CREDS = [
    { role: 'Admin HQ', email: 'admin@ldgfa.com', password: 'adminpassword' },
]

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [phone, setPhone] = useState('')
    const [otp, setOtp] = useState('')
    const [isPhoneAuth, setIsPhoneAuth] = useState(false)
    const [showPwd, setShowPwd] = useState(false)
    const { login, loginWithGoogle, sendPhoneOtp, verifyOtp, confirmationResult, isLoading, error, clearError } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()
        const { success } = await login(email, password)
        if (success) navigate('/dashboard')
    }

    const fillDemo = (creds) => {
        setEmail(creds.email)
        setPassword(creds.password)
        clearError()
    }

    const handleGoogleLogin = async () => {
        clearError()
        const { success } = await loginWithGoogle()
        if (success) navigate('/dashboard')
    }

    const handlePhoneSubmit = async (e) => {
        e.preventDefault()
        clearError()
        if (!confirmationResult) {
            await sendPhoneOtp(phone, 'recaptcha-container')
        } else {
            const { success } = await verifyOtp(otp)
            if (success) navigate('/dashboard')
        }
    }

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Panel - Professional Branding */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:flex lg:w-[45%] bg-primary-700 relative overflow-hidden flex-col justify-between p-16"
            >
                {/* Modern Abstract Shapes */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-500/30 to-transparent blur-3xl animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-primary-400/20 to-transparent blur-2xl" />
                </div>

                {/* Logo & Identity */}
                <div className="relative z-10 flex items-center gap-4">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary-900/50">
                        <HiScale className="h-7 w-7 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-2xl tracking-tighter leading-none">LDGFA</h1>
                        <p className="text-primary-300 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Law Firm Intelligence</p>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl font-black text-white leading-[1.1] tracking-tight"
                    >
                        Redefining the <br />
                        <span className="text-primary-300 underline decoration-primary-400/50 underline-offset-8">Legal Workflow</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-primary-100 text-lg leading-relaxed max-w-md font-medium"
                    >
                        The ultimate AI-powered legal assistant designed to streamline document generation, templates, and filings in Liberian jurisdiction.
                    </motion.p>

                    {/* Testimonial / Social Proof */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mt-12 max-w-lg"
                    >
                        <p className="text-white italic text-lg leading-relaxed mb-4">
                            "LDGFA has transformed our firm's productivity. What used to take hours now takes seconds. It's the standard for modern Liberian law firms."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary-400 rounded-full border-2 border-white/20" />
                            <div>
                                <p className="text-white font-bold text-sm">Counselor David M. Cooper</p>
                                <p className="text-primary-300 text-xs font-semibold">Managing Partner, Cooper & Co.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="relative z-10 text-primary-300 text-xs font-medium">
                    © 2024 LDGFA Legal. Trusted by 200+ law firms nationwide.
                </div>
            </motion.div>

            {/* Right Panel - Clean & Professional Sign In */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-gray-50/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center lg:text-left mb-10">
                        <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Administrator Command</h3>
                        <p className="text-gray-500 font-medium">System and platform oversight gate.</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-10 border border-gray-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <HiLockClosed className="h-24 w-24 -mr-12 -mt-12" />
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600 font-semibold"
                            >
                                {error}
                            </motion.div>
                        )}

                        {isPhoneAuth ? (
                            <form onSubmit={handlePhoneSubmit} className="space-y-6">
                                {!confirmationResult ? (
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Phone Number</label>
                                        <div className="relative group">
                                            <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+1 234 567 8900"
                                                className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">OTP Code</label>
                                        <div className="relative group">
                                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                            <input
                                                type="text"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                placeholder="123456"
                                                className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}
                                <div id="recaptcha-container"></div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary py-4 rounded-2xl shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest"
                                >
                                    {isLoading ? 'Verifying...' : (!confirmationResult ? 'Send OTP' : 'Verify Code')}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {setIsPhoneAuth(false); clearError()}} 
                                    className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest mt-4 hover:text-gray-900"
                                >
                                    Login with Email
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Email address</label>
                                    <div className="relative group">
                                        <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@firm.com"
                                            className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Security Key</label>
                                    <div className="relative group">
                                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            type={showPwd ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 pl-12 pr-12 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPwd(!showPwd)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-600 transition-colors"
                                        >
                                            {showPwd ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs font-bold px-1">
                                    <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                                        <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" /> Remember device
                                    </label>
                                    <Link to="#" className="text-primary-600 hover:text-primary-700">Forgot Security Key?</Link>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-primary py-4 rounded-2xl shadow-xl shadow-primary-500/30 flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest"
                                >
                                    {isLoading ? 'Verifying...' : 'Login to Workspace'}
                                </button>
                            </form>
                        )}

                        <div className="mt-8 space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <button 
                                    onClick={handleGoogleLogin} 
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-bold text-xs"
                                >
                                    <FcGoogle className="h-5 w-5" /> Google Sync
                                </button>
                                <button 
                                    onClick={() => {setIsPhoneAuth(true); clearError()}} 
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-bold text-xs"
                                >
                                    <HiOutlineDeviceMobile className="h-5 w-5 text-gray-700" /> Phone Auth
                                </button>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Diagnostic Login</p>
                            <div className="grid grid-cols-3 gap-3">
                                {DEMO_CREDS.map((c) => (
                                    <button
                                        key={c.role}
                                        onClick={() => fillDemo(c)}
                                        className="text-[10px] font-black uppercase tracking-tighter bg-gray-50 hover:bg-primary-50 text-gray-500 hover:text-primary-700 py-3 rounded-xl border border-gray-100 hover:border-primary-200 transition-all"
                                    >
                                        {c.role}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <p className="mt-8 text-center text-sm font-medium text-gray-500">
                        Not an Admin? <Link to="/login" className="text-primary-600 font-black hover:underline underline-offset-4">Firm Login</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
