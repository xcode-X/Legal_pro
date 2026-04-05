import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { HiUserGroup, HiSearch, HiBadgeCheck, HiShieldCheck, HiMail } from 'react-icons/hi'
import useAuthStore from '../store/useAuthStore'
import clsx from 'clsx'

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

export default function SupportPage() {
    const { activeAccounts, user } = useAuthStore()
    const [search, setSearch] = useState('')

    // Ensure we have activeAccounts array, filter by search query
    const accounts = Array.isArray(activeAccounts) ? activeAccounts : []
    const filtered = accounts.filter(acc => 
        acc.name.toLowerCase().includes(search.toLowerCase()) || 
        acc.email.toLowerCase().includes(search.toLowerCase()) ||
        acc.firm?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-10 max-w-7xl mx-auto px-2 pb-20">
            {/* Header Section */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end border-b border-slate-200 pb-10 relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
                <div className="space-y-4">
                    <div className="h-14 w-14 bg-black rounded-full flex items-center justify-center shadow-2xl ring-8 ring-slate-50 mb-4">
                        <HiUserGroup className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Support Dashboard</h1>
                    <p className="text-slate-500 max-w-xl text-sm font-medium leading-relaxed">
                        Real-time overview of all active, approved personnel using the platform.
                    </p>
                </div>
                
                <div className="w-full sm:w-80 group relative z-10">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-black transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-full bg-slate-100 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-300 transition-all font-bold text-xs uppercase tracking-widest"
                    />
                </div>
            </motion.div>

            {/* Stats Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden flex items-center gap-6 shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] -mr-10 -mt-10 pointer-events-none" />
                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner">
                        <HiBadgeCheck className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">Total Active Users</p>
                        <p className="text-4xl font-black">{accounts.length}</p>
                    </div>
                </div>
                {user?.role === 'Admin' && (
                    <div className="bg-emerald-50 rounded-[32px] p-8 border border-emerald-100 relative overflow-hidden flex items-center gap-6">
                         <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                            <HiShieldCheck className="h-8 w-8 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-emerald-800 uppercase tracking-widest mb-1">Admin Access</p>
                            <p className="text-xl font-bold text-emerald-600">Full Visibility Active</p>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Users Table */}
            <motion.div variants={itemVariants} className="bg-white border rounded-[40px] overflow-hidden shadow-sm">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="py-7 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Identity</th>
                                <th className="py-7 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                <th className="py-7 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Organization</th>
                                <th className="py-7 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-32 text-center">
                                        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <HiUserGroup className="h-10 w-10 text-slate-300" />
                                        </div>
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">No matching active users found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((u, i) => (
                                    <tr key={u.id || i} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="py-7 px-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                    {u.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 tracking-tight">{u.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {u.id?.slice(0, 8) || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-7 px-6">
                                            <div className="flex items-center gap-2">
                                                <HiMail className="h-4 w-4 text-slate-400" />
                                                <span className="text-xs font-bold text-slate-600">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-7 px-6">
                                            <span className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-full font-black text-slate-600 uppercase tracking-widest group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                                                {u.firm || 'Independent'}
                                            </span>
                                        </td>
                                        <td className="py-7 px-6">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={clsx(
                                                    "text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest",
                                                    u.accountStatus === 'active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                                )}>
                                                    {u.accountStatus || 'Active'}
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-1">
                                                    {u.role === 'Admin' ? <HiShieldCheck className="h-3 w-3 text-purple-500" /> : null}
                                                    {u.role}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    )
}
