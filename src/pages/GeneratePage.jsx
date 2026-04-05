/**
 * GeneratePage — Step-by-step document generation wizard.
 * Steps: 1) Choose Template → 2) Fill Form → 3) AI Generates → 4) Review
 */
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { HiCheck, HiChevronRight, HiChevronLeft, HiSparkles, HiDownload, HiDocumentText, HiChevronDown } from 'react-icons/hi'
import useDocumentStore from '../store/useDocumentStore'
import useAuthStore from '../store/useAuthStore'
import useToastStore from '../store/useToastStore'
import TemplateIcon from '../components/ui/TemplateIcon'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import jsPDF from 'jspdf'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

// AI Providers
async function callGroqAI(prompt, apiKey) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: 'llama-3.1-8b-instant', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 2000 }),
    })
    if (!resp.ok) throw new Error('Groq failed')
    return (await resp.json()).choices[0].message.content.trim()
}

async function callGeminiAI(prompt, apiKey) {
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 2000 } }),
    })
    if (!resp.ok) throw new Error('Gemini failed')
    const data = await resp.json()
    return data.candidates[0].content.parts[0].text.trim()
}

async function callPollinationsAI(prompt) {
    const resp = await fetch('https://text.pollinations.ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'openai', messages: [{ role: 'user', content: prompt }], temperature: 0.7, max_tokens: 2000 }),
    })
    if (!resp.ok) throw new Error('Pollinations failed')
    return (await resp.json()).choices[0].message.content.trim()
}

const STEPS = ['Choose Template', 'Fill Details', 'AI Generation', 'Review & Export']

function StepIndicator({ current }) {
    return (
        <div className="flex items-center gap-0 mb-8">
            {STEPS.map((step, i) => (
                <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                        <div className={clsx(
                            'h-9 w-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300',
                            i < current ? 'bg-primary-600 text-white' :
                                i === current ? 'bg-primary-600 text-white ring-4 ring-primary-100' :
                                    'bg-gray-100 text-gray-400'
                        )}>
                            {i < current ? <HiCheck className="h-4 w-4" /> : i + 1}
                        </div>
                        <span className={clsx(
                            'mt-1 text-xs font-medium',
                            i <= current ? 'text-primary-700' : 'text-gray-400'
                        )}>
                            {step}
                        </span>
                    </div>
                    {i < STEPS.length - 1 && (
                        <div className={clsx(
                            'flex-1 h-0.5 mx-2 mb-4 transition-all duration-500',
                            i < current ? 'bg-primary-600' : 'bg-gray-200'
                        )} />
                    )}
                </React.Fragment>
            ))}
        </div>
    )
}

function TemplateCard({ template, selected, onSelect }) {
    return (
        <button
            onClick={() => onSelect(template)}
            className={clsx(
                'w-full text-left p-5 rounded-2xl border-2 transition-all duration-200',
                selected?.id === template.id
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm'
            )}
        >
            <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TemplateIcon name={template.icon} className="h-5 w-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{template.name}</p>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                            {template.category}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{template.description}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">⏱ {template.estimatedTime}</span>
                        <span className="text-xs text-gray-400">📄 {template.fields.length} fields</span>
                        <span className="text-xs text-gray-400">🔁 {template.usageCount} uses</span>
                    </div>
                </div>
                {selected?.id === template.id && (
                    <div className="h-5 w-5 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <HiCheck className="h-3 w-3 text-white" />
                    </div>
                )}
            </div>
        </button>
    )
}

