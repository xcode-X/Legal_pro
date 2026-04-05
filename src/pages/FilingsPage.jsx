/**
 * FilingsPage — Track all document submission statuses with timeline view.
 * Redesigned for High-End Professional Legal UX with Icon Actions.
 */
import React, { useState } from 'react'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiClipboardList, HiCheckCircle, HiClock, HiXCircle,
    HiUpload, HiChevronDown, HiChevronUp, HiDocumentText,
    HiLightningBolt, HiTrendingUp, HiBadgeCheck, HiExclamationCircle,
    HiEye, HiTrash, HiDownload, HiArrowRight
} from 'react-icons/hi'
import useDocumentStore from '../store/useDocumentStore'
import useToastStore from '../store/useToastStore'
import StatusBadge from '../components/ui/StatusBadge'
import clsx from 'clsx'

const STATUS_TIMELINE = {
    Draft: ['Draft'],
    Pending: ['Draft', 'Pending'],
    Submitted: ['Draft', 'Pending', 'Submitted'],
    Approved: ['Draft', 'Pending', 'Submitted', 'Approved'],
    Rejected: ['Draft', 'Pending', 'Submitted', 'Rejected'],
}

const TIMELINE_STEPS = ['Draft', 'Pending', 'Submitted', 'Approved']

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } }

function FilingAction({ icon: Icon, onClick, title, danger = false, disabled = false }) {
    return (
        <button
            onClick={(e) => { e.stopPropagation(); !disabled && onClick(e) }}
            title={title}
            disabled={disabled}
            className={clsx(
                "h-9 w-9 rounded-full flex items-center justify-center transition-all border shadow-sm disabled:opacity-30 disabled:cursor-not-allowed",
                danger 
                    ? "bg-white border-red-100 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500" 
                    : "bg-white border-slate-200 text-slate-400 hover:bg-black hover:text-white hover:border-black"
            )}
        >
            <Icon className="h-4 w-4" />
        </button>
    )
}

