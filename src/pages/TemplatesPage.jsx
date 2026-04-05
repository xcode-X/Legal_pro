/**
 * TemplatesPage — Premium template cards with full-screen document preview panel.
 */
import React, { useState } from 'react'
import {
    HiPlus, HiTrash, HiTemplate, HiSearch, HiX, HiLightningBolt,
    HiDocumentText, HiClock, HiTrendingUp, HiCheck, HiTag,
    HiOutlineArrowRight, HiOutlineDownload, HiCollection,
} from 'react-icons/hi'
import useDocumentStore from '../store/useDocumentStore'
import useAuthStore from '../store/useAuthStore'
import Modal from '../components/ui/Modal'
import TemplateIcon from '../components/ui/TemplateIcon'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

// Professional monochromatic themes
const CATEGORY_THEME = {
    Contract:       { gradient: 'from-slate-700 to-slate-900' },
    Affidavit:      { gradient: 'from-slate-700 to-slate-900' },
    Petition:       { gradient: 'from-slate-700 to-slate-900' },
    Correspondence: { gradient: 'from-slate-700 to-slate-900' },
    Deed:           { gradient: 'from-slate-700 to-slate-900' },
    Other:          { gradient: 'from-slate-700 to-slate-900' },
}

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 26 } } }

// Renders placeholders in template content as highlighted spans
function RenderedContent({ content }) {
    const parts = content.split(/(\[[A-Za-z]+\])/g)
    return (
        <span>
            {parts.map((part, i) => {
                const isPlaceholder = /^\[[A-Za-z]+\]$/.test(part)
                if (isPlaceholder) {
                    return (
                        <mark key={i} className="bg-amber-100 text-amber-800 rounded px-0.5 font-semibold not-italic">
                            {part}
                        </mark>
                    )
                }
                return <span key={i}>{part}</span>
            })}
        </span>
    )
}