function FormField({ field, value, onChange }) {
    const base = 'w-full bg-white border border-gray-200 text-gray-900 rounded-xl py-3 px-4 outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-sm'

    if (field.type === 'textarea') {
        return (
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                    {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <textarea
                    value={value}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={`Enter ${field.label.toLowerCase()}...`}
                    className={clsx(base, 'min-h-[120px] resize-none')}
                    required={field.required}
                />
            </div>
        )
    }

    if (field.type === 'select') {
        return (
            <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-gray-700">
                    {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
                <div className="relative">
                    <select
                        value={value}
                        onChange={(e) => onChange(field.key, e.target.value)}
                        className={clsx(base, 'appearance-none pr-10')}
                        required={field.required}
                    >
                        <option value="">Select...</option>
                        {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">
                {field.label}{field.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
            <input
                type={field.type}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
                className={base}
                required={field.required}
            />
        </div>
    )
}

function GenerationAnimation({ progress }) {
    const steps = [
        { label: 'Analyzing template structure', threshold: 25 },
        { label: 'Processing form data', threshold: 45 },
        { label: 'AI generating content', threshold: 75 },
        { label: 'Applying legal formatting', threshold: 90 },
        { label: 'Finalizing document', threshold: 100 },
    ]

    return (
        <div className="text-center py-8">
            <div className="mb-6 relative">
                <div className="h-20 w-20 mx-auto bg-primary-50 rounded-2xl flex items-center justify-center">
                    <HiSparkles className="h-10 w-10 text-primary-600 animate-pulse" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">AI is generating your document</h3>
            <p className="text-sm text-gray-500 mb-6">This usually takes under 5 seconds</p>

            {/* Progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
                <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <p className="text-sm font-semibold text-primary-600 mb-6">{progress}%</p>

            {/* Steps */}
            <div className="text-left space-y-2 max-w-xs mx-auto">
                {steps.map((s) => (
                    <div key={s.label} className={clsx(
                        'flex items-center gap-2 text-sm transition-all duration-300',
                        progress >= s.threshold ? 'text-emerald-600' : 'text-gray-300'
                    )}>
                        {progress >= s.threshold
                            ? <HiCheck className="h-4 w-4 flex-shrink-0" />
                            : <div className="h-4 w-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                        }
                        {s.label}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function GeneratePage() {
    const [step, setStep] = useState(0)
    const [selectedTemplate, setSelectedTemplate] = useState(null)
    const [formData, setFormData] = useState({})
    const [generatedDoc, setGeneratedDoc] = useState(null)
    const [localProgress, setLocalProgress] = useState(0)
    const { templates, addDocument } = useDocumentStore()
    const { user } = useAuthStore()
    const { addToast } = useToastStore()
    const navigate = useNavigate()
    const location = useLocation()

    // Pre-select template if navigated from TemplatesPage
    useEffect(() => {
        if (location.state?.templateId) {
            const tpl = templates.find((t) => t.id === location.state.templateId)
            if (tpl) {
                setSelectedTemplate(tpl)
                setStep(1)
            }
        }
    }, [location.state, templates])

    const handleFieldChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleGenerate = async () => {
        setStep(2)
        setLocalProgress(0)

        // Progress simulation
        const progressInterval = setInterval(() => {
            setLocalProgress(p => (p < 85 ? p + 5 : p))
        }, 300)

        try {
            // Build AI prompt
            const prompt = `You are LDGFA Legal AI, a specialized legal document generator. 
Generate a precise, detailed, and considerate legal document for the following template: ${selectedTemplate.name}
Category: ${selectedTemplate.category}

The user has provided the following details to include:
${Object.entries(formData).map(([k,v]) => `- ${k}: ${v}`).join('\n')}

Original Template Structure (use this as a base, but make it detailed, professional, and use a considerate format utilizing different patterns where appropriate):
${selectedTemplate.content}

Return ONLY the plain text of the document. Do not use markdown code blocks like \`\`\`markdown.`

            let aiConfig = {}
            try { aiConfig = JSON.parse(localStorage.getItem('ldgfa_ai_config') || '{}') } catch {}

            let content = ''
            if (aiConfig.groqKey?.trim()) {
                try { content = await callGroqAI(prompt, aiConfig.groqKey.trim()) } catch (e) { console.warn(e) }
            }
            if (!content && aiConfig.geminiKey?.trim()) {
                try { content = await callGeminiAI(prompt, aiConfig.geminiKey.trim()) } catch (e) { console.warn(e) }
            }
            if (!content) {
                content = await callPollinationsAI(prompt)
            }

            // Cleanup code blocks if AI added them
            content = content.replace(/^```[a-z]*\n/, '').replace(/\n```$/, '')

            const doc = {
                id: `doc_${Date.now()}`,
                title: `${selectedTemplate.name} — ${formData.clientName || 'Client'}`,
                type: selectedTemplate.category,
                templateId: selectedTemplate.id,
                status: 'Draft',
                content,
                formData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: user?.name || 'Unknown User',
                pageCount: Math.floor(content.length / 1800) + 1,
                wordCount: content.split(' ').length,
                version: 1,
                versions: [],
            }
            setGeneratedDoc(doc)
            setLocalProgress(100)
            setTimeout(() => setStep(3), 600)
        } catch (e) {
            addToast('AI Generation failed. Please try again.', 'error')
            setStep(1)
        } finally {
            clearInterval(progressInterval)
        }
    }

    const handleSaveAndExit = () => {
        addDocument(generatedDoc)
        addToast('Document saved successfully!', 'success')
        navigate('/documents')
    }

    const handleExportPDF = () => {
        if (!generatedDoc) return
        try {
            const doc = new jsPDF({ unit: 'pt', format: 'a4' })
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(11)
            const lines = doc.splitTextToSize(generatedDoc.content, 500)
            let y = 60
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.text(generatedDoc.title, 50, y)
            y += 30
            doc.setFontSize(11)
            doc.setFont('helvetica', 'normal')
            for (const line of lines) {
                if (y > 780) { doc.addPage(); y = 60 }
                doc.text(line, 50, y)
                y += 16
            }
            doc.save(`${generatedDoc.title}.pdf`)
            addToast('PDF downloaded successfully!', 'success')
        } catch (e) {
            addToast('Failed to export PDF.', 'error')
        }
    }

    const handleExportDOCX = async () => {
        if (!generatedDoc) return
        try {
            const paragraphs = generatedDoc.content.split('\n').map(
                (line) => new Paragraph({ children: [new TextRun({ text: line, size: 22 })] })
            )
            const docFile = new Document({
                sections: [{ properties: {}, children: paragraphs }],
            })
            const blob = await Packer.toBlob(docFile)
            saveAs(blob, `${generatedDoc.title}.docx`)
            addToast('DOCX downloaded successfully!', 'success')
        } catch (e) {
            addToast('Failed to export DOCX.', 'error')
        }
    }

    const handleReset = () => {
        setStep(0)
        setSelectedTemplate(null)
        setFormData({})
        setGeneratedDoc(null)
    }

    const canProceedStep1 = !!selectedTemplate
    const canProceedStep2 = selectedTemplate?.fields
        .filter((f) => f.required)
        .every((f) => formData[f.key]?.trim())

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-6">
            <div className="mb-10 text-center relative border-b border-slate-200 pb-8 mt-2">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-slate-100 rounded-full blur-3xl opacity-50 -z-10 mt-4 pointer-events-none" />
                <div className="h-16 w-16 bg-white border border-slate-200 shadow-sm rounded-2xl mx-auto flex items-center justify-center mb-5">
                    <HiSparkles className="h-7 w-7 text-slate-800" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Automated Legal Generation</h1>
                <p className="text-slate-500 max-w-xl mx-auto text-sm font-medium leading-relaxed">
                    Instantly draft rigorous, compliant, and highly structured professional legal frameworks using intelligence-driven generation.
                </p>
            </div>

            <StepIndicator current={step} />

            <AnimatePresence mode="wait">
                {/* Step 0: Choose template */}
                {step === 0 && (
                    <motion.div
                        key="step0"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="card border border-gray-100 shadow-soft-lg space-y-6"
                    >
                        <div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">Select Document Template</h2>
                            <p className="text-sm text-slate-500 font-medium">Choose the specific legal framework you wish to generate from our secure repository.</p>
                        </div>

                        <div className="bg-white p-2 rounded-2xl">
                            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">Template Framework Library</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 rounded-2xl py-4 pl-5 pr-12 outline-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-bold text-[15px] cursor-pointer shadow-sm hover:border-primary-300 hover:bg-white"
                                    value={selectedTemplate?.id || ''}
                                    onChange={(e) => {
                                        const tpl = templates.find(t => t.id === e.target.value);
                                        setSelectedTemplate(tpl || null);
                                    }}
                                >
                                    <option value="" disabled>-- Select a Professional Legal Template --</option>
                                    {templates.map(tpl => (
                                        <option key={tpl.id} value={tpl.id}>{tpl.name} — {tpl.category}</option>
                                    ))}
                                </select>
                                <HiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-primary-500 pointer-events-none" />
                            </div>
                        </div>

                        {selectedTemplate && (
                            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 bg-gradient-to-r from-slate-50 to-white rounded-3xl p-6 border border-slate-200 border-l-4 border-l-primary-500 flex items-start gap-6 shadow-sm overflow-hidden relative">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-30 -mr-10 -mt-10 pointer-events-none" />
                                
                                <div className="h-16 w-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10">
                                    <TemplateIcon name={selectedTemplate.icon} className="h-8 w-8 text-primary-600" />
                                </div>
                                <div className="flex-1 relative z-10">
                                    <h3 className="font-black text-slate-900 text-xl tracking-tight mb-2">{selectedTemplate.name}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed max-w-3xl mb-5">{selectedTemplate.description}</p>
                                    
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 shadow-sm uppercase tracking-wider">
                                            {selectedTemplate.category}
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 shadow-sm uppercase tracking-wider">
                                            {selectedTemplate.fields.length} Required Fields
                                        </span>
                                        <span className="flex items-center gap-1.5 text-[10px] font-bold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-emerald-700 shadow-sm uppercase tracking-wider">
                                            Est. Time: {selectedTemplate.estimatedTime}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="flex justify-end mt-4 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setStep(1)}
                                disabled={!canProceedStep1}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50 shadow-primary-500/30 shadow-lg px-8 py-3 w-full sm:w-auto justify-center"
                            >
                                Continue to Configuration <HiChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 1: Fill form */}
                {step === 1 && selectedTemplate && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="card border border-gray-100 shadow-soft-lg space-y-6"
                    >
                        <div className="flex items-center justify-between border-b border-gray-50 pb-4 -mx-2 px-2">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Document Configuration</h2>
                                <p className="text-sm text-gray-500">Provide the specific details for your {selectedTemplate.name}.</p>
                            </div>
                            <div className="h-10 w-10 bg-primary-50 rounded-xl flex items-center justify-center">
                                <TemplateIcon name={selectedTemplate.icon} className="h-5 w-5 text-primary-600" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {selectedTemplate.fields.map((f) => (
                                <FormField
                                    key={f.key}
                                    field={f}
                                    value={formData[f.key] || ''}
                                    onChange={handleFieldChange}
                                />
                            ))}
                        </div>

                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                            <button
                                onClick={() => setStep(0)}
                                className="btn-secondary flex items-center gap-2"
                            >
                                <HiChevronLeft className="h-4 w-4" /> Change Template
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={!canProceedStep2}
                                className="btn-primary flex items-center gap-2 disabled:opacity-50 shadow-primary-500/30 shadow-lg px-8 py-3"
                            >
                                Generate with AI <HiSparkles className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Generation animation */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                        className="card"
                    >
                        <GenerationAnimation progress={localProgress} />
                    </motion.div>
                )}

                {/* Step 3: Review */}
                {step === 3 && generatedDoc && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, type: 'spring' }}
                        className="space-y-4"
                    >
                        {/* Success banner */}
                        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 shadow-sm">
                            <div className="h-9 w-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <HiCheck className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-emerald-800">Document generated successfully!</p>
                                <p className="text-xs text-emerald-600">{generatedDoc.wordCount} words · {generatedDoc.pageCount} page(s) · Saved as Draft</p>
                            </div>
                        </div>

                        {/* Document preview & Editor */}
                        <div className="card shadow-soft-lg flex flex-col h-[500px]">
                            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                <div>
                                    <p className="font-bold text-gray-900">{generatedDoc.title}</p>
                                    <p className="text-xs text-gray-400">You can edit the document text below before saving.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleExportPDF} className="btn-secondary flex items-center gap-2 text-sm py-2">
                                        <HiDownload className="h-4 w-4" /> PDF
                                    </button>
                                    <button onClick={handleExportDOCX} className="btn-secondary flex items-center gap-2 text-sm py-2">
                                        <HiDownload className="h-4 w-4" /> DOCX
                                    </button>
                                </div>
                            </div>
                            <textarea
                                value={generatedDoc.content}
                                onChange={(e) => setGeneratedDoc({ ...generatedDoc, content: e.target.value, wordCount: e.target.value.split(' ').length })}
                                className="flex-1 bg-gray-50 rounded-xl p-6 font-mono text-xs text-gray-800 whitespace-pre-wrap leading-relaxed border border-gray-200 outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none w-full"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex justify-between items-center mt-6">
                            <button onClick={handleReset} className="btn-secondary">
                                Generate Another
                            </button>
                            <button onClick={handleSaveAndExit} className="btn-primary flex items-center gap-2 shadow-primary-500/30 shadow-lg px-8">
                                <HiCheck className="h-5 w-5" />
                                Save Document
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
