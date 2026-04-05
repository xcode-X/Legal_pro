/**
 * AccountPendingPage — Shown when a user has signed up but is awaiting admin approval.
 */
import React from 'react'
import { motion } from 'framer-motion'
import { HiClock, HiLogout, HiMail, HiShieldCheck } from 'react-icons/hi'
import useAuthStore from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

export default function AccountPendingPage() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                className="max-w-md w-full text-center"
            >
                {/* Icon */}
                <div className="relative mx-auto mb-8 w-24 h-24">
                    <div className="absolute inset-0 bg-amber-500/20 rounded-3xl animate-pulse" />
                    <div className="relative h-24 w-24 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex items-center justify-center">
                        <HiClock className="h-12 w-12 text-amber-400" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black text-white mb-3">Account Pending Review</h1>
                <p className="text-white/50 text-base leading-relaxed mb-8">
                    Your account has been created and is awaiting approval from an LDGFA administrator.
                    You'll be notified once your account is activated.
                </p>

                {/* User info card */}
                {user && (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-primary-500/20 rounded-xl flex items-center justify-center text-primary-300 font-black text-xl flex-shrink-0">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-white">{user.name}</p>
                                <p className="text-sm text-white/50 flex items-center gap-1.5 mt-0.5">
                                    <HiMail className="h-3.5 w-3.5" /> {user.email}
                                </p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-sm text-amber-300">
                            <HiClock className="h-4 w-4 flex-shrink-0" />
                            <span>Registered {new Date(user.registeredAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                )}

                {/* Steps */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 text-left space-y-4">
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">What happens next?</h3>
                    {[
                        { icon: HiShieldCheck, label: 'Admin reviews your firm details', done: true },
                        { icon: HiClock,       label: 'Account approved (usually within 24h)', done: false },
                        { icon: HiMail,        label: 'You receive an email confirmation', done: false },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 ${step.done ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                                <step.icon className={`h-4 w-4 ${step.done ? 'text-emerald-400' : 'text-white/40'}`} />
                            </div>
                            <p className={`text-sm ${step.done ? 'text-white' : 'text-white/50'}`}>{step.label}</p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold rounded-2xl transition-all"
                >
                    <HiLogout className="h-4 w-4" /> Sign Out &amp; Return to Login
                </button>
            </motion.div>
        </div>
    )
}
