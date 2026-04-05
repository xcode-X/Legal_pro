/**
 * SettingsPage — High-end system configuration and profile management portfolio.
 * Redesigned for elite legal SaaS aesthetics with deep structural details.
 */
import React, { useState } from 'react'
import { 
    HiUser, HiCreditCard, HiBell, HiShieldCheck, HiCheck, 
    HiUserGroup, HiSparkles, HiLockClosed, HiServer, 
    HiLogout, HiCloudUpload, HiGlobeAlt, HiCollection,
    HiLightningBolt, HiCheckCircle, HiExclamationCircle,
    HiKey, HiIdentification, HiArrowRight
} from 'react-icons/hi'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import { addMonths, addYears, format } from 'date-fns'
import clsx from 'clsx'

const PLANS = [
    {
        id: 'starter',
        name: 'Starter Archetype',
        monthlyPrice: 0,
        yearlyPrice: 0,
        description: 'Baseline protocol for independent legal counsel.',
        features: ['5 Document Cycles/mo', '2 Custom Protocols', 'Standard AI Logic', 'Email Support Protocol'],
        color: 'border-slate-200',
        badge: '',
    },
    {
        id: 'pro',
        name: 'Professional Matrix',
        monthlyPrice: 49,
        yearlyPrice: 470,
        description: 'The industry standard for rapid growth firms.',
        features: ['Infinite Cycles', '20 Protocol Slots', 'Advanced Logic Matrix', 'Priority Support Routing', 'Full Export Autonomy', 'Secure Filing Ledger'],
        color: 'border-slate-900',
        badge: 'Top Utilization',
    },
    {
        id: 'enterprise',
        name: 'Enterprise Infinity',
        monthlyPrice: 149,
        yearlyPrice: 1430,
        description: 'Elite infrastructure for multinational firms.',
        features: ['Global Deployment', 'Custom Protocol Studio', 'RBAC Authority Hub', 'API Infrastructure', 'SLA Zero-Downtime', 'Strategic Account Peer'],
        color: 'border-slate-950',
        badge: '',
    },
]

const BASE_TABS = [
    { id: 'profile',       label: 'Profile',      icon: HiUser },
    { id: 'subscription',  label: 'Billing',       icon: HiCreditCard },
    { id: 'notifications', label: 'Notifications',      icon: HiBell },
    { id: 'security',      label: 'Security',   icon: HiShieldCheck },
    { id: 'ai',            label: 'AI Settings',      icon: HiSparkles },
]

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

