/**
 * useAuthStore — Global authentication state using Zustand.
 * Handles login, signup (with admin approval flow), role-based access, and JWT simulation.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEMO_USERS = {
    'admin@ldgfa.com': {
        id: 'u1',
        name: 'Alexandra Chen',
        email: 'admin@ldgfa.com',
        role: 'Admin',
        avatar: null,
        firm: 'Chen & Partners LLP',
        subscription: 'Enterprise',
        password: 'admin123',
        accountStatus: 'active', // admins are always active
    },
    'lawyer@ldgfa.com': {
        id: 'u2',
        name: 'Marcus Johnson',
        email: 'lawyer@ldgfa.com',
        role: 'Lawyer',
        avatar: null,
        firm: 'Johnson Legal Group',
        subscription: 'Pro',
        password: 'lawyer123',
        accountStatus: 'active',
    },
    'paralegal@ldgfa.com': {
        id: 'u3',
        name: 'Priya Sharma',
        email: 'paralegal@ldgfa.com',
        role: 'Paralegal',
        avatar: null,
        firm: 'Johnson Legal Group',
        subscription: 'Pro',
        password: 'para123',
        accountStatus: 'active',
    },
}

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // ── Pending accounts list (admin manages these) ──────────────
            pendingAccounts: [],

            /**
             * Simulated login — validates credentials.
             * In production: POST /api/auth/login
             */
            login: async (email, password) => {
                set({ isLoading: true, error: null })
                await new Promise(r => setTimeout(r, 1200))

                const found = DEMO_USERS[email]
                if (found && found.password === password) {
                    const { password: _, ...safeUser } = found
                    const fakeToken = `jwt_${safeUser.id}_${Date.now()}`
                    set({ user: safeUser, token: fakeToken, isAuthenticated: true, isLoading: false, error: null })
                    return { success: true }
                } else {
                    set({ isLoading: false, error: 'Invalid email or password.' })
                    return { success: false }
                }
            },

            /**
             * Simulated signup — registers a new user with 'pending' status.
             * User is logged in but CANNOT use the app until Admin approves.
             * In production: POST /api/auth/register
             */
            signup: async (name, email, password, firm = '') => {
                set({ isLoading: true, error: null })
                await new Promise(r => setTimeout(r, 1200))

                if (DEMO_USERS[email]) {
                    set({ isLoading: false, error: 'An account with this email already exists.' })
                    return { success: false }
                }

                // Check if already in pendingAccounts
                const existing = get().pendingAccounts.find(u => u.email === email)
                if (existing) {
                    // Re-login as pending user
                    const fakeToken = `jwt_${existing.id}_${Date.now()}`
                    set({ user: existing, token: fakeToken, isAuthenticated: true, isLoading: false, error: null })
                    return { success: true }
                }

                const newUser = {
                    id: `u_${Date.now()}`,
                    name,
                    email,
                    role: 'Lawyer',
                    avatar: null,
                    firm: firm || 'Independent Practice',
                    subscription: 'Starter',
                    accountStatus: 'pending', // requires admin approval
                    registeredAt: new Date().toISOString(),
                }
                const fakeToken = `jwt_${newUser.id}_${Date.now()}`

                set(state => ({
                    user: newUser,
                    token: fakeToken,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                    // Add to pending list for admin review
                    pendingAccounts: [...state.pendingAccounts, newUser],
                }))
                return { success: true }
            },

            /**
             * Admin: approve a pending account.
             */
            approveAccount: (userId) => {
                set(state => {
                    const updated = state.pendingAccounts.find(u => u.id === userId)
                    if (!updated) return state

                    const approvedUser = { ...updated, accountStatus: 'active' }

                    return {
                        pendingAccounts: state.pendingAccounts.filter(u => u.id !== userId),
                        // If the currently-logged-in user is the approved one, update their state too
                        user: state.user?.id === userId ? approvedUser : state.user,
                    }
                })
            },

            /**
             * Admin: reject a pending account.
             */
            rejectAccount: (userId) => {
                set(state => ({
                    pendingAccounts: state.pendingAccounts.filter(u => u.id !== userId),
                }))
            },

            /** Clears session */
            logout: () =>
                set({ user: null, token: null, isAuthenticated: false, error: null }),

            /** Clear error state */
            clearError: () => set({ error: null }),

            /** Update user profile fields */
            updateProfile: (updates) =>
                set(state => ({ user: { ...state.user, ...updates } })),

            /** Update user subscription */
            updateSubscription: (planName, period) =>
                set(state => ({ user: { ...state.user, subscription: planName, subscriptionPeriod: period } })),
        }),
        {
            name: 'ldgfa-auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                pendingAccounts: state.pendingAccounts,
            }),
        }
    )
)

export default useAuthStore