export default function TemplatesPage() {
    const { templates, addTemplate, deleteTemplate } = useDocumentStore()
    const { user } = useAuthStore()
    const navigate = useNavigate()
    const isAdmin = user?.role === 'Admin'

    const [search, setSearch] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [viewMode, setViewMode] = useState('table')
    const [showCreate, setShowCreate] = useState(false)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [previewTemplate, setPreviewTemplate] = useState(null)
    const [newTemplate, setNewTemplate] = useState({ name: '', category: 'Contract', description: '', icon: 'document' })

    const categories = ['All', ...new Set(templates.map(t => t.category))]

    const filtered = templates.filter(t => {
        const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase())
        const matchCat = categoryFilter === 'All' || t.category === categoryFilter
        return matchSearch && matchCat
    })

    const handleCreate = () => {
        if (!newTemplate.name.trim()) return
        addTemplate({
            id: `tpl_custom_${Date.now()}`,
            ...newTemplate,
            fields: newTemplate.fields || [],
            content: `[Document content for ${newTemplate.name}]`,
            createdAt: new Date().toISOString(),
            usageCount: 0,
            estimatedTime: '< 2 min',
        })
        setNewTemplate({ name: '', category: 'Contract', description: '', icon: 'document' })
        setShowCreate(false)
    }

    const handleDelete = (id) => {
        deleteTemplate(id)
        setConfirmDelete(null)
    }

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6">

            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="page-title">Templates</h1>
                    <p className="page-subtitle">{templates.length} legal document templates — click any card to preview</p>
                </div>
                {isAdmin && (
                    <button onClick={() => setShowCreate(true)} className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/30">
                        <HiPlus className="h-4 w-4" /> New Template
                    </button>
                )}
            </motion.div>

            {/* Search + Category filters */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
                    <div className="relative flex-1 min-w-48 max-w-sm">
                        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search templates..."
                            className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-medium text-sm"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setCategoryFilter(c)}
                                className={clsx(
                                    'text-xs px-4 py-2.5 rounded-xl font-bold transition-all duration-200 border',
                                    categoryFilter === c
                                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                )}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-xl shrink-0 self-end sm:self-auto shadow-inner">
                    <button onClick={() => setViewMode('table')} className={clsx('px-5 py-2 text-xs font-bold rounded-lg transition-all', viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700')}>Table View</button>
                    <button onClick={() => setViewMode('cards')} className={clsx('px-5 py-2 text-xs font-bold rounded-lg transition-all', viewMode === 'cards' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700')}>Cards View</button>
                </div>
            </motion.div>

            {/* Stats bar - High-end redesign with Gradients */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Templates', value: templates.length, icon: HiCollection, gradient: 'from-slate-900 via-slate-800 to-slate-900' },
                    { label: 'Total Executions', value: templates.reduce((a, t) => a + (t.usageCount || 0), 0), icon: HiTrendingUp, gradient: 'from-indigo-950 via-slate-900 to-slate-900' },
                    { label: 'Active Categories', value: categories.length - 1, icon: HiTag, gradient: 'from-slate-900 via-slate-800 to-slate-900' },
                    { label: 'Currently Showing', value: filtered.length, icon: HiDocumentText, gradient: 'from-slate-900 via-slate-800 to-indigo-950' },
                ].map(s => (
                    <div key={s.label} className={clsx("relative overflow-hidden rounded-3xl p-6 shadow-lg transition-all duration-300 hover:shadow-xl group border border-slate-800/50 bg-gradient-to-br", s.gradient)}>
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-500 pointer-events-none">
                            <s.icon className="w-24 h-24 text-white" />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="h-12 w-12 bg-black border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                <s.icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-3xl font-black text-white leading-none mb-1 tracking-tight">{s.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>

            {/* View Implementation */}
            {viewMode === 'table' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                    <th className="px-6 py-4">Template Overview</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Data Fields</th>
                                    <th className="px-6 py-4">Est. Target Time</th>
                                    <th className="px-6 py-4">Lifetime Usage</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filtered.map(tpl => (
                                    <tr key={tpl.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer group" onClick={() => setPreviewTemplate(tpl)}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-black p-2.5 rounded-full shadow-md group-hover:scale-110 transition-transform flex items-center justify-center">
                                                    <TemplateIcon name={tpl.icon} className="h-4 w-4 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm tracking-tight">{tpl.name}</p>
                                                    <p className="text-[11px] text-slate-500 max-w-[240px] truncate mt-0.5">{tpl.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-slate-600 border border-slate-200 shadow-sm">{tpl.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{tpl.fields.length} Configs required</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{tpl.estimatedTime}</td>
                                        <td className="px-6 py-4 text-xs font-semibold text-slate-600">{tpl.usageCount} generated</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="px-4 py-2 bg-slate-900 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg hover:bg-black transition-colors shadow-sm" onClick={(e) => { e.stopPropagation(); navigate('/generate', { state: { templateId: tpl.id } }) }}>Generate</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map(tpl => (
                            <motion.div
                                key={tpl.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl flex flex-col border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer p-6 relative overflow-hidden group"
                                onClick={() => setPreviewTemplate(tpl)}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none group-hover:bg-slate-200 transition-colors" />

                                <div className="flex items-start justify-between mb-5 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-black rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                            <TemplateIcon name={tpl.icon} className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{tpl.category}</span>
                                            <h3 className="font-extrabold text-slate-900 text-base leading-tight mt-0.5 pr-2 tracking-tight">{tpl.name}</h3>
                                        </div>
                                    </div>
                                    {isAdmin && (
                                        <button
                                            onClick={e => { e.stopPropagation(); setConfirmDelete(tpl) }}
                                            className="opacity-0 group-hover:opacity-100 p-2 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all flex-shrink-0"
                                        >
                                            <HiTrash className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                
                                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-2 relative z-10 font-medium">{tpl.description}</p>
                                
                                <div className="grid grid-cols-3 gap-3 mb-6 relative z-10 mt-auto">
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-colors group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                        <p className="text-sm font-black text-slate-800">{tpl.fields.length}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fields</p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-colors group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                        <p className="text-sm font-black text-slate-800">{tpl.usageCount}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Uses</p>
                                    </div>
                                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-center transition-colors group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-sm">
                                        <p className="text-sm font-black text-slate-800">{tpl.estimatedTime.replace('< ', '<')}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Time</p>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 relative z-10" onClick={e => e.stopPropagation()}>
                                    <button
                                        onClick={() => setPreviewTemplate(tpl)}
                                        className="flex-1 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-sm"
                                    >
                                        Preview Config
                                    </button>
                                    <button
                                        onClick={() => navigate('/generate', { state: { templateId: tpl.id } })}
                                        className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                                    >
                                        <HiLightningBolt className="h-3.5 w-3.5" /> Start
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

                {filtered.length === 0 && (
                    <div className="text-center py-20 text-slate-400 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <HiTemplate className="h-14 w-14 mx-auto mb-4 opacity-20" />
                        <p className="text-sm font-bold text-slate-500">No matching templates</p>
                        <p className="text-xs mt-1">Try adjusting your filters or search query.</p>
                    </div>
                )}

            {/* ── Full-screen Template Preview Drawer ─────────────────────── */}
            <AnimatePresence>
                {previewTemplate && (() => {
                    const theme = CATEGORY_THEME[previewTemplate.category] || CATEGORY_THEME.Other
                    const lines = previewTemplate.content.split('\n')
                    return (
                        <motion.div
                            key="preview-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40 backdrop-blur-sm"
                            onClick={() => setPreviewTemplate(null)}
                        >
                            <motion.div
                                key="preview-panel"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                                className="w-full max-w-3xl bg-white flex flex-col shadow-2xl overflow-hidden"
                                onClick={e => e.stopPropagation()}
                            >
                                {/* Panel header */}
                                <div className={`bg-gradient-to-br ${theme.gradient} px-8 py-6 flex-shrink-0`}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-sm flex-shrink-0">
                                                <TemplateIcon name={previewTemplate.icon} className="h-7 w-7 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-1">{previewTemplate.category} · Legal Template</p>
                                                <h2 className="text-xl font-black text-white leading-tight">{previewTemplate.name}</h2>
                                                <p className="text-sm text-white/70 mt-1">{previewTemplate.description}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => setPreviewTemplate(null)} className="h-9 w-9 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center text-white hover:bg-white/30 transition-colors flex-shrink-0 ml-4">
                                            <HiX className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Meta stats */}
                                    <div className="mt-5 flex items-center gap-5 text-xs text-white/70 font-medium">
                                        <span className="flex items-center gap-1.5"><HiDocumentText className="h-3.5 w-3.5" /> {previewTemplate.fields.length} fields</span>
                                        <span className="flex items-center gap-1.5"><HiTrendingUp className="h-3.5 w-3.5" /> {previewTemplate.usageCount} uses</span>
                                        <span className="flex items-center gap-1.5"><HiClock className="h-3.5 w-3.5" /> {previewTemplate.estimatedTime}</span>
                                        <span className="flex items-center gap-1.5"><HiCheck className="h-3.5 w-3.5" /> Created {format(new Date(previewTemplate.createdAt), 'MMM d, yyyy')}</span>
                                    </div>
                                </div>

                                {/* Two-column content */}
                                <div className="flex flex-1 min-h-0">

                                    {/* Left: Fields sidebar */}
                                    <div className="w-64 flex-shrink-0 border-r border-gray-100 flex flex-col bg-gray-50/50">
                                        <div className="px-5 py-4 border-b border-gray-100">
                                            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Required Fields</p>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                            {previewTemplate.fields.length === 0 ? (
                                                <p className="text-xs text-gray-400 italic">No fields defined.</p>
                                            ) : (
                                                previewTemplate.fields.map((f, i) => (
                                                    <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                                        <div className="flex items-center justify-between gap-2 mb-1">
                                                            <span className="text-xs font-bold text-gray-800 leading-tight">{f.label}</span>
                                                            {f.required && (
                                                                <span className="text-[9px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full flex-shrink-0">REQ</span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-semibold bg-gray-50 text-gray-400 px-2 py-0.5 rounded-lg uppercase">{f.type}</span>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Tips */}
                                        <div className="px-4 py-4 border-t border-gray-100 bg-amber-50/50">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">💡 How it works</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">Highlighted <mark className="bg-amber-100 text-amber-800 rounded px-0.5 font-semibold not-italic">[fields]</mark> get replaced with your data when you generate the document.</p>
                                        </div>
                                    </div>

                                    {/* Right: Document preview */}
                                    <div className="flex-1 flex flex-col min-w-0">
                                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                                            <div>
                                                <p className="text-xs font-bold text-gray-900">Document Preview</p>
                                                <p className="text-[10px] text-gray-400 mt-0.5">Rendered with placeholder fields highlighted</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="h-2 w-2 rounded-full bg-red-400" />
                                                <span className="h-2 w-2 rounded-full bg-amber-400" />
                                                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            </div>
                                        </div>

                                        {/* Paper document */}
                                        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
                                            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 min-h-full max-w-xl mx-auto">
                                                {/* Document header decoration */}
                                                <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-100">
                                                    <div>
                                                        <div className={`h-6 w-24 rounded-md bg-gradient-to-r ${theme.gradient} opacity-20 mb-1`} />
                                                        <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">LDGFA Legal Platform</p>
                                                    </div>
                                                    <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${theme.gradient} opacity-30 flex items-center justify-center`}>
                                                        <TemplateIcon name={previewTemplate.icon} className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>

                                                {/* Document content — rendered with highlighted placeholders */}
                                                <div className="text-[11px] leading-6 text-gray-700 font-mono whitespace-pre-wrap break-words">
                                                    <RenderedContent content={previewTemplate.content} />
                                                </div>

                                                {/* Footer watermark */}
                                                <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                    <p className="text-[9px] text-gray-300 uppercase tracking-widest font-mono">PREVIEW DOCUMENT · LDGFA</p>
                                                    <p className="text-[9px] text-gray-300 font-mono">Generated with LDGFA AI</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Panel footer */}
                                <div className="flex-shrink-0 border-t border-gray-100 px-8 py-5 flex items-center justify-between bg-white">
                                    <div>
                                        <p className="text-sm font-bold text-gray-900">{previewTemplate.name}</p>
                                        <p className="text-xs text-gray-400">{previewTemplate.fields.length} fields to fill · {previewTemplate.estimatedTime} to generate</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setPreviewTemplate(null)} className="btn-secondary px-5 text-sm">
                                            Close
                                        </button>
                                        <button
                                            onClick={() => {
                                                setPreviewTemplate(null)
                                                navigate('/generate', { state: { templateId: previewTemplate.id } })
                                            }}
                                            className={`px-8 py-3 text-sm font-bold text-white rounded-2xl bg-gradient-to-r ${theme.gradient} shadow-lg hover:opacity-90 transition-all flex items-center gap-2`}
                                        >
                                            <HiLightningBolt className="h-4 w-4" /> Start Generation
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )
                })()}
            </AnimatePresence>

            {/* Create Template Modal Redesign — High-End Studio Concept */}
            <Modal 
                isOpen={showCreate} 
                onClose={() => { setShowCreate(false); setNewTemplate({ name: '', category: 'Contract', description: '', icon: 'document', fields: [] }) }} 
                title="Protocol Architect — Template Design Studio" 
                size="xl"
                footer={
                    <div className="flex w-full justify-between items-center px-6">
                         <button onClick={() => setShowCreate(false)} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 transition-colors">Discard Draft</button>
                         <button 
                            onClick={handleCreate} 
                            disabled={!newTemplate.name.trim()} 
                            className="px-12 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-800 transition-all shadow-[0_20px_40px_rgba(0,0,0,0.2)] disabled:opacity-30 disabled:cursor-not-allowed transform active:scale-95"
                         >
                            Initialize Protocol
                         </button>
                    </div>
                }
            >
                <div className="flex flex-col lg:flex-row min-h-[600px] bg-white rounded-[40px] overflow-hidden -m-6 border border-slate-100 shadow-2xl">
                    
                    {/* Left Panel: Core Archetype (High-Contrast Dark) */}
                    <div className="lg:w-[400px] bg-slate-950 p-12 text-white relative flex flex-col justify-between overflow-hidden shrink-0">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-[100px]" />
                            <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-slate-700 rounded-full blur-[80px]" />
                        </div>

                        <div className="relative z-10 space-y-10">
                            <div>
                                <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 mb-8">
                                    <HiTemplate className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tight leading-tight mb-4 uppercase">Core<br/>Archetype</h3>
                                <p className="text-slate-400 text-xs font-medium leading-relaxed">Establish the foundational metadata for this legal protocol artifact. All definitions here drive global search and cross-client indexing.</p>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 block">Protocol Nomenclature</label>
                                    <input 
                                        type="text" 
                                        value={newTemplate.name} 
                                        onChange={e => setNewTemplate(t => ({ ...t, name: e.target.value }))} 
                                        placeholder="e.g. Master Lease v3" 
                                        className="w-full bg-slate-900/50 border border-slate-800/50 text-white rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-white/5 transition-all font-bold text-sm" 
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 block">Classification Sequence</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Contract', 'Affidavit', 'Petition', 'Correspondence'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setNewTemplate(t => ({ ...t, category: cat }))}
                                                className={clsx(
                                                    "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                                    newTemplate.category === cat 
                                                        ? "bg-white text-slate-900 border-white shadow-xl scale-[1.03]" 
                                                        : "bg-slate-900/50 text-slate-500 border-slate-800 hover:border-slate-600"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-3 block">Procedural Briefing</label>
                                    <textarea 
                                        rows={3} 
                                        value={newTemplate.description} 
                                        onChange={e => setNewTemplate(t => ({ ...t, description: e.target.value }))} 
                                        placeholder="Formal intent summary..." 
                                        className="w-full bg-slate-900/50 border border-slate-800/50 text-white rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-white/5 transition-all font-bold text-[13px] resize-none leading-relaxed" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 mt-10">
                            <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                Protocol Builder v1.0.4-β
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Logic Variable Matrix (Technical Clean) */}
                    <div className="flex-1 p-12 bg-slate-50/50 flex flex-col">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h4 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">Logic Matrix</h4>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Dynamic variable definition layer</p>
                            </div>
                            <button 
                                onClick={() => {
                                    const fields = [...(newTemplate.fields || [])]
                                    fields.push({ id: Date.now(), label: '', type: 'text', placeholder: '' })
                                    setNewTemplate(t => ({ ...t, fields }))
                                }}
                                className="px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2 group"
                            >
                                <HiPlus className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" /> Insert Logic Record
                            </button>
                        </div>

                        {/* List Builder */}
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-4">
                            {(newTemplate.fields || []).length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                    <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                        <HiLightningBolt className="h-10 w-10 text-slate-300" />
                                    </div>
                                    <p className="text-xl font-black text-slate-400 uppercase tracking-tight">Logic Void Detected</p>
                                    <p className="text-xs font-bold text-slate-400 mt-2 uppercase tracking-widest">Initialize variables to build your matrix</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {newTemplate.fields.map((field, idx) => (
                                            <motion.div 
                                                key={field.id}
                                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="bg-white border-2 border-slate-100 rounded-[28px] p-2 pr-6 shadow-sm hover:border-slate-300 hover:shadow-xl transition-all flex items-center gap-4"
                                            >
                                                <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 ml-1">
                                                     <span className="text-xs font-black text-slate-300">0{idx + 1}</span>
                                                </div>
                                                
                                                <div className="grid grid-cols-12 gap-6 flex-1 items-center">
                                                    <div className="col-span-4">
                                                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1 ml-1">Variable Identifier</label>
                                                        <input 
                                                            type="text" 
                                                            value={field.label}
                                                            onChange={e => {
                                                                const fields = [...newTemplate.fields]
                                                                fields[idx].label = e.target.value
                                                                setNewTemplate(t => ({ ...t, fields }))
                                                            }}
                                                            placeholder="Label ID" 
                                                            className="w-full bg-transparent text-[13px] font-black text-slate-900 px-1 py-1 outline-none focus:ring-b-2 ring-slate-900 transition-all translate-x-1"
                                                        />
                                                    </div>
                                                    <div className="col-span-4 border-l border-slate-100 pl-6">
                                                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Variable Architecture</label>
                                                        <select 
                                                            value={field.type}
                                                            onChange={e => {
                                                                const fields = [...newTemplate.fields]
                                                                fields[idx].type = e.target.value
                                                                setNewTemplate(t => ({ ...t, fields }))
                                                            }}
                                                            className="w-full bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-900 py-1.5 px-3 rounded-lg border-none outline-none cursor-pointer"
                                                        >
                                                            <option value="text">TEXT STRING</option>
                                                            <option value="date">DATE CHRONO</option>
                                                            <option value="textarea">DENSE TEXT</option>
                                                            <option value="number">INT NUMBER</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-span-4 border-l border-slate-100 pl-6">
                                                        <label className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Shadow Prompt</label>
                                                        <input 
                                                            type="text" 
                                                            value={field.placeholder}
                                                            onChange={e => {
                                                                const fields = [...newTemplate.fields]
                                                                fields[idx].placeholder = e.target.value
                                                                setNewTemplate(t => ({ ...t, fields }))
                                                            }}
                                                            placeholder="Shadow text..." 
                                                            className="w-full bg-transparent text-[11px] font-bold text-slate-400 px-1 py-1 outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => {
                                                        const fields = (newTemplate.fields || []).filter((_, i) => i !== idx)
                                                        setNewTemplate(t => ({ ...t, fields }))
                                                    }}
                                                    className="h-10 w-10 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-full transition-all flex items-center justify-center shrink-0"
                                                >
                                                    <HiTrash className="h-5 w-5" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Confirm Delete */}
            <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Template" size="sm"
                footer={
                    <>
                        <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Cancel</button>
                        <button onClick={() => handleDelete(confirmDelete.id)} className="bg-red-600 hover:bg-red-700 text-white btn-primary">Delete</button>
                    </>
                }
            >
                <p className="text-sm text-gray-600">Delete <strong>{confirmDelete?.name}</strong>? Documents generated from this template will not be affected.</p>
            </Modal>
        </motion.div>
    )
}
