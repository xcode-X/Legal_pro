/**
 * Header — Top bar with global search, notifications, and user menu.
 */
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { HiSearch, HiBell, HiChevronDown, HiUser, HiCog, HiLogout } from 'react-icons/hi'
import useAuthStore from '../../store/useAuthStore'

const NOTIFICATIONS = [
    { id: 1, text: 'NDA for TechStart Inc. was approved', time: '2m ago', unread: true },
    { id: 2, text: 'Service Agreement pending review', time: '1h ago', unread: true },
    { id: 3, text: 'Petition — State v. Foster rejected', time: '3h ago', unread: false },
]

export default function Header() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [showNotifications, setShowNotifications] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [search, setSearch] = useState('')

    const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 gap-4 flex-shrink-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
                <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search documents, templates..."
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white focus:border-transparent transition-all"
                />
            </div>

            <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                    <button
                        onClick={() => { setShowNotifications((s) => !s); setShowUserMenu(false) }}
                        className="relative p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <HiBell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 h-2 w-2 bg-primary-600 rounded-full" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-xl border border-gray-100 z-40 animate-fade-in">
                            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <p className="text-sm font-semibold text-gray-900">Notifications</p>
                                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                                    {unreadCount} new
                                </span>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {NOTIFICATIONS.map((n) => (
                                    <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${n.unread ? 'bg-blue-50/40' : ''}`}>
                                        <p className="text-sm text-gray-700">{n.text}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* User avatar menu */}
                <div className="relative">
                    <button
                        onClick={() => { setShowUserMenu((s) => !s); setShowNotifications(false) }}
                        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-700">
                                {user?.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-xs font-semibold text-gray-800 leading-none">{user?.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{user?.role}</p>
                        </div>
                        <HiChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-soft-xl border border-gray-100 z-40 animate-fade-in overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                                <p className="text-xs text-gray-400">{user?.email}</p>
                            </div>
                            <div className="p-1.5">
                                <button onClick={() => { navigate('/settings'); setShowUserMenu(false) }}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                    <HiCog className="h-4 w-4 text-gray-400" /> Settings
                                </button>
                                <button onClick={handleLogout}
                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-1">
                                    <HiLogout className="h-4 w-4" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Click outside to close */}
            {(showNotifications || showUserMenu) && (
                <div className="fixed inset-0 z-30" onClick={() => { setShowNotifications(false); setShowUserMenu(false) }} />
            )}
        </header>
    )
}
