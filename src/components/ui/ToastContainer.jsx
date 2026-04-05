/**
 * ToastContainer — Renders floating toast notifications.
 */
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HiCheckCircle, HiExclamation, HiInformationCircle, HiX, HiXCircle } from 'react-icons/hi'
import useToastStore from '../../store/useToastStore'

const STYLES = {
    success: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-800', icon: HiCheckCircle, iconColor: 'text-emerald-500' },
    error:   { bg: 'bg-red-50 border-red-200',     text: 'text-red-800',     icon: HiXCircle,     iconColor: 'text-red-500' },
    warning: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800',   icon: HiExclamation, iconColor: 'text-amber-500' },
    info:    { bg: 'bg-blue-50 border-blue-200',   text: 'text-blue-800',    icon: HiInformationCircle, iconColor: 'text-blue-500' },
}

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore()

    return (
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence>
                {toasts.map((toast) => {
                    const s = STYLES[toast.type] || STYLES.info
                    const Icon = s.icon
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 60, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 60, scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg max-w-xs ${s.bg}`}
                        >
                            <Icon className={`h-5 w-5 flex-shrink-0 ${s.iconColor}`} />
                            <p className={`text-sm font-medium flex-1 ${s.text}`}>{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className={`p-0.5 rounded-lg hover:bg-black/10 transition-colors ${s.text}`}
                            >
                                <HiX className="h-3.5 w-3.5" />
                            </button>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
