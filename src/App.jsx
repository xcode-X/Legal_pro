/**
 * App.jsx — Root component: sets up React Router with public/private routes.
 * Protected routes redirect to /login if the user is not authenticated.
 */
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import useAuthStore from './store/useAuthStore'
import ToastContainer from './components/ui/ToastContainer'

// Layout
import AppLayout from './components/layout/AppLayout'

// Pages
import LandingPage from './pages/LandingPage'
import NotFoundPage from './pages/NotFoundPage'
import AccountPendingPage from './pages/AccountPendingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import GeneratePage from './pages/GeneratePage'
import DocumentsPage from './pages/DocumentsPage'
import TemplatesPage from './pages/TemplatesPage'
import FilingsPage from './pages/FilingsPage'
import SettingsPage from './pages/SettingsPage'
import ClientsPage from './pages/ClientsPage'
import BillingPage from './pages/BillingPage'
import CalendarPage from './pages/CalendarPage'

/** Guard: redirect to login if not authenticated; show pending page if not yet approved */
function PrivateRoute() {
    const { isAuthenticated, user } = useAuthStore()
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
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                </Route>

                {/* 404 — catch all unknown routes */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    )
}
