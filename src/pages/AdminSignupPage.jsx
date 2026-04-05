import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { HiEye, HiEyeOff, HiScale, HiLockClosed, HiMail, HiUser, HiOfficeBuilding } from 'react-icons/hi'
import { motion } from 'framer-motion'
import useAuthStore from '../store/useAuthStore'

export default function AdminSignupPage() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        firm: '',
        password: '',
        confirmPassword: ''
    })
    const [showPwd, setShowPwd] = useState(false)
    const { adminSignup, isLoading, error, clearError } = useAuthStore()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        clearError()

        if (form.password !== form.confirmPassword) {
            alert('Passwords do not match')
            return
        }
        if (form.password.length < 6) {
            alert('Password must be at least 6 characters')
            return
        }

        const { success } = await adminSignup(form.name, form.email, form.password, form.firm)
        if (success) navigate('/dashboard')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen flex bg-white font-sans text-gray-900">
            {/* Left Panel - Branding */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="hidden lg:flex lg:w-[45%] bg-primary-700 relative overflow-hidden flex-col justify-between p-16"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-gradient-to-br from-primary-500/30 to-transparent blur-3xl" />
                    <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-primary-400/20 to-transparent blur-2xl" />
                </div>

                <div className="relative z-10 flex items-center gap-4">
                    <div
                        className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-xl shadow-primary-900/50 cursor-pointer"
                        onClick={() => navigate('/admin/login')}
                    >
                        <HiScale className="h-7 w-7 text-primary-600" />
                    </div>
                    <div>
                        <h1 className="text-white font-black text-2xl tracking-tighter leading-none">LDGFA</h1>
                        <p className="text-primary-300 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Law Firm Intelligence</p>
                    </div>
                </div>

                <div className="relative z-10 space-y-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl font-black text-white leading-[1.1] tracking-tight"
                    >
                        Join the <br />
                        <span className="text-primary-300 underline decoration-primary-400/50 underline-offset-8">Future of Law</span>.
                    </motion.h2>
                    <p className="text-primary-100 text-lg leading-relaxed max-w-md font-medium">
                        Empower your firm with world-class AI document generation. Secure, compliant, and lightning fast.
                    </p>

                    <div className="space-y-6 mt-12">
                        {[
                            { title: 'AI Drafting', desc: 'Generate complex contracts in seconds with local legal RAG.' },
                            { title: 'Secure Ledger', desc: 'End-to-end encrypted billing and invoice tracking.' },
                            { title: 'Real-time Filing', desc: 'Sync directly with judicial systems for instant filings.' }
                        ].map((feat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center gap-4"
                            >
                                <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/20">
                                    <HiScale className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{feat.title}</p>
                                    <p className="text-primary-300 text-xs">{feat.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-primary-300 text-xs font-medium">
                    Protected by firm-grade 256-bit AES encryption.
                </div>
            </motion.div>

            {/* Right Panel - Sign Up Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:p-24 bg-gray-50/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-lg"
                >
                    <div className="text-center lg:text-left mb-10">
                        <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Create Admin Account</h3>
                        <p className="text-gray-500 font-medium">Establish a new system administration profile.</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 p-10 border border-gray-100 relative">
                        {error && (
                            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                                    <div className="relative group">
                                        <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Counselor Name"
                                            className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Firm Name</label>
                                    <div className="relative group">
                                        <HiOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                        <input
                                            name="firm"
                                            value={form.firm}
                                            onChange={handleChange}
                                            type="text"
                                            placeholder="Firm Name"
                                            className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Work Email</label>
                                <div className="relative group">
                                    <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                    <input
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        type="email"
                                        placeholder="counselor@firm.com"
                                        className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Security Key</label>
                                    <input
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Confirm Key</label>
                                    <input
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full bg-gray-50 border border-gray-100 text-gray-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-primary py-5 rounded-2xl shadow-xl shadow-primary-500/30 text-sm font-black uppercase tracking-widest mt-4"
                            >
                                {isLoading ? 'Building Administrator Profile...' : 'Register as Admin'}
                            </button>
                        </form>
                    </div>

                    <p className="mt-8 text-center text-sm font-medium text-gray-500">
                        Already an Admin? <Link to="/admin/login" className="text-primary-600 font-black hover:underline underline-offset-4">Admin Hub Login</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