export default function SettingsPage() {
    const { user, updateProfile, updateSubscription, pendingAccounts, approveAccount, rejectAccount } = useAuthStore()
    const { addToast } = useToastStore()
    const isAdmin = user?.role === 'Admin'

    const TABS = isAdmin
        ? [...BASE_TABS, { id: 'users', label: 'Manage Users', icon: HiUserGroup }]
        : BASE_TABS

    const [activeTab, setActiveTab] = useState('profile')
    const [isYearly, setIsYearly] = useState(user?.subscriptionPeriod === 'Yearly')
    const [saved, setSaved] = useState(false)
    const [subUpdating, setSubUpdating] = useState(null)
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        firm: user?.firm || '',
        role: user?.role || '',
        barId: 'BAR-77291-NYC', // Added detail
        region: 'North America / East Coast', // Added detail
    })
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' })
    const [pwSaving, setPwSaving] = useState(false)
    const [notifications, setNotifications] = useState({
        documentApproved: true,
        filingUpdates: true,
        aiAlerts: true,
        weeklyDigest: false,
        financialReports: true,
    })
    const [aiConfig, setAiConfig] = useState(() => {
        try { return JSON.parse(localStorage.getItem('ldgfa_ai_config') || '{}') } catch { return {} }
    })
    const [aiSaving, setAiSaving] = useState(false)

    const nextBillingDate = isYearly
        ? format(addYears(new Date(), 1), 'MMMM d, yyyy')
        : format(addMonths(new Date(), 1), 'MMMM d, yyyy')

    const handleSaveProfile = () => {
        updateProfile({ name: form.name, firm: form.firm })
        setSaved(true)
        addToast('Profile saved successfully.', 'success')
        setTimeout(() => setSaved(false), 2500)
    }

    const handleUpdatePassword = async () => {
        if (!pwForm.current) { addToast('Authentication key required.', 'warning'); return }
        if (pwForm.next.length < 6) { addToast('Quantum key must exceed 6 bits.', 'warning'); return }
        if (pwForm.next !== pwForm.confirm) { addToast('Identity mismatch.', 'error'); return }
        setPwSaving(true)
        await new Promise(r => setTimeout(r, 1200))
        setPwSaving(false)
        setPwForm({ current: '', next: '', confirm: '' })
        addToast('Authentication key successfully rotated.', 'success')
    }

    const handleSaveAiConfig = async () => {
        setAiSaving(true)
        localStorage.setItem('ldgfa_ai_config', JSON.stringify(aiConfig))
        await new Promise(r => setTimeout(r, 800))
        setAiSaving(false)
        addToast('AI settings saved.', 'success')
    }

    const handleApprove = (id, name) => {
        approveAccount(id)
        addToast(`User ${name} approved.`, 'success')
    }

    const handleReject = (id, name) => {
        rejectAccount(id)
        addToast(`User ${name} rejected.`, 'info')
    }

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-12 max-w-7xl mx-auto px-2 pb-20">
            
            {/* Page Header */}
            <motion.div variants={itemVariants} className="border-b border-slate-200 pb-10 relative">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
                 <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-4">Settings</h1>
                 <p className="text-slate-500 max-w-xl text-sm font-medium leading-relaxed">
                    Manage your account profile, billing, security, and set up your AI models.
                 </p>
            </motion.div>

            {/* Horizontal Protocol Selection Bar */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-slate-100 p-2 rounded-[32px] border border-slate-200 sticky top-4 z-30 shadow-sm backdrop-blur-md bg-white/70">
                <nav className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    {TABS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={clsx(
                                'flex items-center gap-3 px-6 py-3.5 rounded-[22px] text-[9px] font-black uppercase tracking-[0.2em] transition-all relative group shrink-0',
                                activeTab === id
                                    ? 'bg-black text-white shadow-xl scale-105 z-10'
                                    : 'text-slate-400 hover:bg-white hover:text-slate-900'
                            )}
                        >
                            <Icon className={clsx("h-4 w-4", activeTab === id ? "text-white" : "text-slate-300 group-hover:text-slate-900")} />
                            <span>{label}</span>
                            {id === 'users' && isAdmin && (pendingAccounts?.length > 0) && (
                                <span className="h-5 min-w-5 px-1.5 rounded-full text-[9px] font-black text-white bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                                    {pendingAccounts.length}
                                </span>
                            )}
                            {activeTab === id && (
                                <motion.div layoutId="setting-active" className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 bg-white rounded-full lg:hidden" />
                            )}
                        </button>
                    ))}
                </nav>
                <div className="hidden lg:flex items-center gap-4 px-6 border-l border-slate-200">
                    <div className="flex items-center gap-2">
                        <HiShieldCheck className="h-4 w-4 text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Firm Protection: 85%</span>
                    </div>
                </div>
            </motion.div>

            {/* Sub-Portfolio Content */}
            <div className="min-w-0 pt-4">
                    <AnimatePresence mode="wait">
                        <motion.div 
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            {/* IDENTITY MATRIX */}
                            {activeTab === 'profile' && (
                                <div className="space-y-8">
                                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm overflow-hidden relative">
                                         <div className="absolute top-0 right-0 p-10 opacity-5">
                                            <HiIdentification className="h-40 w-40" />
                                         </div>
                                         <div className="relative z-10">
                                            <div className="flex items-center gap-8 mb-12">
                                                <div className="h-24 w-24 rounded-[32px] bg-slate-900 flex items-center justify-center shadow-2xl relative group cursor-pointer">
                                                    <span className="text-3xl font-black text-white">{form.name.charAt(0)}</span>
                                                    <div className="absolute inset-0 bg-black/40 rounded-[32px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                        <HiCloudUpload className="h-6 w-6 text-white" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{form.name}</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                                        <HiSparkles className="h-3 w-3 text-amber-500" /> {user?.subscription} · {user?.role} Protocol
                                                    </p>
                                                    <p className="text-xs font-medium text-slate-400 mt-2">{form.region}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-6">
                                                     <div className="flex items-center gap-3">
                                                        <div className="h-1 w-6 rounded-full bg-slate-900" />
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Basic Details</h4>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Full Name</label>
                                                        <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Synchronization Email</label>
                                                        <input type="email" value={form.email} className="w-full bg-slate-100 border border-slate-100 text-slate-400 rounded-2xl py-4 px-6 outline-none cursor-not-allowed font-bold text-sm" disabled />
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                     <div className="flex items-center gap-3">
                                                        <div className="h-1 w-6 rounded-full bg-slate-900" />
                                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Firm Details</h4>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Law Firm Name</label>
                                                        <input type="text" value={form.firm} onChange={e => setForm(f => ({ ...f, firm: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">BAR Association ID</label>
                                                        <input type="text" value={form.barId} onChange={e => setForm(f => ({ ...f, barId: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="mt-12 flex justify-end">
                                                <button onClick={handleSaveProfile} className="px-12 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-800 transition-all shadow-xl">
                                                    {saved ? 'Saved Successfully' : 'Save Changes'}
                                                </button>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            )}

                            {/* REMITTANCE HUB */}
                            {activeTab === 'subscription' && (
                                <div className="space-y-12">
                                    <div className="bg-slate-950 rounded-[40px] p-12 text-white relative overflow-hidden">
                                         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
                                         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                            <div className="flex-1 space-y-4">
                                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Current Plan</span>
                                                <h3 className="text-4xl font-black uppercase tracking-tighter">{user?.subscription} Plan</h3>
                                                <p className="text-slate-400 max-w-sm text-sm font-medium leading-relaxed">Your firm is currently on the {user?.subscription} plan, billed {user?.subscriptionPeriod || 'Monthly'}.</p>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] w-full md:w-80">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Next Billing Date</p>
                                                <p className="text-3xl font-black tracking-tight">{nextBillingDate}</p>
                                                <div className="h-1 w-12 bg-white/20 rounded-full mt-6" />
                                            </div>
                                         </div>
                                    </div>

                                    <div className="flex flex-col items-center gap-6 py-4">
                                        <div className="bg-slate-100 p-1.5 rounded-[22px] border border-slate-200 flex gap-2">
                                            <button onClick={() => setIsYearly(false)} className={clsx('px-10 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all', !isYearly ? 'bg-white text-slate-900 shadow-md border border-slate-200/50' : 'text-slate-400 hover:text-slate-900')}>Monthly Plan</button>
                                            <button onClick={() => setIsYearly(true)} className={clsx('px-10 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-3', isYearly ? 'bg-white text-slate-900 shadow-md border border-slate-200/50' : 'text-slate-400 hover:text-slate-900')}>
                                                Yearly Plan <span className="text-[8px] bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-tighter font-black">Save 20%</span>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {PLANS.map(plan => {
                                            const isCurrent = plan.name.includes(user?.subscription || '') && isYearly === (user?.subscriptionPeriod === 'Yearly')
                                            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice
                                            const periodLabel = isYearly ? '/YR' : '/MO'
                                            return (
                                                <div key={plan.id} className={clsx('bg-white border rounded-[40px] p-10 flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group', isCurrent ? 'border-slate-900 border-2 shadow-xl ring-8 ring-slate-50 scale-105 z-10' : 'border-slate-100 shadow-sm')}>
                                                    {plan.badge && (
                                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-xl">
                                                            {plan.badge}
                                                        </div>
                                                    )}
                                                    <div className="mb-10 text-center">
                                                        <p className="font-black text-slate-900 text-sm tracking-tight mb-4 uppercase">{plan.name}</p>
                                                        <div className="flex items-baseline justify-center gap-1">
                                                            <span className="text-5xl font-black text-slate-900 tracking-tighter">${price}</span>
                                                            <span className="text-slate-400 text-xs font-black uppercase tracking-widest">{periodLabel}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 space-y-4 mb-10 border-t border-slate-50 pt-8">
                                                        {plan.features.map(f => (
                                                            <div key={f} className="flex items-start gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">
                                                                <HiCheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                                                                {f}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (isCurrent) return
                                                            setSubUpdating(plan.id)
                                                            setTimeout(() => {
                                                                updateSubscription(plan.name, isYearly ? 'Yearly' : 'Monthly')
                                                                setSubUpdating(null)
                                                                addToast(`Ecosystem upgraded to ${plan.name}.`, 'success')
                                                            }, 1500)
                                                        }}
                                                        disabled={isCurrent || subUpdating === plan.id}
                                                        className={clsx('w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300', isCurrent ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-100' : 'bg-black text-white hover:bg-slate-800 shadow-xl group-hover:scale-[1.02]')}
                                                    >
                                                        {subUpdating === plan.id ? 'Deploying...' : isCurrent ? 'Active Matrix' : 'Initialize'}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* ALERT PROTOCOLS */}
                            {activeTab === 'notifications' && (
                                <div className="space-y-8">
                                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm">
                                         <div className="flex items-center gap-4 mb-10">
                                            <div className="h-10 w-10 bg-slate-900 rounded-full flex items-center justify-center shadow-lg">
                                                <HiBell className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 uppercase">Alert Node Matrix</h3>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Configure automated signal distribution</p>
                                            </div>
                                         </div>

                                         <div className="space-y-4">
                                            {Object.entries({
                                                documentApproved: { label: 'Document Revisions', desc: 'Get an alert when a document is approved.' },
                                                filingUpdates:    { label: 'Filing Updates', desc: 'Live updates on all your submitted court filings.' },
                                                aiAlerts:         { label: 'AI Alerts', desc: 'Notifies you when AI spots risks in your contracts.' },
                                                financialReports: { label: 'Billing Reports', desc: 'Weekly summary of your revenue and invoices.' },
                                                weeklyDigest:     { label: 'Weekly Summary', desc: 'Email digest of your firm activity at the end of the week.' },
                                            }).map(([key, { label, desc }]) => (
                                                <div key={key} className="flex items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[28px] hover:bg-white hover:border-slate-300 hover:shadow-xl transition-all cursor-pointer group">
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight mb-1">{label}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 max-w-sm">{desc}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                                                        className={clsx('relative inline-flex h-8 w-14 rounded-full transition-all duration-300 shadow-inner', notifications[key] ? 'bg-black' : 'bg-slate-200')}
                                                    >
                                                        <span className={clsx('absolute top-1 left-1 h-6 w-6 bg-white rounded-full shadow-lg transition-transform duration-300', notifications[key] ? 'translate-x-6' : 'translate-x-0')} />
                                                    </button>
                                                </div>
                                            ))}
                                         </div>
                                    </div>
                                </div>
                            )}

                            {/* SECURITY PERIMETER */}
                            {activeTab === 'security' && (
                                <div className="space-y-8">
                                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-10 opacity-5">
                                            <HiLockClosed className="h-40 w-40" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-10">
                                                <div className="h-1 w-8 rounded-full bg-slate-900" />
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Password Settings</h4>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Current Secret Key</label>
                                                        <input type="password" placeholder="••••••••" value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">New Password</label>
                                                        <input type="password" placeholder="••••••••" value={pwForm.next} onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Confirm New Password</label>
                                                        <input type="password" placeholder="••••••••" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" />
                                                    </div>
                                                </div>
                                                <div className="space-y-6">
                                                     <div className="bg-slate-950 p-8 rounded-[32px] text-white space-y-6 relative overflow-hidden">
                                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">2FA Status</p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-black text-slate-400 uppercase tracking-tighter">Biometric/MFA</span>
                                                                <span className="text-[9px] bg-white/10 px-3 py-1 rounded-full font-black text-slate-500 uppercase tracking-widest">Disabled</span>
                                                            </div>
                                                        </div>
                                                        <div className="pt-6 border-t border-white/5">
                                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Active Node Session</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                                    <span className="text-xs font-bold">MacOS · Chrome x64</span>
                                                                </div>
                                                                <button className="text-[9px] font-black text-red-400 uppercase hover:text-red-500 transition-colors">Abort</button>
                                                            </div>
                                                        </div>
                                                     </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <button onClick={handleUpdatePassword} disabled={pwSaving} className="px-12 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50">
                                                    {pwSaving ? 'Rotating Key...' : 'Commit Rotation'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI ARCHITECTURE */}
                            {activeTab === 'ai' && (
                                <div className="space-y-8">
                                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm relative overflow-hidden">
                                         <div className="absolute top-0 right-0 p-10 opacity-5">
                                            <HiSparkles className="h-40 w-40" />
                                         </div>
                                         <div className="relative z-10">
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                                                    <HiSparkles className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-black text-slate-900 uppercase">AI Models Setup</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Set up API keys for generating documents using AI</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 gap-6">
                                                {/* Internal Neural Engine */}
                                                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[32px] p-8 flex items-center justify-between">
                                                    <div className="flex items-center gap-6">
                                                        <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                            <span className="text-3xl">🌸</span>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-emerald-800 uppercase tracking-tight">Pollinations Internal LLaMA</p>
                                                            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Protocol: Free / No Key Required · Global Fallback</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-emerald-200/50 px-5 py-2 rounded-full border border-emerald-200/50">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                                        <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Online - Operational</span>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {[
                                                        { id: 'openai', label: 'OpenAI GPT-4o Protocol', icon: HiCollection, color: 'bg-black', text: 'text-white', placeholder: 'sk-proj-...', link: 'https://platform.openai.com/api-keys' },
                                                        { id: 'anthropic', label: 'Anthropic Claude 3.5 Opus', icon: HiShieldCheck, color: 'bg-purple-600', text: 'text-white', placeholder: 'sk-ant-api03-...', link: 'https://console.anthropic.com/' },
                                                        { id: 'groq', label: 'Groq Quantum [LLaMA 3]', icon: HiLightningBolt, color: 'bg-orange-500', text: 'text-white', placeholder: 'gsk_...', link: 'https://console.groq.com/keys' },
                                                        { id: 'gemini', label: 'Google Gemini Pro / Ultra', icon: HiGlobeAlt, color: 'bg-blue-600', text: 'text-white', placeholder: 'AIzaSy...', link: 'https://aistudio.google.com/app/apikey' },
                                                        { id: 'deepseek', label: 'DeepSeek Coder V2 [Free]', icon: HiKey, color: 'bg-indigo-600', text: 'text-white', placeholder: 'sk-...', link: 'https://platform.deepseek.com/' },
                                                    ].map((ai) => (
                                                        <div key={ai.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[32px] space-y-6 hover:bg-white hover:border-slate-300 transition-all group">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={clsx("h-10 w-10 rounded-xl flex items-center justify-center shadow-lg", ai.color)}>
                                                                        <ai.icon className={clsx("h-5 w-5", ai.text)} />
                                                                    </div>
                                                                    <div className="space-y-0.5">
                                                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">{ai.label}</p>
                                                                        <a href={ai.link} target="_blank" rel="noreferrer" className="text-[8px] font-black text-slate-400 hover:text-black uppercase tracking-[0.15em] transition-all flex items-center gap-1 group/link">
                                                                            Get API Key <HiArrowRight className="h-2 w-2 group-hover/link:translate-x-1 transition-transform" />
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                {aiConfig[`${ai.id}Key`] && <HiCheckCircle className="h-5 w-5 text-emerald-500" />}
                                                            </div>
                                                            <div className="space-y-4">
                                                                <input 
                                                                    type="password" 
                                                                    value={aiConfig[`${ai.id}Key`] || ''} 
                                                                    onChange={e => setAiConfig(p => ({ ...p, [`${ai.id}Key`]: e.target.value }))} 
                                                                    placeholder={ai.placeholder} 
                                                                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl py-3.5 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-mono text-[11px]" 
                                                                />
                                                                <div className="flex items-center justify-between px-1">
                                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model Hierarchy:</span>
                                                                    <select className="bg-transparent text-[9px] font-black text-slate-900 uppercase tracking-widest border-none outline-none cursor-pointer">
                                                                        <option>Primary Authority</option>
                                                                        <option>Sub-Logic Layer</option>
                                                                        <option>Validation Only</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-slate-950 rounded-[40px] text-white overflow-hidden relative">
                                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mb-16" />
                                                <div className="space-y-2 relative z-10">
                                                    <h4 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                                        <HiShieldCheck className="h-4 w-4 text-emerald-400" /> AI Failover Active
                                                    </h4>
                                                    <p className="text-[10px] font-medium text-slate-500 max-w-sm leading-relaxed">If one AI provider goes offline, the system will automatically use the next active API to process your documents without interruption.</p>
                                                </div>
                                                <button onClick={handleSaveAiConfig} disabled={aiSaving} className="w-full md:w-auto px-12 py-5 bg-white text-black text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-100 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] disabled:opacity-50 relative z-10">
                                                    {aiSaving ? 'Saving...' : 'Save AI Settings'}
                                                </button>
                                            </div>
                                         </div>
                                    </div>
                                </div>
                            )}

                            {/* AUTHORITY HUB */}
                            {activeTab === 'users' && isAdmin && (
                                <div className="space-y-8">
                                    <div className="bg-white rounded-[40px] border border-slate-200 p-10 shadow-sm overflow-hidden relative">
                                        <div className="absolute top-0 right-0 p-10 opacity-5">
                                            <HiUserGroup className="h-40 w-40" />
                                        </div>
                                        <div className="relative z-10 w-full">
                                            <div className="flex items-center justify-between mb-12">
                                                <div>
                                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-3">Pending Credentials</h3>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorization queue for firm personnel</p>
                                                </div>
                                                {pendingAccounts?.length > 0 && (
                                                    <div className="bg-red-50 text-red-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100 animate-pulse">
                                                        {pendingAccounts.length} Unauthorized Nodes
                                                    </div>
                                                )}
                                            </div>

                                            {!pendingAccounts?.length ? (
                                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                                    <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                                        <HiUserGroup className="h-10 w-10 text-slate-200" />
                                                    </div>
                                                    <p className="text-xl font-black text-slate-400 uppercase tracking-tight">Authority Matrix Clear</p>
                                                    <p className="text-xs font-bold text-slate-300 mt-2 uppercase tracking-widest">No pending registrations detected in local cluster</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 gap-4">
                                                    {pendingAccounts.map(u => (
                                                        <motion.div 
                                                            key={u.id}
                                                            initial={{ opacity: 0, scale: 0.98 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="flex flex-col sm:flex-row sm:items-center gap-6 p-8 bg-white border-2 border-slate-50 rounded-[32px] hover:border-slate-900 transition-all group"
                                                        >
                                                            <div className="flex items-center gap-6 flex-1">
                                                                <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-2xl shadow-xl">
                                                                    {u.name?.charAt(0)}
                                                                </div>
                                                                <div>
                                                                    <p className="text-lg font-black text-slate-900 uppercase tracking-tight leading-tight">{u.name}</p>
                                                                    <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-1 tracking-widest">{u.email}</p>
                                                                    <div className="flex items-center gap-3 mt-3">
                                                                        <span className="text-[9px] bg-slate-100 px-3 py-1 rounded-full font-black text-slate-600 uppercase tracking-widest">{u.firm}</span>
                                                                        <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">{format(new Date(u.registeredAt), 'MMM d')} Arrival</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-3">
                                                                <button onClick={() => handleReject(u.id, u.name)} className="px-8 py-3 text-[10px] font-black text-red-500 uppercase tracking-widest border border-red-50 hover:bg-red-500 hover:text-white rounded-xl transition-all">
                                                                    Reject User
                                                                </button>
                                                                <button onClick={() => handleApprove(u.id, u.name)} className="px-8 py-3 text-[10px] font-black text-white bg-black hover:bg-emerald-600 rounded-xl transition-all shadow-lg">
                                                                    Approve User
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
        </motion.div>
    )
}
