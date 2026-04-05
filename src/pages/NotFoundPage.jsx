import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HiDocumentText, HiArrowLeft } from 'react-icons/hi'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 flex items-center justify-center px-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="text-center max-w-lg"
            >
                <div className="h-20 w-20 bg-primary-500/15 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary-500/20">
                    <HiDocumentText className="h-10 w-10 text-primary-400" />
                </div>
                <p className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300 mb-4">404</p>
                <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
                <p className="text-white/40 text-sm mb-10 leading-relaxed">
                    The page you are looking for doesn't exist or was moved. Let's get you back on track.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-semibold rounded-xl transition-all"
                    >
                        <HiArrowLeft className="h-4 w-4" /> Go Back
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-500/30"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </motion.div>
        </div>
    )
}
