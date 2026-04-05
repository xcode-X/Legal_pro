import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HiUserGroup, HiSearch, HiOutlineMail, HiOutlinePhone,
    HiOutlineOfficeBuilding, HiPlus, HiX, HiUser, HiEye
} from 'react-icons/hi'
import Modal from '../components/ui/Modal'
import useToastStore from '../store/useToastStore'

const EMPTY_CLIENT = {
    name: '', contact: '', email: '', phone: '', type: 'Corporate', status: 'Active',
    address: '', city: '', country: '', zip: '',
    industry: 'Technology', taxId: '', website: '', notes: ''
}

const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function ClientsPage() {
    const { addToast } = useToastStore()
    const [search, setSearch] = useState('')
    const [showNewClient, setShowNewClient] = useState(false)
    const [viewClient, setViewClient] = useState(null)
    const [form, setForm] = useState(EMPTY_CLIENT)

    const [clients, setClients] = useState([
        { id: 1, name: 'Acme Corp Liberia', contact: 'John Doe', email: 'jdoe@acme.lr', phone: '+231 77 000 1111', status: 'Active', type: 'Corporate' },
        { id: 2, name: 'Tech Solutions Ltd.', contact: 'Sarah Smith', email: 'sarah@techsol.lr', phone: '+231 88 222 3333', status: 'Active', type: 'Corporate' },
        { id: 3, name: 'Michael B. Davies', contact: 'M. Davies', email: 'mdavies@gmail.com', phone: '+231 77 444 5555', status: 'Pending', type: 'Individual' },
        { id: 4, name: 'Monrovia Imports', contact: 'David Johnson', email: 'info@monroviaimports.com', phone: '+231 88 999 8888', status: 'Inactive', type: 'Corporate' },
        { id: 5, name: 'Elena K. Howard', contact: 'E. Howard', email: 'ehoward@yahoo.com', phone: '+231 77 555 6666', status: 'Active', type: 'Individual' },
    ])

    const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )

    const handleAddClient = () => {
        if (!form.name.trim() || !form.email.trim()) return
        const newClient = { ...form, id: Date.now() }
        setClients(prev => [...prev, newClient])
        setForm(EMPTY_CLIENT)
        setShowNewClient(false)
        addToast(`Client "${form.name}" added!`, 'success')
    }

    const getAvatarSrc = (client) => {
        // Generates realistic male/female portraits from uniquely seeded identifiers
        return `https://i.pravatar.cc/150?u=${encodeURIComponent(client.name)}`
    }

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="space-y-6 max-w-6xl mx-auto"
        >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Clients Directory</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage firm clients, contracts, and communication hubs.</p>
                </div>
                <button onClick={() => setShowNewClient(true)} className="btn-primary flex items-center gap-2 shadow-primary-500/30 shadow-lg">
                    <HiPlus className="h-5 w-5" /> New Client
                </button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by client name or email..."
                    className="w-full bg-white border-0 shadow-sm rounded-2xl py-4 pl-12 pr-4 text-gray-900 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none"
                />
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-soft border border-gray-100/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse whitespace-nowrap">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                                <th className="px-6 py-4">Client Profile</th>
                                <th className="px-6 py-4">Contact Details</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((client) => (
                                <motion.tr
                                    variants={itemVariants}
                                    key={client.id}
                                    onClick={() => setViewClient(client)}
                                    className="hover:bg-slate-50/60 transition-all duration-200 group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img 
                                                src={getAvatarSrc(client)}
                                                alt={client.name}
                                                className="h-10 w-10 rounded-full shadow-sm ring-2 ring-white bg-white group-hover:scale-105 transition-transform"
                                            />
                                            <div>
                                                <p className="font-bold text-gray-800 text-sm group-hover:text-primary-600 transition-colors">{client.name}</p>
                                                <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mt-0.5">{client.contact}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <span className="flex items-center gap-2 text-[10px] text-gray-600 font-medium">
                                                <div className="bg-black p-0.5 rounded-full shadow-sm">
                                                    <HiOutlineMail className="h-2.5 w-2.5 text-white" /> 
                                                </div>
                                                {client.email}
                                            </span>
                                            <span className="flex items-center gap-2 text-[10px] text-gray-600 font-medium">
                                                <div className="bg-black p-0.5 rounded-full shadow-sm">
                                                    <HiOutlinePhone className="h-2.5 w-2.5 text-white" /> 
                                                </div>
                                                {client.phone}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                            <div className="bg-black p-0.5 rounded-full shadow-sm">
                                                {client.type === 'Corporate'
                                                    ? <HiOutlineOfficeBuilding className="text-white h-2.5 w-2.5" />
                                                    : <HiUser className="text-white h-2.5 w-2.5" />}
                                            </div>
                                            {client.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            client.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            client.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                            'bg-slate-50 text-slate-500 border border-slate-200'
                                        }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setViewClient(client); }}
                                                className="px-3 py-1.5 flex items-center gap-1.5 bg-white border border-slate-200 hover:border-primary-300 hover:bg-primary-50 text-slate-600 hover:text-primary-600 rounded-full transition-all shadow-sm text-[10px] font-bold uppercase"
                                                title="View Profile"
                                            >
                                                <HiEye className="h-3 w-3" /> View
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="py-16 flex flex-col items-center justify-center text-gray-400">
                            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <HiUserGroup className="h-8 w-8 text-gray-300" />
                            </div>
                            <p className="font-medium text-gray-500">No clients found matching your search.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Premium New Client Modal */}
            <Modal
                isOpen={showNewClient}
                onClose={() => { setShowNewClient(false); setForm(EMPTY_CLIENT) }}
                title="Create New Client Profile"
                size="xl"
                footer={
                    <div className="flex items-center gap-3 justify-end w-full">
                        <button onClick={() => { setShowNewClient(false); setForm(EMPTY_CLIENT) }} className="btn-secondary">Cancel</button>
                        <button
                            onClick={handleAddClient}
                            disabled={!form.name.trim() || !form.email.trim()}
                            className="btn-primary disabled:opacity-50 min-w-[160px] shadow-lg shadow-primary-500/30"
                        >
                            Save Client Records
                        </button>
                    </div>
                }
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                    {/* Main Left Column */}
                    <div className="col-span-2 space-y-6">
                        {/* Basic & Contact Info Card */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-3 mb-5 flex items-center gap-2"><HiOutlineOfficeBuilding className="h-4 w-4"/> Core Identity</h3>
                            
                            <div className="grid grid-cols-2 gap-5 mb-5">
                                <div className="col-span-2">
                                    <label className="label">Client / Firm Name <span className="text-red-500">*</span></label>
                                    <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Acme Corporation" className="input-field shadow-sm" />
                                </div>
                                <div>
                                    <label className="label">Primary Contact</label>
                                    <input type="text" value={form.contact} onChange={e => setForm(p => ({ ...p, contact: e.target.value }))} placeholder="e.g. John Doe, VP" className="input-field shadow-sm" />
                                </div>
                                <div>
                                    <label className="label">Tax ID / Registration No.</label>
                                    <input type="text" value={form.taxId} onChange={e => setForm(p => ({ ...p, taxId: e.target.value }))} placeholder="LRA-982347" className="input-field shadow-sm" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="label">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="hello@company.com" className="input-field shadow-sm" />
                                </div>
                                <div>
                                    <label className="label">Phone / Mobile</label>
                                    <input type="text" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+231 77 000 0000" className="input-field shadow-sm" />
                                </div>
                            </div>
                        </div>

                        {/* Extended Address Card */}
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-3 mb-5">Billing & Origins</h3>
                            
                            <div className="grid grid-cols-2 gap-5">
                                <div className="col-span-2">
                                    <label className="label">Street Address</label>
                                    <input type="text" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="123 Broad St. Suite 400" className="input-field shadow-sm" />
                                </div>
                                <div>
                                    <label className="label">City / Region</label>
                                    <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} placeholder="Monrovia, Montserrado" className="input-field shadow-sm" />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="label">Code</label>
                                        <input type="text" value={form.zip} onChange={e => setForm(p => ({ ...p, zip: e.target.value }))} placeholder="1000" className="input-field shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="label">Country</label>
                                        <input type="text" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="Liberia" className="input-field shadow-sm" />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="label">Corporate Website</label>
                                    <input type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} placeholder="https://www.example.com" className="input-field shadow-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Hand Preferences & Notes Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-3 mb-5 flex items-center gap-2">Categorization</h3>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="label">Legal Client Type</label>
                                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field shadow-sm bg-white cursor-pointer">
                                        <option>Corporate</option>
                                        <option>Individual</option>
                                        <option>NGO / Non-Profit</option>
                                        <option>Government</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Sector / Industry</label>
                                    <select value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} className="input-field shadow-sm bg-white cursor-pointer">
                                        <option>Technology</option>
                                        <option>Finance</option>
                                        <option>Real Estate</option>
                                        <option>Healthcare</option>
                                        <option>Legal</option>
                                        <option>Logistics</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Account Status</label>
                                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-field shadow-sm bg-white cursor-pointer">
                                        <option>Active</option>
                                        <option>Pending Intake</option>
                                        <option>Inactive</option>
                                        <option>Suspended</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[240px]">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-3 mb-4">Internal Notes</h3>
                            <textarea 
                                value={form.notes} 
                                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} 
                                className="input-field shadow-sm flex-1 resize-none bg-white p-3 text-sm h-full" 
                                placeholder="Add privileged contextual notes regarding client risk, intake procedure, or special requests..." 
                            />
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Sleek Client Profile Dashboard Modal */}
            <Modal
                isOpen={!!viewClient}
                onClose={() => setViewClient(null)}
                title="Client Intelligence Profile"
                size="md"
                footer={
                    <div className="flex w-full justify-between items-center px-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Client ID: {viewClient?.id || '—'}</span>
                        <button onClick={() => setViewClient(null)} className="btn-secondary min-w-[120px]">Close Panel</button>
                    </div>
                }
            >
                {viewClient && (
                    <div className="relative pt-12 pb-4">
                        {/* Stunning Dynamic Banner */}
                        <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-tr from-primary-600 via-indigo-800 to-slate-900 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center opacity-95">
                           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col items-center px-4">
                            {/* Floating Avatar */}
                            <img 
                                src={getAvatarSrc(viewClient)}
                                alt={viewClient.name}
                                className="h-28 w-28 rounded-full shadow-2xl ring-4 ring-white bg-white mb-5 transform hover:scale-105 transition-transform duration-300"
                            />
                            
                            <h2 className="font-black text-slate-900 text-2xl tracking-tight mb-1 text-center">{viewClient.name}</h2>
                            <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-5 flex items-center gap-2 bg-primary-50 px-3 py-1 rounded-full border border-primary-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-pulse"></span>
                                {viewClient.contact}
                            </p>
                            
                            {/* Category & Status Pills */}
                            <div className="flex flex-wrap justify-center gap-3 mb-8 w-full">
                                <span className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-sm ${
                                    viewClient.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                    viewClient.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                    'bg-slate-50 text-slate-500 border border-slate-200'
                                }`}>
                                    <div className={`h-2 w-2 rounded-full ${viewClient.status === 'Active' ? 'bg-emerald-500' : viewClient.status === 'Pending' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                                    {viewClient.status === 'Pending' ? 'Pending Intake' : viewClient.status}
                                </span>
                                
                                <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-[10px] font-extrabold uppercase tracking-widest shadow-sm">
                                    <HiOutlineOfficeBuilding className="w-3.5 h-3.5 text-slate-400"/>
                                    {viewClient.type}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Data Grid */}
                        <div className="grid grid-cols-2 gap-4 px-2">
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                                <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform border border-slate-100">
                                    <HiOutlineMail className="h-6 w-6 text-blue-500" />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Direct Email</span>
                                <a href={`mailto:${viewClient.email}`} className="font-semibold text-slate-800 text-xs hover:text-blue-600 truncate w-full px-2">{viewClient.email}</a>
                            </div>
                            
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group">
                                <div className="bg-white p-3 rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform border border-slate-100">
                                    <HiOutlinePhone className="h-6 w-6 text-emerald-500" />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1.5">Primary Phone</span>
                                <a href={`tel:${viewClient.phone}`} className="font-semibold text-slate-800 text-xs hover:text-emerald-600 truncate w-full px-2">{viewClient.phone || '—'}</a>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </motion.div>
    )
}
