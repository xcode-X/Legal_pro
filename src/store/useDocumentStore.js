/**
 * useDocumentStore — Manages documents, templates, and filings state.
 * In production each action would call a corresponding REST API endpoint.
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SAMPLE_TEMPLATES } from '../data/templates'
import { SAMPLE_DOCUMENTS } from '../data/documents'

const useDocumentStore = create(
    persist(
        (set, get) => ({
            documents: [...SAMPLE_DOCUMENTS],
            templates: [...SAMPLE_TEMPLATES],
            filings: [],
            selectedDocument: null,
            isGenerating: false,
            generationProgress: 0,

            /* ---- Document Actions ---- */

            /** Set the currently viewed document */
            selectDocument: (doc) => set({ selectedDocument: doc }),

            /** Add a newly generated document */
            addDocument: (doc) =>
                set((state) => ({ documents: [doc, ...state.documents] })),

            /** Update a document's fields */
            updateDocument: (id, updates) =>
                set((state) => ({
                    documents: state.documents.map((d) =>
                        d.id === id ? { ...d, ...updates } : d
                    ),
                    selectedDocument:
                        state.selectedDocument?.id === id
                            ? { ...state.selectedDocument, ...updates }
                            : state.selectedDocument,
                })),

            /** Delete a document by id */
            deleteDocument: (id) =>
                set((state) => ({
                    documents: state.documents.filter((d) => d.id !== id),
                    selectedDocument:
                        state.selectedDocument?.id === id ? null : state.selectedDocument,
                })),

            /**
             * Simulate AI document generation with progress feedback.
             * In production: POST /api/documents/generate
             */
            generateDocument: async (formData, templateId, userName = 'Unknown User') => {
                const template = get().templates.find((t) => t.id === templateId)
                if (!template) return null

                set({ isGenerating: true, generationProgress: 0 })

                // Simulate streaming generation steps
                const steps = [10, 25, 45, 60, 75, 88, 100]
                for (const step of steps) {
                    await new Promise((r) => setTimeout(r, 280))
                    set({ generationProgress: step })
                }

                // Fill template placeholders with form data
                let content = template.content
                Object.entries(formData).forEach(([key, val]) => {
                    content = content.replace(new RegExp(`\\[${key}\\]`, 'g'), val || `[${key}]`)
                })

                const doc = {
                    id: `doc_${Date.now()}`,
                    title: `${template.name} — ${formData.clientName || 'Client'}`,
                    type: template.category,
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

                set((state) => ({
                    documents: [doc, ...state.documents],
                    isGenerating: false,
                    generationProgress: 0,
                }))

                return doc
            },

            /* ---- Template Actions ---- */

            addTemplate: (tpl) =>
                set((state) => ({ templates: [tpl, ...state.templates] })),

            updateTemplate: (id, updates) =>
                set((state) => ({
                    templates: state.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                })),

            deleteTemplate: (id) =>
                set((state) => ({ templates: state.templates.filter((t) => t.id !== id) })),

            /* ---- Filing Actions ---- */

            submitFiling: (docId) =>
                set((state) => ({
                    documents: state.documents.map((d) =>
                        d.id === docId
                            ? { ...d, status: 'Pending', submittedAt: new Date().toISOString() }
                            : d
                    ),
                })),
        }),
        {
            name: 'ldgfa-document-store',
            partialize: (state) => ({ documents: state.documents, templates: state.templates, filings: state.filings })
        }
    )
)

export default useDocumentStore
