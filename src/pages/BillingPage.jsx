/**
 * BillingPage — High-end professional financial dashboard for legal practices.
 * Creative, professional, and built with modern legal SaaS aesthetics.
 */
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiCreditCard, HiTrendingUp, HiDocumentDuplicate,
    HiClock, HiPlus, HiSearch, HiReceiptTax,
    HiDownload, HiEye, HiX, HiLightningBolt,
    HiExclamationCircle, HiShieldCheck, HiArrowRight, HiTrash, HiIdentification
} from 'react-icons/hi'
import StatusBadge from '../components/ui/StatusBadge'
import Modal from '../components/ui/Modal'
import useToastStore from '../store/useToastStore'
import { format } from 'date-fns'
import clsx from 'clsx'

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } }
}

const EMPTY_INVOICE = { client: '', document: '', amount: '', status: 'Unpaid' }

export default function BillingPage() {
    const { addToast } = useToastStore()
    const [search, setSearch] = useState('')
    const [activeTab, setActiveTab] = useState('All')
    const [showNewInvoice, setShowNewInvoice] = useState(false)
    const [newInvoice, setNewInvoice] = useState(EMPTY_INVOICE)

    const [invoices, setInvoices] = useState([
        { id: 'INV-2026-001', client: 'Acme Corp Liberia', amount: 1500.00, document: 'Service Agreement', date: '2024-03-25', status: 'Paid' },
        { id: 'INV-2026-002', client: 'Tech Solutions Ltd.', amount: 450.00, document: 'NDA Preparation', date: '2024-03-28', status: 'Unpaid' },
        { id: 'INV-2026-003', client: 'Monrovia Imports', amount: 2300.00, document: 'Property Deed Filing', date: '2024-04-01', status: 'Unpaid' },
        { id: 'INV-2026-004', client: 'Michael B. Davies', amount: 125.00, document: 'Affidavit of Support', date: '2024-03-15', status: 'Overdue' },
        { id: 'INV-2026-005', client: 'Elena K. Howard', amount: 800.00, document: 'Employment Contract', date: '2024-04-02', status: 'Paid' },
    ])

    const paidTotal = invoices.filter(i => i.status === 'Paid').reduce((a, b) => a + b.amount, 0)
    const pendingTotal = invoices.filter(i => i.status === 'Unpaid').reduce((a, b) => a + b.amount, 0)
    const overdueTotal = invoices.filter(i => i.status === 'Overdue').reduce((a, b) => a + b.amount, 0)

    const stats = [
        { label: 'Verified Revenue', value: paidTotal, icon: HiShieldCheck, gradient: 'from-slate-900 via-slate-800 to-slate-900', text: 'text-white' },
        { label: 'Pending Liquidity', value: pendingTotal, icon: HiClock, gradient: 'from-white to-slate-50', text: 'text-slate-900', border: 'border-slate-100' },
        { label: 'Arrears Protocol', value: overdueTotal, icon: HiExclamationCircle, gradient: 'from-white to-slate-50', text: 'text-red-600', border: 'border-slate-100' },
    ]

    const filtered = invoices.filter(inv => {
        const matchesTab = activeTab === 'All' || inv.status === activeTab
        const matchesSearch = inv.client.toLowerCase().includes(search.toLowerCase()) ||
            inv.id.toLowerCase().includes(search.toLowerCase())
        return matchesTab && matchesSearch
    })

    const handleAddInvoice = () => {
        if (!newInvoice.client.trim() || !newInvoice.document.trim() || !newInvoice.amount) return
        const id = `INV-2026-${Math.floor(100 + Math.random() * 900)}`
        setInvoices(prev => [{
            id,
            client: newInvoice.client,
            document: newInvoice.document,
            amount: parseFloat(newInvoice.amount),
            date: new Date().toISOString(),
            status: newInvoice.status,
        }, ...prev])
        setNewInvoice(EMPTY_INVOICE)
        setShowNewInvoice(false)
        addToast(`Financial record for ${newInvoice.client} initialized.`, 'success')
    }

    const TABS = ['All', 'Paid', 'Unpaid', 'Overdue']

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-12 max-w-7xl mx-auto px-2 pb-20">
            
            {/* Header / Brand Action Area */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row gap-8 justify-between items-start lg:items-end border-b border-slate-200 pb-10 relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
                <div className="space-y-4">
                    <div className="h-14 w-14 bg-black rounded-full flex items-center justify-center shadow-2xl ring-8 ring-slate-50 mb-4">
                        <HiCreditCard className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Billing & Invoicing</h1>
                    <p className="text-slate-500 max-w-md text-sm font-medium leading-relaxed">
                        Precision tracking of firm-wide revenue streams, automated legal fee distribution, and real-time arrears monitoring.
                    </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                    <div className="relative w-full sm:w-80 group">
                        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-black transition-colors" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search IDs or Entitites..."
                            className="w-full bg-slate-100 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-12 pr-4 outline-none focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-300 transition-all font-bold text-xs uppercase tracking-widest"
                        />
                    </div>
                    <button 
                        onClick={() => setShowNewInvoice(true)} 
                        className="w-full sm:w-auto py-4 px-8 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 hover:scale-[1.03] transition-all shadow-2xl flex items-center justify-center gap-3"
                    >
                        <HiPlus className="h-4 w-4" /> Initialize Invoice
                    </button>
                </div>
            </motion.div>

            {/* Financial Intelligence Dashboard */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((s, i) => (
                    <div key={i} className={clsx(
                        "relative overflow-hidden rounded-[40px] p-8 shadow-sm transition-all border group",
                        s.gradient,
                        s.border || 'border-transparent'
                    )}>
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                            <s.icon className={clsx("w-32 h-32", s.text)} />
                        </div>
                        <div className="relative z-10">
                            <div className={clsx("h-11 w-11 rounded-2xl flex items-center justify-center mb-10 shadow-inner border", i === 0 ? "bg-white/10 border-white/10" : "bg-slate-100 border-slate-100")}>
                                <s.icon className={clsx("h-5 w-5", s.text)} />
                            </div>
                            <p className={clsx("text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-60", s.text)}>{s.label}</p>
                            <div className="flex items-baseline gap-2">
                                <span className={clsx("text-4xl font-black tracking-tighter", s.text)}>
                                    ${s.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </span>
                                <span className={clsx("text-[10px] font-bold uppercase tracking-widest opacity-40", s.text)}>USD</span>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Ledger Navigation & Table */}
            <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                    <div className="flex items-center gap-4 bg-slate-100 p-1.5 rounded-[22px] border border-slate-200">
                        {TABS.map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={clsx(
                                    "px-7 py-2.5 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all",
                                    activeTab === tab 
                                        ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                                        : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-900 opacity-20" />
                        Live Synchronized Ledger 2026.4
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="py-7 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoicing Identity</th>
                                    <th className="py-7 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedural Artifact</th>
                                    <th className="py-7 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Scope</th>
                                    <th className="py-7 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Badge</th>
                                    <th className="py-7 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <AnimatePresence mode='popLayout'>
                                    {filtered.map((inv, idx) => (
                                        <motion.tr
                                            layout
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.03 } }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            key={inv.id}
                                            className="group hover:bg-slate-50/50 transition-colors"
                                        >
                                            <td className="py-7 px-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg shrink-0">
                                                        <HiIdentification className="h-5 w-5" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter mb-1">{inv.id}</span>
                                                        <span className="text-sm font-black text-slate-900 group-hover:underline cursor-pointer">{inv.client}</span>
                                                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mt-1">{format(new Date(inv.date), 'MMMM d, yyyy')}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-7 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm group-hover:scale-110 transition-transform">
                                                        <HiDocumentDuplicate className="h-6 w-6 text-slate-400" />
                                                    </div>
                                                    <span className="text-sm font-black text-slate-700 tracking-tight">{inv.document}</span>
                                                </div>
                                            </td>
                                            <td className="py-7 px-6">
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black text-slate-900 tracking-tighter">${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">USD Base Rate</span>
                                                </div>
                                            </td>
                                            <td className="py-7 px-6 text-center">
                                                <StatusBadge status={inv.status} />
                                            </td>
                                            <td className="py-7 px-10 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                                    <button className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm">
                                                        <HiEye className="h-4 w-4" />
                                                    </button>
                                                    <button className="h-10 w-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm">
                                                        <HiDownload className="h-4 w-4" />
                                                    </button>
                                                    <button className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm">
                                                        <HiTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center">
                                            <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <HiLightningBolt className="h-10 w-10 text-slate-200" />
                                            </div>
                                            <p className="text-slate-400 font-black uppercase tracking-widest text-[11px]">No financial matching records found</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Initialize Invoice Modal — Redesigned */}
            <Modal
                isOpen={showNewInvoice}
                onClose={() => { setShowNewInvoice(false); setNewInvoice(EMPTY_INVOICE) }}
                title="Protocol Architect — Financial Invoice"
                size="md"
                footer={
                    <div className="flex w-full justify-between items-center px-4">
                         <button onClick={() => { setShowNewInvoice(false); setNewInvoice(EMPTY_INVOICE) }} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Discard Draft</button>
                         <button 
                            onClick={handleAddInvoice} 
                            disabled={!newInvoice.client.trim() || !newInvoice.document.trim() || !newInvoice.amount} 
                            className="px-10 py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.15)] disabled:opacity-30"
                         >
                            Initialize Record
                         </button>
                    </div>
                }
            >
                <div className="space-y-8 pt-4">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-1 w-8 rounded-full bg-slate-900" />
                            <h4 className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">Core Remittance Details</h4>
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Receiving Entity *</label>
                            <input
                                type="text"
                                value={newInvoice.client}
                                onChange={(e) => setNewInvoice(p => ({ ...p, client: e.target.value }))}
                                placeholder="Legal Client or Corporate ID"
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm"
                            />
                        </div>
                        
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Associated Procedure *</label>
                            <input
                                type="text"
                                value={newInvoice.document}
                                onChange={(e) => setNewInvoice(p => ({ ...p, document: e.target.value }))}
                                placeholder="Case Title or Document ID"
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Quantum (USD) *</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={newInvoice.amount}
                                    onChange={(e) => setNewInvoice(p => ({ ...p, amount: e.target.value }))}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Protocol Status</label>
                                <select
                                    value={newInvoice.status}
                                    onChange={(e) => setNewInvoice(p => ({ ...p, status: e.target.value }))}
                                    className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm cursor-pointer appearance-none"
                                >
                                    {['Unpaid', 'Paid', 'Overdue'].map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/5 shrink-0">
                                <HiShieldCheck className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Financial Integrity</p>
                                <p className="text-xs font-medium leading-relaxed opacity-80">Initialization of this record will trigger a cross-ledger synchronization and formal document generation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </motion.div>
    )
}
