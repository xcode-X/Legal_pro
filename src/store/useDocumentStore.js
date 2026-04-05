/**
 * useDocumentStore — Manages documents, templates, and filings state via Firestore.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { db } from '../firebase'
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore'

const useDocumentStore = create(
    persist(
        (set, get) => ({
            documents: [],
            templates: [],
            filings: [],
            selectedDocument: null,
            isGenerating: false,
            generationProgress: 0,
            
            _unsubDocs: null,
            _unsubTemplates: null,
            _unsubFilings: null,

            /** Set the currently viewed document locally */
            selectDocument: (doc) => set({ selectedDocument: doc }),

            /** Start Real-Time Firebase Listeners */
            startSyncing: () => {
                const state = get()
                if (state._unsubDocs) state._unsubDocs()
                if (state._unsubTemplates) state._unsubTemplates()
                if (state._unsubFilings) state._unsubFilings()

                const unsubDocs = onSnapshot(collection(db, 'documents'), (snapshot) => {
                    const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
                    set(s => ({ 
                        documents: docs.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)),
                        selectedDocument: s.selectedDocument ? docs.find(d => d.id === s.selectedDocument.id) || s.selectedDocument : null 
                    }))
                })

                const unsubTemplates = onSnapshot(collection(db, 'templates'), (snapshot) => {
                    const tpls = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
                    set({ templates: tpls })
                })

                const unsubFilings = onSnapshot(collection(db, 'filings'), (snapshot) => {
                    const fils = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
                    set({ filings: fils })
                })

                set({ _unsubDocs: unsubDocs, _unsubTemplates: unsubTemplates, _unsubFilings: unsubFilings })
            },

            /** Stop listeners */
            stopSyncing: () => {
                const state = get()
                if (state._unsubDocs) state._unsubDocs()
                if (state._unsubTemplates) state._unsubTemplates()
                if (state._unsubFilings) state._unsubFilings()
                set({ _unsubDocs: null, _unsubTemplates: null, _unsubFilings: null, documents: [], templates: [], filings: [], selectedDocument: null })
            },

            /** Update a document's fields */
            updateDocument: async (id, updates) => {
                try {
                    await updateDoc(doc(db, 'documents', id), updates)
                } catch(e) {
                    console.error("Failed to update doc:", e)
                }
            },

            /** Delete a document by id */
            deleteDocument: async (id) => {
                try {
                    if (get().selectedDocument?.id === id) set({ selectedDocument: null })
                    await deleteDoc(doc(db, 'documents', id))
                } catch(e) {
                    console.error("Failed to delete doc:", e)
                }
            },

            /**
             * Simulate AI document generation with progress feedback.
             */
            generateDocument: async (formData, templateId, userName = 'Unknown User') => {
                const template = get().templates.find((t) => t.id === templateId)
                if (!template) return null

                set({ isGenerating: true, generationProgress: 0 })

                // Simulate AI streaming delay
                const steps = [10, 25, 45, 60, 75, 88, 100]
                for (const step of steps) {
                    await new Promise((r) => setTimeout(r, 280))
                    set({ generationProgress: step })
                }

                // Fill template placeholders
                let content = template.content || ""
                Object.entries(formData).forEach(([key, val]) => {
                    content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), val || `[${key}]`)
                })

                const docId = `doc_${Date.now()}`
                const docData = {
                    title: `${formData.title || template.name} — ${formData.clientName || 'Client'}`,
                    type: template.category || 'General',
                    templateId,
                    status: 'Draft',
                    content,
                    formData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    author: userName,
                    pageCount: Math.floor(content.length / 1800) + 1,
                    wordCount: content.split(' ').length,
                    version: 1,
                    versions: [],
                }

                try {
                    await setDoc(doc(db, 'documents', docId), docData)
                    const finalDoc = { id: docId, ...docData }
                    set({ isGenerating: false, generationProgress: 0 })
                    return finalDoc
                } catch(e) {
                    console.error("Generate failed:", e)
                    set({ isGenerating: false, generationProgress: 0 })
                    return null
                }
            },

            /* ---- Template Actions ---- */

            addTemplate: async (tpl) => {
                const docId = `tpl_${Date.now()}`
                await setDoc(doc(db, 'templates', docId), tpl)
            },

            updateTemplate: async (id, updates) => {
                await updateDoc(doc(db, 'templates', id), updates)
            },

            deleteTemplate: async (id) => {
                await deleteDoc(doc(db, 'templates', id))
            },

            /* ---- Filing Actions ---- */

            submitFiling: async (docId) => {
                const docRef = get().documents.find(d => d.id === docId)
                if (!docRef) return
                
                try {
                    await updateDoc(doc(db, 'documents', docId), { status: 'Pending', submittedAt: new Date().toISOString() })
                    
                    const filingId = `fil_${Date.now()}`
                    await setDoc(doc(db, 'filings', filingId), {
                        documentId: docId,
                        title: docRef.title,
                        status: 'Pending',
                        submittedAt: new Date().toISOString(),
                        courtInfo: 'Supreme Court Circuit'
                    })
                } catch(e) {
                    console.error("Failed Filing:", e)
                }
            },
        }),
        {
            name: 'ldgfa-document-store',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({ selectedDocument: state.selectedDocument }) // Do not cache lists in session if pulling from Firebase
        }
    )
)

export default useDocumentStore
