/**
 * DashboardPage — Main overview with stats, charts, quick actions,
 * AI alerts, and recent documents list.
 */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiDocumentText, HiPlus, HiTemplate, HiClipboardList,
    HiSparkles, HiTrendingUp, HiCheckCircle, HiClock, HiExclamation,
    HiX
} from 'react-icons/hi'
import { 
    FcOpenedFolder, FcDocument, FcFlowChart, FcTimeline 
} from 'react-icons/fc'
import useDocumentStore from '../store/useDocumentStore'
import useAuthStore from '../store/useAuthStore'
import StatusBadge from '../components/ui/StatusBadge'
import { StatCardSkeleton } from '../components/ui/SkeletonLoader'
import { format } from 'date-fns'

const AREA_DATA = [
    { month: 'Oct', docs: 12 }, { month: 'Nov', docs: 18 }, { month: 'Dec', docs: 14 },
    { month: 'Jan', docs: 24 }, { month: 'Feb', docs: 31 }, { month: 'Mar', docs: 28 },
    { month: 'Apr', docs: 42 },
]

const PIE_COLORS = ['#64748b', '#f59e0b', '#3b82f6', '#10b981', '#ef4444']

const dashboardContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function DashboardPage() {
    const { documents, templates } = useDocumentStore()
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    
    // Real-Time States
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1200)
        return () => clearTimeout(t)
    }, [])

    // Real-time ticking effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    const getGreeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        return 'Good evening'
    }

    const statusBreakdown = ['Draft', 'Pending', 'Submitted', 'Approved', 'Rejected'].map((s) => ({
        name: s,
        value: documents.filter((d) => d.status === s).length,
    })).filter((s) => s.value > 0)

    const recent = documents.slice(0, 5)

    const stats = [
        {
            label: 'Total Documents',
            value: documents.length,
            icon: FcDocument,
            color: 'bg-white border border-gray-100 shadow-sm',
            trend: '+12%',
        },
        {
            label: 'Pending Review',
            value: documents.filter((d) => d.status === 'Pending').length,
            icon: FcTimeline,
            color: 'bg-white border border-gray-100 shadow-sm',
            trend: '—',
        },
        {
            label: 'Approved',
            value: documents.filter((d) => d.status === 'Approved').length,
            icon: HiCheckCircle,
            color: 'bg-emerald-50 text-emerald-600',
            trend: '+8%',
        },
        {
            label: 'Templates',
            value: templates.length,
            icon: FcFlowChart,
            color: 'bg-white border border-gray-100 shadow-sm',
            trend: '—',
        },
    ]

    const aiAlerts = [
        { type: 'warning', text: 'Service Agreement expires in 7 days.' },
        { type: 'info', text: 'AI detected uncommon clauses in draft NDA.' },
    ]

    const alertStyle = {
        warning: { icon: HiExclamation, bg: 'bg-amber-50 border-amber-100', text: 'text-amber-700', icon_: 'text-amber-500' },
        info: { icon: HiSparkles, bg: 'bg-blue-50 border-blue-100', text: 'text-blue-700', icon_: 'text-blue-500' },
        success: { icon: HiCheckCircle, bg: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-700', icon_: 'text-emerald-500' },
    }

    return (
        <>

            <motion.div
                initial="hidden"
                animate="show"
                variants={dashboardContainer}
                className="space-y-6 max-w-6xl mx-auto"
            >
                {/* Page heading */}
                <motion.div variants={item} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="page-title">{getGreeting()}, {user?.name?.split(' ')[0] || 'Admin'} 👋</h1>
                        <p className="page-subtitle flex items-center gap-2 mt-1">
                            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border border-gray-200">
                                {format(currentTime, 'EEEE, MMMM do yyyy | hh:mm a')}
                            </span>
                        </p>
                    </div>
                    <button onClick={() => navigate('/generate')} className="btn-primary flex items-center gap-2 shadow-primary-500/30 shadow-lg">
                        <HiPlus className="h-4 w-4" />
                        New Document
                    </button>
                </motion.div>

                {/* Stats */}
                <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                        : stats.map((s) => (
                            <div key={s.label} className="card hover:shadow-soft-lg transition-all duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                                        <s.icon className={`h-6 w-6 ${s.icon === HiCheckCircle ? s.color : ''}`} />
                                    </div>
                                    {s.trend !== '—' && (
                                        <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <HiTrendingUp className="h-3.5 w-3.5" />
                                            {s.trend}
                                        </div>
                                    )}
                                </div>
                                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{s.value}</p>
                                <p className="text-sm font-medium text-gray-500 mt-1">{s.label}</p>
                            </div>
                        ))
                    }
                </motion.div>

                {/* Charts row */}
                <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Area chart */}
                    <div className="card lg:col-span-2 shadow-sm border border-gray-100">
                        <p className="section-heading">Document Generation Trend</p>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={AREA_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: 12 }}
                                    labelStyle={{ color: '#475569', fontWeight: 600 }}
                                />
                                <Area type="monotone" dataKey="docs" stroke="#2563eb" strokeWidth={2}
                                    fill="url(#colorDocs)" dot={false} activeDot={{ r: 4, fill: '#2563eb' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie chart */}
                    <div className="card shadow-sm border border-gray-100 flex flex-col">
                        <p className="section-heading mb-0">Filing Status</p>
                        {statusBreakdown.length > 0 ? (
                            <div className="flex-1 min-h-[260px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={statusBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                                        paddingAngle={3} dataKey="value">
                                        {statusBreakdown.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
                        )}
                    </div>
                </motion.div>

                {/* Bottom row */}
                <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4 pb-12">
                    {/* Recent documents */}
                    <div className="card lg:col-span-2 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <p className="section-heading mb-0">Recent Documents</p>
                            <button onClick={() => navigate('/documents')} className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                                View all →
                            </button>
                        </div>
                        {loading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="h-16 shimmer rounded-xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {recent.map((doc) => (
                                    <div key={doc.id}
                                        onClick={() => navigate('/documents')}
                                        className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors group">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-11 w-11 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform folder-icon-wrapper">
                                                <FcOpenedFolder className="h-6 w-6 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-800 truncate">{doc.title}</p>
                                                <p className="text-xs text-gray-400">
                                                    {format(new Date(doc.createdAt), 'MMM d, yyyy')} · {doc.author}
                                                </p>
                                            </div>
                                        </div>
                                        <StatusBadge status={doc.status} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* AI Alerts */}
                    <div className="card shadow-sm border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                            <HiSparkles className="h-4 w-4 text-primary-600" />
                            <p className="section-heading mb-0">AI Alerts</p>
                        </div>
                        <div className="space-y-3">
                            {aiAlerts.map((a, i) => {
                                const st = alertStyle[a.type]
                                const Icon = st.icon
                                return (
                                    <div key={i} className={`flex gap-2.5 p-3 rounded-lg border ${st.bg}`}>
                                        <Icon className={`h-4 w-4 flex-shrink-0 mt-0.5 ${st.icon_}`} />
                                        <p className={`text-xs leading-relaxed ${st.text}`}>{a.text}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </>
    )
}
