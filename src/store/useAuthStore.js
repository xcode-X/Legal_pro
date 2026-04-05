/**
 * useAuthStore — Global authentication state using Zustand.
 * Handles login, signup (with admin approval flow), role-based access using Firebase Auth & Firestore.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { auth, db } from '../firebase'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    RecaptchaVerifier,
    signInWithPhoneNumber
} from 'firebase/auth'
import { doc, setDoc, getDoc, collection, updateDoc, onSnapshot } from 'firebase/firestore'

const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            // Lists from Firestore (admin manages these)
            pendingAccounts: [],
            activeAccounts: [],

            // Firestore unsubscription functions to clean up listeners
            _unsubUsers: null,

            confirmationResult: null,

            /**
             * Login with Google
             */
            loginWithGoogle: async () => {
                set({ isLoading: true, error: null })
                try {
                    const provider = new GoogleAuthProvider()
                    const userCredential = await signInWithPopup(auth, provider)
                    const fbUser = userCredential.user
                    
                    const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
                    if (!userDoc.exists()) {
                        const newUser = {
                            name: fbUser.displayName || 'Google User',
                            email: fbUser.email,
                            role: 'Lawyer',
                            avatar: fbUser.photoURL || null,
                            firm: 'Independent Practice',
                            subscription: 'Starter',
                            accountStatus: 'pending',
                            registeredAt: new Date().toISOString(),
                        }
                        await setDoc(doc(db, 'users', fbUser.uid), newUser)
                        set({ user: { id: fbUser.uid, ...newUser }, isAuthenticated: true, isLoading: false })
                        return { success: true }
                    } else {
                        const userData = userDoc.data()
                        set({ user: { id: fbUser.uid, ...userData }, isAuthenticated: true, isLoading: false })
                        if (userData.role === 'Admin') get()._startSyncingUsers()
                        return { success: true }
                    }
                } catch (error) {
                    set({ isLoading: false, error: error.message })
                    return { success: false }
                }
            },

            /**
             * Setup Recaptcha and send OTP for Phone Auth
             */
            sendPhoneOtp: async (phoneNumber, containerId) => {
                set({ isLoading: true, error: null })
                try {
                    if (!window.recaptchaVerifier) {
                        window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                            size: 'invisible'
                        })
                    }
                    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
                    set({ confirmationResult, isLoading: false })
                    return { success: true }
                } catch (error) {
                    if (window.recaptchaVerifier) {
                        window.recaptchaVerifier.clear()
                        window.recaptchaVerifier = null
                    }
                    set({ isLoading: false, error: error.message })
                    return { success: false }
                }
            },

            /**
             * Verify OTP from SMS
             */
            verifyOtp: async (otp) => {
                set({ isLoading: true, error: null })
                try {
                    const { confirmationResult } = get()
                    if (!confirmationResult) throw new Error("No pending OTP request.")
                    const userCredential = await confirmationResult.confirm(otp)
                    const fbUser = userCredential.user
                    
                    const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
                    if (!userDoc.exists()) {
                        const newUser = {
                            name: 'Phone User',
                            phone: fbUser.phoneNumber,
                            role: 'Lawyer',
                            firm: 'Independent Practice',
                            subscription: 'Starter',
                            accountStatus: 'pending',
                            registeredAt: new Date().toISOString(),
                        }
                        await setDoc(doc(db, 'users', fbUser.uid), newUser)
                        set({ user: { id: fbUser.uid, ...newUser }, isAuthenticated: true, isLoading: false, confirmationResult: null })
                        return { success: true }
                    } else {
                        const userData = userDoc.data()
                        set({ user: { id: fbUser.uid, ...userData }, isAuthenticated: true, isLoading: false, confirmationResult: null })
                        if (userData.role === 'Admin') get()._startSyncingUsers()
                        return { success: true }
                    }
                } catch (error) {
                    set({ isLoading: false, error: "Invalid verification code." })
                    return { success: false }
                }
            },

            /**
             * Login with Firebase
             */
            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password)
                    const fbUser = userCredential.user
                    
                    // Fetch user profile from Firestore
                    const userDoc = await getDoc(doc(db, 'users', fbUser.uid))
                    if (userDoc.exists()) {
                        const userData = userDoc.data()
                        set({ user: { id: fbUser.uid, ...userData }, isAuthenticated: true, isLoading: false, error: null })
                        
                        // If admin, start syncing users
                        if (userData.role === 'Admin') {
                            get()._startSyncingUsers()
                        }
                        
                        return { success: true }
                    } else {
                        set({ isLoading: false, error: 'User profile not found in database.' })
                        return { success: false }
                    }
                } catch (error) {
                    set({ isLoading: false, error: error.message })
                    return { success: false }
                }
            },

            /**
             * Signup - registers Firebase user and creates 'pending' doc
             */
            signup: async (name, email, password, firm = '') => {
                set({ isLoading: true, error: null })
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                    const fbUser = userCredential.user
                    
                    const newUser = {
                        name,
                        email,
                        role: 'Lawyer',
                        avatar: null,
                        firm: firm || 'Independent Practice',
                        subscription: 'Starter',
                        accountStatus: 'pending', // requires admin approval
                        registeredAt: new Date().toISOString(),
                    }
                    
                    await setDoc(doc(db, 'users', fbUser.uid), newUser)

                    set({
                        user: { id: fbUser.uid, ...newUser },
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                    return { success: true }
                } catch (error) {
                    set({ isLoading: false, error: error.message })
                    return { success: false }
                }
            },

            /**
             * Admin Signup - 'active' status and 'Admin' role
             */
            adminSignup: async (name, email, password, firm = '') => {
                set({ isLoading: true, error: null })
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
                    const fbUser = userCredential.user
                    
                    const newUser = {
                        name,
                        email,
                        role: 'Admin',
                        avatar: null,
                        firm: firm || 'LDGFA Administration',
                        subscription: 'Enterprise',
                        accountStatus: 'active',
                        registeredAt: new Date().toISOString(),
                    }
                    
                    await setDoc(doc(db, 'users', fbUser.uid), newUser)

                    set({
                        user: { id: fbUser.uid, ...newUser },
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    })
                    
                    get()._startSyncingUsers()

                    return { success: true }
                } catch (error) {
                    set({ isLoading: false, error: error.message })
                    return { success: false }
                }
            },

            /**
             * Start real-time sync of all users for Admin Dashboard
             */
            _startSyncingUsers: () => {
                const state = get()
                if (state._unsubUsers) state._unsubUsers()

                const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
                    const pUsers = []
                    const aUsers = []
                    snapshot.docs.forEach(d => {
                        const user = { id: d.id, ...d.data() }
                        if (user.accountStatus === 'pending') {
                            pUsers.push(user)
                        } else if (user.accountStatus === 'active') {
                            aUsers.push(user)
                        }
                    })
                    set({ pendingAccounts: pUsers, activeAccounts: aUsers })
                }, (error) => {
                    console.error("Error fetching users:", error)
                })

                set({ _unsubUsers: unsub })
            },

            /** Admin: approve a pending account. */
            approveAccount: async (userId) => {
                try {
                    await updateDoc(doc(db, 'users', userId), { accountStatus: 'active' })
                    // user updates via snapshot, but we can locally update if it's the current user
                    if (get().user?.id === userId) {
                        set(state => ({ user: { ...state.user, accountStatus: 'active' } }))
                    }
                } catch (e) {
                    console.error("Failed to approve account:", e)
                }
            },

            /** Admin: reject a pending account. */
            rejectAccount: async (userId) => {
                try {
                    await updateDoc(doc(db, 'users', userId), { accountStatus: 'rejected' })
                } catch (e) {
                    console.error("Failed to reject account:", e)
                }
            },

            /** Clears session */
            logout: async () => {
                const state = get()
                if (state._unsubUsers) state._unsubUsers()
                try {
                    await signOut(auth)
                } catch(e) {}
                set({ user: null, isAuthenticated: false, error: null, pendingAccounts: [], activeAccounts: [] })
            },

            clearError: () => set({ error: null }),

            updateProfile: async (updates) => {
                const currentUser = get().user
                if (!currentUser) return
                try {
                    await updateDoc(doc(db, 'users', currentUser.id), updates)
                    set(state => ({ user: { ...state.user, ...updates } }))
                } catch (e) {}
            },

            updateSubscription: async (planName, period) => {
                const currentUser = get().user
                if (!currentUser) return
                const updates = { subscription: planName, subscriptionPeriod: period }
                try {
                    await updateDoc(doc(db, 'users', currentUser.id), updates)
                    set(state => ({ user: { ...state.user, ...updates } }))
                } catch (e) {}
            },
        }),
        {
            name: 'ldgfa-auth',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)

export default useAuthStore
