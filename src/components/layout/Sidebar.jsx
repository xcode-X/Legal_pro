/**
 * Sidebar — Left navigation panel with collapsible design.
 * Highlights the active route and shows user role info.
 */
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
    HiHome, HiDocumentText, HiTemplate, HiClipboardList,
    HiCog, HiLogout, HiChevronLeft, HiChevronRight,
    HiSparkles, HiScale, HiUserGroup, HiCreditCard, HiCalendar, HiSupport
} from 'react-icons/hi'
import useAuthStore from '../../store/useAuthStore'
import clsx from 'clsx'

const NAV_ITEMS = [
    { label: 'Dashboard', to: '/dashboard', icon: HiHome },
    { label: 'Clients', to: '/clients', icon: HiUserGroup },
    { label: 'Generate Doc', to: '/generate', icon: HiSparkles },
    { label: 'Documents', to: '/documents', icon: HiDocumentText },
    { label: 'Templates', to: '/templates', icon: HiTemplate },
    { label: 'Calendar', to: '/calendar', icon: HiCalendar },
    { label: 'Filings', to: '/filings', icon: HiClipboardList },
    { label: 'Billing', to: '/billing', icon: HiCreditCard },
    { label: 'Support', to: '/support', icon: HiSupport },
    { label: 'Settings', to: '/settings', icon: HiCog },
]

const ROLE_COLORS = {
    Admin: 'bg-purple-100 text-purple-700',
    Lawyer: 'bg-blue-100 text-blue-700',
    Paralegal: 'bg-cyan-100 text-cyan-700',
}

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(false)
    const { user, logout, pendingAccounts } = useAuthStore()
    const navigate = useNavigate()
    const pendingCount = pendingAccounts?.length || 0
    const isAdmin = user?.role === 'Admin'

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className={clsx(
            'relative flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ease-in-out h-full',
            collapsed ? 'w-16' : 'w-60'
        )}>
            {/* Logo */}
            <div className={clsx(
                'flex items-center gap-3 px-4 py-5 border-b border-gray-100',
                collapsed && 'justify-center px-0'
            )}>
                <div className="flex-shrink-0 h-9 w-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
                    <HiScale className="h-5 w-5 text-white" />
                </div>
                {!collapsed && (
                    <div>
                        <p className="text-sm font-bold text-gray-900 leading-none">LDGFA</p>
                        <p className="text-xs text-gray-400 mt-0.5">Legal Platform</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {!collapsed && (
                    <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Navigation
                    </p>
                )}
                {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={collapsed ? label : undefined}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 rounded-xl transition-all duration-150 cursor-pointer',
                                collapsed ? 'justify-center p-2.5' : 'px-3 py-2.5',
                                isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={clsx('h-5 w-5 flex-shrink-0', isActive ? 'text-primary-600' : '')} />
                                {!collapsed && (
                                    <span className="text-sm font-medium flex-1">{label}</span>
                                )}
                                {/* Pending badge for admin on Settings */}
                                {label === 'Settings' && isAdmin && pendingCount > 0 && (
                                    <span className={clsx(
                                        'flex-shrink-0 h-5 min-w-5 px-1 rounded-full text-[10px] font-black text-white bg-red-500 flex items-center justify-center',
                                        collapsed && 'absolute top-1 right-1 h-4 min-w-4'
                                    )}>
                                        {pendingCount}
                                    </span>
                                )}
                                {!collapsed && isActive && !pendingCount && label === 'Settings' && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />
                                )}
                                {!collapsed && isActive && label !== 'Settings' && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-500" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User info + logout */}
            <div className="border-t border-gray-100 p-3">
                {!collapsed && user && (
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-primary-700">
                                {user.name?.charAt(0) || 'U'}
                            </span>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-gray-800 truncate">{user.name}</p>
                            <span className={clsx('text-xs px-1.5 py-0.5 rounded-full font-medium', ROLE_COLORS[user.role])}>
                                {user.role}
                            </span>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    title={collapsed ? 'Sign Out' : undefined}
                    className={clsx(
                        'flex items-center gap-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 w-full',
                        collapsed ? 'justify-center p-2.5' : 'px-3 py-2'
                    )}
                >
                    <HiLogout className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && 'Sign Out'}
                </button>
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed((c) => !c)}
                className="absolute -right-3 top-1/2 -translate-y-1/2 h-6 w-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors z-10"
            >
                {collapsed
                    ? <HiChevronRight className="h-3 w-3 text-gray-500" />
                    : <HiChevronLeft className="h-3 w-3 text-gray-500" />
                }
            </button>
        </aside>
    )
}
