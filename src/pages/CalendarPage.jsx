import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    HiCalendar, HiClock, HiOutlineLocationMarker, HiUserGroup, 
    HiOutlinePlus, HiX, HiLightningBolt, HiCheckCircle, HiArrowRight,
    HiEye, HiDotsHorizontal, HiTrash
} from 'react-icons/hi'
import { format, addDays, startOfMonth, getDay, getDaysInMonth, isSameDay } from 'date-fns'
import Modal from '../components/ui/Modal'
import useToastStore from '../store/useToastStore'
import clsx from 'clsx'

const EVENT_TYPES = ['Court', 'Meeting', 'Deadline', 'Internal']

const EMPTY_EVENT = { title: '', time: '09:00 AM', location: '', type: 'Meeting', participants: '' }

const TYPE_THEME = {
    Court: 'bg-slate-900 text-white ring-slate-200',
    Deadline: 'bg-emerald-600 text-white ring-emerald-100',
    Meeting: 'bg-slate-100 text-slate-900 ring-slate-50',
    Internal: 'bg-slate-50 text-slate-500 ring-slate-100',
}

const TYPE_DOTS = {
    Court: 'bg-slate-900',
    Deadline: 'bg-emerald-500',
    Meeting: 'bg-blue-400',
    Internal: 'bg-slate-400',
}

const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }

