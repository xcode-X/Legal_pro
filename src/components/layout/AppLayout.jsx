/**
 * AppLayout — Main authenticated layout wrapper.
 * Composes Sidebar + Header + main content area + AI assistant.
 */
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AIAssistantPanel from '../ai/AIAssistantPanel'
import QuickActionsSidebar from './QuickActionsSidebar'

export default function AppLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto px-6 py-6">
                    <Outlet />
                </main>
            </div>

            {/* Floating AI chatbot */}
            <AIAssistantPanel />

            {/* Quick Actions Floating Sidebar */}
            <QuickActionsSidebar />
        </div>
    )
}