function FilingRow({ doc, onSubmit }) {
    const [expanded, setExpanded] = useState(false)
    const completedSteps = STATUS_TIMELINE[doc.status] || []

    return (
        <motion.div variants={itemVariants} className="group bg-white rounded-[32px] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div
                className="flex items-center justify-between p-6 cursor-pointer"
                onClick={() => setExpanded((e) => !e)}
            >
                <div className="flex items-center gap-6 min-w-0 flex-1">
                    {/* Circle Icon Area */}
                    <div className="relative flex-shrink-0 group-hover:scale-110 transition-transform">
                        <div className="h-14 w-14 bg-black rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(0,0,0,0.15)] ring-4 ring-slate-50">
                            <HiDocumentText className="h-7 w-7 text-white" />
                        </div>
                        {doc.status === 'Approved' && (
                             <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                                <HiBadgeCheck className="h-3.5 w-3.5 text-white" />
                            </div>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                            <h3 className="text-lg font-black text-slate-900 truncate tracking-tight">{doc.title}</h3>
                            <StatusBadge status={doc.status} />
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <HiClock className="h-3 w-3 text-slate-400" />
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {doc.submittedAt
                                        ? `Filed ${format(new Date(doc.submittedAt), 'MMM d, yyyy')}`
                                        : `Drafted ${format(new Date(doc.createdAt), 'MMM d, yyyy')}`}
                                </p>
                            </div>
                            <span className="h-3 w-px bg-slate-200" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.type}</p>
                        </div>
                    </div>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-2 ml-6">
                    <div className="flex items-center gap-2 pr-4 border-r border-slate-100">
                        {doc.status === 'Draft' && (
                            <FilingAction 
                                icon={HiUpload} 
                                title="Transmit filing" 
                                onClick={() => onSubmit(doc.id)} 
                            />
                        )}
                        <FilingAction icon={HiEye} title="Preview Artifact" onClick={() => {}} />
                        <FilingAction icon={HiDownload} title="Export Formal PDF" onClick={() => {}} />
                        <FilingAction icon={HiTrash} title="Purge Record" danger onClick={() => {}} />
                    </div>
                    
                    <button className={clsx(
                        "h-10 w-10 rounded-2xl flex items-center justify-center transition-all ml-2",
                        expanded ? "bg-black text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                    )}>
                        {expanded ? <HiChevronUp className="h-5 w-5" /> : <HiChevronDown className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-8 pb-8 pt-2 border-t border-slate-100 bg-slate-50/20">
                            {/* Sophisticated Progress timeline */}
                            <div className="py-10 max-w-2xl mx-auto">
                                <div className="flex items-center">
                                    {TIMELINE_STEPS.map((step, i) => {
                                        const isCompleted = completedSteps.includes(step)
                                        const isCurrent = doc.status === step
                                        const isRejected = doc.status === 'Rejected' && step === 'Approved'

                                        return (
                                            <React.Fragment key={step}>
                                                <div className="flex flex-col items-center relative z-10 group/step">
                                                    <div className={clsx(
                                                        "h-11 w-11 rounded-full flex items-center justify-center shadow-sm transition-all border-4 border-slate-50",
                                                        isRejected ? 'bg-red-600 text-white shadow-red-200' :
                                                        isCompleted ? 'bg-emerald-500 text-white shadow-emerald-100' :
                                                        isCurrent ? 'bg-black text-white ring-4 ring-slate-100' :
                                                        'bg-white text-slate-200 border-slate-100'
                                                    )}>
                                                        {isRejected
                                                            ? <HiXCircle className="h-5 w-5" />
                                                            : isCompleted
                                                                ? <HiCheckCircle className="h-6 w-6" />
                                                                : <HiClock className="h-5 w-5" />
                                                        }
                                                    </div>
                                                    <span className={clsx(
                                                        "mt-3 text-[10px] font-black uppercase tracking-[0.15em] text-center transition-colors",
                                                        isRejected ? 'text-red-500' : 
                                                        isCompleted || isCurrent ? 'text-slate-900' : 
                                                        'text-slate-300'
                                                    )}>
                                                        {isRejected ? 'Rejected' : step}
                                                    </span>
                                                </div>
                                                {i < TIMELINE_STEPS.length - 1 && (
                                                    <div className="flex-1 h-1.5 mx-2 -mt-7">
                                                        <div className={clsx(
                                                            "h-full rounded-full transition-all duration-700 ease-out",
                                                            completedSteps.includes(TIMELINE_STEPS[i + 1]) ? 'bg-emerald-500' : 'bg-slate-100'
                                                        )} />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Document Meta Information Header */}
                            <div className="flex items-center gap-3 mb-4 px-2">
                                <span className="h-1 w-8 rounded-full bg-slate-900" />
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Formal Metadata Analysis</h4>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Classification', value: doc.type, icon: HiBadgeCheck },
                                    { label: 'Protocol Version', value: `Build v${doc.version}.0`, icon: HiLightningBolt },
                                    { label: 'Physical Length', value: `${doc.pageCount} Sequential Pages`, icon: HiClipboardList },
                                    { label: 'Lexical Volume', value: `${doc.wordCount.toLocaleString()} Words`, icon: HiTrendingUp },
                                ].map((stat) => (
                                    <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-slate-400 transition-colors">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="h-7 w-7 bg-slate-50 rounded-lg flex items-center justify-center">
                                                <stat.icon className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                                        </div>
                                        <p className="text-sm font-black text-slate-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default function FilingsPage() {
    const { documents, submitFiling } = useDocumentStore()
    const { addToast } = useToastStore()
    const [activeTab, setActiveTab] = useState('All')

    const handleSubmit = (docId) => {
        submitFiling(docId)
        addToast('Document successfully transmitted to judicial portal.', 'success')
    }

    const TABS = ['All', 'Pending', 'Submitted', 'Approved', 'Rejected', 'Draft']

    const filtered = activeTab === 'All' ? documents : documents.filter((d) => d.status === activeTab)

    const counts = TABS.reduce((acc, t) => {
        acc[t] = t === 'All' ? documents.length : documents.filter((d) => d.status === t).length
        return acc
    }, {})

    // Advanced Stats Redesign
    const stats = [
        { label: 'Total Dossiers', value: documents.length, icon: HiClipboardList, gradient: 'from-slate-900 via-slate-800 to-slate-900' },
        { label: 'Pending Transmit', value: counts['Pending'], icon: HiClock, gradient: 'from-slate-900 via-slate-800 to-indigo-950' },
        { label: 'In Adjudication', value: counts['Submitted'], icon: HiLightningBolt, gradient: 'from-indigo-950 via-slate-900 to-slate-900' },
        { label: 'Verified Results', value: counts['Approved'], icon: HiBadgeCheck, gradient: 'from-slate-900 via-slate-800 to-slate-900' },
    ]

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-10 max-w-7xl mx-auto px-2 pb-20">
            
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center relative py-6 border-b border-slate-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
                <div className="h-16 w-16 bg-black rounded-full mx-auto flex items-center justify-center mb-5 shadow-2xl ring-8 ring-slate-50">
                    <HiClipboardList className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 uppercase">Filings & Submissions</h1>
                <p className="text-slate-500 max-w-xl mx-auto text-sm font-medium leading-relaxed">
                    Continuously track the procedural trajectory and adjudication status of all legal artifacts and formal submissions.
                </p>
                
                <div className="mt-8 flex items-center justify-center gap-3">
                     <div className="bg-slate-100 p-1.5 rounded-[20px] flex gap-1 shadow-inner border border-slate-200 overflow-x-auto no-scrollbar max-w-full">
                        {TABS.map((t) => (
                            <button
                                key={t}
                                onClick={() => setActiveTab(t)}
                                className={clsx(
                                    "px-6 py-2.5 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center gap-3 whitespace-nowrap",
                                    activeTab === t ? "bg-white text-slate-900 shadow-sm border border-slate-200/50" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {t}
                                {counts[t] > 0 && <span className={clsx("h-5 min-w-[20px] px-1.5 flex items-center justify-center rounded-lg text-[9px] font-black", activeTab === t ? "bg-black text-white" : "bg-slate-200 text-slate-500")}>{counts[t]}</span>}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* High-End Intelligence Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className={clsx("relative overflow-hidden rounded-[32px] p-7 shadow-lg border border-slate-800/50 bg-gradient-to-br transition-all hover:scale-[1.02] hover:-translate-y-1", s.gradient)}>
                         <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                            <s.icon className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="h-11 w-11 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex items-center justify-center mb-10 shadow-inner">
                                <s.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <p className="text-4xl font-black text-white leading-none mb-2 tracking-tight">{s.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* Filings Timeline Ledger */}
            <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center justify-between px-6 mb-2">
                    <div className="flex items-center gap-3">
                         <div className="h-1 w-6 rounded-full bg-black" />
                         <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em]">Procedural Registry Ledger</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                         Transmission Protocol Matrix
                    </div>
                </div>

                {filtered.length === 0 ? (
                    <div className="bg-slate-50 border border-slate-200 border-dashed rounded-[40px] py-40 text-center flex flex-col items-center justify-center">
                        <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
                             <HiExclamationCircle className="h-10 w-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[11px]">No matching records detected in synchronization</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((doc) => <FilingRow key={doc.id} doc={doc} onSubmit={handleSubmit} />)}
                    </div>
                )}
            </motion.div>
        </motion.div>
    )
}
