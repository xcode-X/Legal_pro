/**
 * App.jsx — Root component: sets up React Router with public/private routes.
 * Protected routes redirect to /login if the user is not authenticated.
 */
import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import ToastContainer from './components/ui/ToastContainer'
import useDocumentStore from './store/useDocumentStore'

// Layout
import AppLayout from './components/layout/AppLayout'

// Pages
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import AccountPendingPage from './pages/AccountPendingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminSignupPage from './pages/AdminSignupPage'
import DashboardPage from './pages/DashboardPage'
import GeneratePage from './pages/GeneratePage'
import DocumentsPage from './pages/DocumentsPage'
import TemplatesPage from './pages/TemplatesPage'
import FilingsPage from './pages/FilingsPage'
import SettingsPage from './pages/SettingsPage'
import ClientsPage from './pages/ClientsPage'
import BillingPage from './pages/BillingPage'
import CalendarPage from './pages/CalendarPage'
import SupportPage from './pages/SupportPage'

/** Guard: redirect to login if not authenticated; show pending page if not yet approved */
function PrivateRoute() {
    const { isAuthenticated, user } = useAuthStore()
    const startSyncing = useDocumentStore(s => s.startSyncing)

    useEffect(() => {
        if (isAuthenticated && user?.accountStatus === 'active') {
            startSyncing()
        }
    }, [isAuthenticated, user?.accountStatus, startSyncing])
    if (!isAuthenticated) return <Navigate to="/login" replace />
    if (user?.accountStatus === 'pending') return <AccountPendingPage />
    return <Outlet />
}

/** Guard: redirect to dashboard if already logged in */
function PublicOnlyRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default function App() {
    return (
        <BrowserRouter>
            {/* Global Creative Background Layer */}
            <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden bg-[#f8fafc]">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-400/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute top-[30%] left-[30%] w-[400px] h-[400px] bg-sky-300/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
                {/* Micro-noise texture for premium feel */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 1024 1024%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'}}></div>
            </div>

            {/* Global toast notifications rendered outside the route tree */}
            <ToastContainer />

            <Routes>
                {/* Landing Page — public, shown to unauthenticated users */}
                <Route path="/" element={<PublicOnlyRoute />}>
                    <Route index element={<LandingPage />} />
                </Route>

                {/* Auth pages — redirect to dashboard if already logged in */}
                <Route element={<PublicOnlyRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/admin/login" element={<AdminLoginPage />} />
                    <Route path="/admin/signup" element={<AdminSignupPage />} />
                </Route>

                {/* Protected app routes */}
                <Route element={<PrivateRoute />}>
                    <Route element={<AppLayout />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/clients" element={<ClientsPage />} />
                        <Route path="/generate" element={<GeneratePage />} />
                        <Route path="/documents" element={<DocumentsPage />} />
                        <Route path="/templates" element={<TemplatesPage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/filings" element={<FilingsPage />} />
                        <Route path="/billing" element={<BillingPage />} />
                        <Route path="/support" element={<SupportPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                </Route>

                {/* 404 — catch all unknown routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}
