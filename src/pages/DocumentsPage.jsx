/**
 * DocumentsPage — Full document list with filtering, search, and status management.
 */
import React, { useState } from 'react'
import { HiDocumentText, HiSearch, HiFilter, HiTrash, HiUpload, HiEye, HiPlus } from 'react-icons/hi'
import { FcOpenedFolder } from 'react-icons/fc'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import useDocumentStore from '../store/useDocumentStore'
import StatusBadge from '../components/ui/StatusBadge'
import Modal from '../components/ui/Modal'
import { motion, AnimatePresence } from 'framer-motion'

const ALL_STATUSES = ['All', 'Draft', 'Pending', 'Submitted', 'Approved', 'Rejected']
const ALL_TYPES = ['All', 'Contract', 'Affidavit', 'Petition', 'Correspondence', 'Deed']

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function DocumentsPage() {
    const { documents, deleteDocument, submitFiling } = useDocumentStore()
    const navigate = useNavigate()
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [typeFilter, setTypeFilter] = useState('All')
    const [selected, setSelected] = useState(null)
    const [previewDoc, setPreviewDoc] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)

    const filtered = documents.filter((d) => {
        const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
            d.author.toLowerCase().includes(search.toLowerCase())
        const matchStatus = statusFilter === 'All' || d.status === statusFilter
        const matchType = typeFilter === 'All' || d.type === typeFilter
        return matchSearch && matchStatus && matchType
    })

    const toggleSelect = (id) => setSelected((s) => s === id ? null : id)

    const handleDelete = (doc) => {
        deleteDocument(doc.id)
        setConfirmDelete(null)
    }

    const handleSubmit = (id) => {
        submitFiling(id)
    }

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-6">
            {/* Header */}
            <motion.div variants={itemVariants} className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Documents</h1>
                    <p className="text-sm text-gray-500 mt-1">{documents.length} total documents</p>
                </div>
                <button onClick={() => navigate('/generate')} className="btn-primary flex items-center gap-2 shadow-primary-500/30 shadow-lg">
                    <HiPlus className="h-4 w-4" /> New Document
                </button>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="card !p-4 flex flex-wrap items-center gap-3 shadow-sm rounded-2xl">
                <div className="relative flex-1 min-w-48">
                    <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search documents..."
                        className="input-field pl-9 py-2 text-sm"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <HiFilter className="h-4 w-4 text-gray-400" />
                    {ALL_STATUSES.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${statusFilter === s ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                    <div className="h-4 w-px bg-gray-200 mx-1" />
                    {ALL_TYPES.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${typeFilter === t ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Documents table */}
            <motion.div variants={itemVariants} className="card !p-0 overflow-hidden shadow-soft-lg">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Document</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Type</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Author</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</th>
                                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            <AnimatePresence>
                                {filtered.length === 0 ? (
                                    <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <td colSpan={6} className="px-6 py-16 text-center text-gray-400 text-sm">
                                            <HiDocumentText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                            No documents match your filters.
                                        </td>
                                    </motion.tr>
                                ) : (
                                    filtered.map((doc) => (
                                        <motion.tr
                                            key={doc.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="hover:bg-primary-50/40 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-11 w-11 bg-sky-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-sm folder-icon-wrapper">
                                                        <FcOpenedFolder className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 group-hover:text-primary-700 transition-colors">{doc.title}</p>
                                                        <p className="text-xs text-gray-400">v{doc.version} · {doc.wordCount} words</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full font-medium">
                                                    {doc.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={doc.status} />
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 font-medium text-sm">{doc.author}</td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">
                                                {format(new Date(doc.createdAt), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => setPreviewDoc(doc)}
                                                        title="Preview"
                                                        className="p-2 rounded-lg hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <HiEye className="h-4 w-4" />
                                                    </button>
                                                    {doc.status === 'Draft' && (
                                                        <button
                                                            onClick={() => handleSubmit(doc.id)}
                                                            title="Submit for filing"
                                                            className="p-2 rounded-lg hover:bg-amber-100 text-gray-400 hover:text-amber-600 transition-colors"
                                                        >
                                                            <HiUpload className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setConfirmDelete(doc)}
                                                        title="Delete"
                                                        className="p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors"
                                                    >
                                                        <HiTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Preview Modal */}
            <Modal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                title={previewDoc?.title}
                size="lg"
            >
                {previewDoc && (
                    <div>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <StatusBadge status={previewDoc.status} size="sm" />
                            <span className="badge bg-gray-100 text-gray-600">{previewDoc.type}</span>
                            <span className="badge bg-gray-100 text-gray-600">{previewDoc.wordCount} words</span>
                            <span className="badge bg-gray-100 text-gray-600">v{previewDoc.version}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-5 text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto border border-gray-100">
                            {previewDoc.content}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal
                isOpen={!!confirmDelete}
                onClose={() => setConfirmDelete(null)}
                title="Delete Document"
                size="sm"
                footer={
                    <>
                        <button onClick={() => setConfirmDelete(null)} className="btn-secondary">Cancel</button>
                        <button onClick={() => handleDelete(confirmDelete)} className="bg-red-600 hover:bg-red-700 text-white btn-primary">
                            Delete
                        </button>
                    </>
                }
            >
                <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong>{confirmDelete?.title}</strong>? This action cannot be undone.
                </p>
            </Modal>
        </motion.div>
    )
}