export default function CalendarPage() {
    const { addToast } = useToastStore()
    const [view, setView] = useState('Upcoming')
    const [showNewEvent, setShowNewEvent] = useState(false)
    const [form, setForm] = useState(EMPTY_EVENT)
    const [selectedDay, setSelectedDay] = useState(null)

    const [events, setEvents] = useState([
        { id: 1, title: 'Court Hearing: River v. Monco', date: new Date(), time: '09:00 AM', location: 'Circuit Court, Room 2B', type: 'Court', participants: 'J. Doe, L. Smith' },
        { id: 2, title: 'Client Meeting - NDAs', date: new Date(), time: '02:00 PM', location: 'Conference Room A', type: 'Meeting', participants: 'Tech Solutions Ltd.' },
        { id: 3, title: 'Filing Deadline: Property Deed', date: addDays(new Date(), 2), time: '11:59 PM', location: 'Ministry of Lands', type: 'Deadline', participants: 'Real Estate Team' },
        { id: 4, title: 'Arbitration Prep', date: addDays(new Date(), 3), time: '10:00 AM', location: 'Main Office', type: 'Internal', participants: 'Partners' },
        { id: 5, title: 'Deposition', date: addDays(new Date(), 5), time: '01:00 PM', location: 'Downtown Offices', type: 'Court', participants: 'Howard Case' },
    ])

    // Build proper calendar grid
    const today = new Date()
    const firstDay = startOfMonth(today)
    const offset = (getDay(firstDay) + 6) % 7
    const daysInMonth = getDaysInMonth(today)
    const calendarCells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

    const getEventsForDay = (day) => {
        if (!day) return []
        const currentYear = today.getFullYear()
        const currentMonth = today.getMonth()
        return events.filter(e => {
            const d = new Date(e.date)
            return d.getDate() === day && d.getMonth() === currentMonth && d.getFullYear() === currentYear
        })
    }

    const handleAddEvent = () => {
        if (!form.title.trim()) return
        const date = selectedDay
            ? new Date(today.getFullYear(), today.getMonth(), selectedDay)
            : new Date()
        setEvents(prev => [{ ...form, id: Date.now(), date }, ...prev])
        setForm(EMPTY_EVENT)
        setSelectedDay(null)
        setShowNewEvent(false)
        addToast(`Event "${form.title}" added to calendar!`, 'success')
    }

    const openNewEventForDay = (day) => {
        setSelectedDay(day)
        setShowNewEvent(true)
    }

    const currentDayIndex = (today.getDay() + 6) % 7 // Monday-based index

    const [viewingEvent, setViewingEvent] = useState(null)

    const handleDeleteEvent = (id) => {
        setEvents(prev => prev.filter(e => e.id !== id))
        addToast("Engagement record has been purged from chronos.", "info")
    }

    return (
        <motion.div initial="hidden" animate="show" variants={containerVariants} className="space-y-12 max-w-7xl mx-auto px-2 pb-20">
            
            {/* Professional Header Section */}
            <motion.div variants={itemVariants} className="text-center relative py-6 border-b border-slate-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 -z-10 pointer-events-none" />
                <div className="h-16 w-16 bg-black rounded-full mx-auto flex items-center justify-center mb-5 shadow-2xl ring-8 ring-slate-50">
                    <HiCalendar className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3 uppercase">Court & Filing Calendar</h1>
                <p className="text-slate-500 max-w-xl mx-auto text-sm font-medium leading-relaxed">
                    Centrally manage judicial deadlines, procedural filings, and client consultations with rigorous synchronized precision.
                </p>
                
                <div className="mt-8 flex items-center justify-center gap-3">
                     <div className="bg-slate-100 p-1 rounded-2xl flex gap-1 shadow-inner border border-slate-200">
                        {['Upcoming', 'Past', 'Sync'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={clsx(
                                    "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                                    view === v ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                )}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* FULL WIDTH CALENDAR AT TOP */}
            <motion.div variants={itemVariants} className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                
                <div className="flex flex-col sm:flex-row items-center justify-between mb-12 relative z-10 gap-6">
                    <div>
                        <h2 className="font-black text-slate-900 text-3xl tracking-tight leading-none uppercase">{format(today, 'MMMM yyyy')}</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-3">Monthly Judicial Scheduling Overview</p>
                    </div>
                    <div className="flex gap-3 items-center">
                        <div className="flex gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                            {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d, i) => (
                                <div key={d} className={clsx(
                                    "w-8 text-center text-[9px] font-black uppercase transition-colors", 
                                    i === currentDayIndex ? "text-slate-900" : "text-slate-300"
                                )}>
                                    {d}
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => { setSelectedDay(null); setShowNewEvent(true) }}
                            className="py-4 px-8 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
                        >
                            <HiOutlinePlus className="h-4 w-4" /> Schedule New Entry
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-4 relative z-10">
                    {calendarCells.map((day, i) => {
                        const dayEvents = getEventsForDay(day)
                        return (
                            <div
                                key={i}
                                onClick={() => day && openNewEventForDay(day)}
                                className={clsx(
                                    "aspect-[1.4/1] flex flex-col items-center justify-center rounded-3xl text-base font-black transition-all cursor-pointer relative border",
                                    day === null ? "opacity-0 border-transparent pointer-events-none" :
                                    day === today.getDate()
                                        ? "bg-black text-white shadow-2xl scale-105 border-black z-20"
                                        : "text-slate-900 bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-300 hover:shadow-lg hover:scale-[1.02]"
                                )}
                            >
                                <span className={clsx("text-lg", day === today.getDate() ? "text-white" : "text-slate-900")}>{day}</span>
                                
                                <div className="flex gap-1.5 justify-center mt-3 h-2 flex-wrap max-w-[80%]">
                                    {dayEvents.map((e, idx) => (
                                        <div 
                                            key={idx} 
                                            title={e.title}
                                            className={clsx(
                                                "h-1.5 w-1.5 rounded-full ring-1 ring-white/10", 
                                                TYPE_DOTS[e.type] || 'bg-slate-400',
                                                day === today.getDate() && 'ring-white/40'
                                            )} 
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </motion.div>

            {/* CHRONOLOGICAL TIMELINE TABLE VIEW */}
            <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center justify-between px-6 mb-2">
                    <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                            <HiClock className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Detailed Chronological Timeline</h3>
                    </div>
                </div>

                <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedural Event</th>
                                    <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol Date</th>
                                    <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Commencement</th>
                                    <th className="py-6 px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Badge</th>
                                    <th className="py-6 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {events.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-32 text-center">
                                            <HiCalendar className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No immediate engagements detected</p>
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event, idx) => (
                                        <motion.tr 
                                            key={event.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0, transition: { delay: idx * 0.03 } }}
                                            className="group hover:bg-slate-50/30 transition-all cursor-pointer"
                                            onClick={() => setViewingEvent(event)}
                                        >
                                            <td className="py-6 px-8">
                                                <div className="flex items-center gap-4">
                                                    <div className={clsx("h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm", TYPE_THEME[event.type])}>
                                                        <HiCalendar className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 group-hover:text-black">{event.title}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 truncate max-w-[200px]">{event.location || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 text-center">
                                                <p className="text-xs font-black text-slate-900">{format(event.date, 'MMM d, yyyy')}</p>
                                            </td>
                                            <td className="py-6 px-4 text-center">
                                                <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full text-[10px] font-black text-slate-600 uppercase">
                                                    <HiClock className="h-3.5 w-3.5" /> {event.time}
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 text-center">
                                                <span className={clsx(
                                                    "text-[9px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest shadow-sm ring-4 ring-slate-50",
                                                    TYPE_THEME[event.type]
                                                )}>
                                                    {event.type}
                                                </span>
                                            </td>
                                            <td className="py-6 px-8 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setViewingEvent(event) }}
                                                        className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-black hover:text-white transition-all shadow-sm"
                                                    >
                                                        <HiEye className="h-4 w-4" />
                                                    </button>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id) }}
                                                        className="h-9 w-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm"
                                                    >
                                                        <HiTrash className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* View Event Modal Redesign */}
            <Modal
                isOpen={!!viewingEvent}
                onClose={() => setViewingEvent(null)}
                title="Engagement Intelligence Protocol"
                size="md"
                footer={
                    <div className="flex w-full justify-between items-center px-4">
                         <button onClick={() => setViewingEvent(null)} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Terminate View</button>
                         <button onClick={() => { handleDeleteEvent(viewingEvent.id); setViewingEvent(null) }} className="px-8 py-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-lg">Archive Event</button>
                    </div>
                }
            >
                {viewingEvent && (
                    <div className="space-y-8 py-4">
                        <div className="flex items-center gap-6">
                            <div className={clsx("h-20 w-20 rounded-3xl flex items-center justify-center shadow-xl ring-8 ring-slate-50", TYPE_THEME[viewingEvent.type])}>
                                <HiCalendar className="h-10 w-10" />
                            </div>
                            <div>
                                <span className={clsx("text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest mb-2 inline-block", TYPE_THEME[viewingEvent.type])}>
                                    {viewingEvent.type} ENGAGEMENT
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight uppercase">{viewingEvent.title}</h3>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <HiClock className="h-4 w-4 text-slate-400" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Temporal Detail</p>
                                </div>
                                <p className="text-sm font-black text-slate-900">{format(viewingEvent.date, 'MMMM d, yyyy')}</p>
                                <p className="text-xs font-bold text-slate-500 mt-1">{viewingEvent.time}</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-[28px] border border-slate-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <HiOutlineLocationMarker className="h-4 w-4 text-slate-400" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Venue Details</p>
                                </div>
                                <p className="text-sm font-black text-slate-900 truncate">{viewingEvent.location || 'Distributed Office'}</p>
                                <p className="text-xs font-bold text-slate-500 mt-1">Confirmed Path</p>
                            </div>
                        </div>

                        <div className="bg-slate-950 p-8 rounded-[32px] text-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16" />
                             <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <HiUserGroup className="h-5 w-5 text-indigo-400" />
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Authorized Participants</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(viewingEvent.participants || 'General Counsel').split(',').map((p, i) => (
                                        <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-[11px] font-bold border border-white/5">
                                            {p.trim()}
                                        </span>
                                    ))}
                                </div>
                             </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* New Event Modal Redesign */}
            <Modal
                isOpen={showNewEvent}
                onClose={() => { setShowNewEvent(false); setForm(EMPTY_EVENT); setSelectedDay(null) }}
                title={selectedDay ? `New Engagement Entry — ${format(new Date(today.getFullYear(), today.getMonth(), selectedDay), 'MMM d, yyyy')}` : 'Schedule New Engagement'}
                size="md"
                footer={
                    <div className="flex w-full justify-between items-center px-4">
                         <button onClick={() => { setShowNewEvent(false); setForm(EMPTY_EVENT); setSelectedDay(null) }} className="text-xs font-bold uppercase text-slate-400 hover:text-slate-600 transition-colors">Discard Draft</button>
                         <button onClick={handleAddEvent} disabled={!form.title.trim()} className="px-10 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all shadow-xl disabled:opacity-50">Create Entry</button>
                    </div>
                }
            >
                <div className="space-y-6 pt-2">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Event Identification</label>
                        <input 
                            type="text" 
                            value={form.title} 
                            onChange={e => setForm(p => ({ ...p, title: e.target.value }))} 
                            placeholder="e.g. Constitutional Hearing: State v. Holmes" 
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Case Category</label>
                            <select 
                                value={form.type} 
                                onChange={e => setForm(p => ({ ...p, type: e.target.value }))} 
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm appearance-none cursor-pointer"
                            >
                                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Commencement Time</label>
                            <input 
                                type="text" 
                                value={form.time} 
                                onChange={e => setForm(p => ({ ...p, time: e.target.value }))} 
                                placeholder="e.g. 09:00 AM" 
                                className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Venue / Physical Location</label>
                        <input 
                            type="text" 
                            value={form.location} 
                            onChange={e => setForm(p => ({ ...p, location: e.target.value }))} 
                            placeholder="e.g. Supreme Court, East Wing 4C" 
                            className="w-full bg-slate-50 border border-slate-100 text-slate-900 rounded-2xl py-4 px-6 outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-sm" 
                        />
                    </div>
                </div>
            </Modal>
        </motion.div>
    )
}
