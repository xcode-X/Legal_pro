import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX } from 'react-icons/hi'
import { 
    FcOpenedFolder, FcFlashOn, FcDocument, FcFlowChart, FcTimeline, FcSettings 
} from 'react-icons/fc'
import useDocumentStore from '../../store/useDocumentStore'

export default function QuickActionsSidebar() {
    const navigate = useNavigate()
    const { documents, templates } = useDocumentStore()
    const [isActionsOpen, setIsActionsOpen] = useState(false)

    const quickActionsData = [
        {
            label: 'Generate Document',
            desc: 'Create new legal doc using AI',
            icon: FcDocument,
            to: '/generate',
            bg: 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm',
            badge: 'AI',
        },
        {
            label: 'Browse Templates',
            desc: 'Professional ready templates',
            icon: FcFlowChart,
            to: '/templates',
            bg: 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm',
            badge: `${templates.length}`,
        },
        {
            label: 'Track Filings',
            desc: 'Monitor court deadlines',
            icon: FcTimeline,
            to: '/filings',
            bg: 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm',
            badge: `${documents.filter(d => d.status === 'Pending').length}`,
        },
        {
            label: 'View All Documents',
            desc: 'Search and filter library',
            icon: FcOpenedFolder,
            to: '/documents',
            bg: 'bg-white hover:bg-gray-50 border-gray-200 shadow-sm',
            badge: `${documents.length}`,
        },
    ]

    return (
        <div className="fixed top-1/3 right-0 z-50 flex items-start drop-shadow-2xl">
            <button 
                onClick={() => setIsActionsOpen(!isActionsOpen)}
                className={`px-3 py-6 rounded-l-2xl shadow-2xl border border-r-0 flex flex-col items-center gap-3 transition-all duration-300 relative group overflow-hidden
                    ${isActionsOpen 
                        ? 'bg-slate-900 border-slate-800 translate-x-0 shadow-none' 
                        : 'bg-slate-950 border-slate-800 hover:-translate-x-2 hover:bg-black hover:shadow-cyan-500/30'}`}
            >
                <div className="absolute inset-0 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <FcSettings className={`h-6 w-6 relative z-10 transition-all duration-500 ${isActionsOpen ? 'rotate-180' : 'group-hover:rotate-90 scale-110'}`} />
                <span style={{ writingMode: 'vertical-rl' }} className="text-[9px] font-black tracking-[0.3em] rotate-180 uppercase text-slate-400 group-hover:text-cyan-400 transition-colors relative z-10">
                    {isActionsOpen ? 'CLOSE' : 'ACTIONS'}
                </span>
            </button>

            <AnimatePresence>
                {isActionsOpen && (
                    <motion.div 
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 300, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="bg-white max-h-[600px] border-y border-l border-gray-200 overflow-hidden flex flex-col rounded-l-2xl shadow-xl"
                    >
                        <div className="p-5 pb-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                <FcFlashOn className="h-5 w-5" />
                                Quick Actions
                            </h3>
                            <button onClick={() => setIsActionsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <HiX className="h-4 w-4" />
                            </button>
                        </div>
                        
                        <div className="p-4 flex-1 overflow-y-auto space-y-2.5 bg-gray-50/30">
                            {quickActionsData.map((action) => (
                                <motion.button
                                    key={action.to}
                                    onClick={() => {
                                        setIsActionsOpen(false);
                                        navigate(action.to);
                                    }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`relative flex items-center gap-3 p-3 rounded-lg border ${action.bg} transition-all duration-200 text-left w-full group`}
                                >
                                    <div className={`h-10 w-10 flex-shrink-0 bg-gray-50/80 rounded-md border border-gray-100 flex items-center justify-center ${action.icon === FcOpenedFolder ? 'folder-icon-wrapper border-none' : ''}`}>
                                        <action.icon className="h-6 w-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{action.label}</p>
                                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">{action.desc}</p>
                                    </div>
                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 font-medium rounded border border-gray-200">
                                        {action.badge}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
