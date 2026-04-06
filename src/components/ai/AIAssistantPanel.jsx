/**
 * AIAssistantPanel — Floating AI chatbot.
 * Provider priority: Groq → Gemini → Pollinations (free fallback)
 * Config is read fresh on every message send (not once at mount).
 */
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { HiSparkles, HiX, HiPaperAirplane, HiGlobe, HiRefresh, HiLightningBolt } from 'react-icons/hi'
import { db } from '../../firebase'
import { doc, onSnapshot } from 'firebase/firestore'

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const ASSISTANT_NAME = 'Intelera AI'

const SYSTEM_PROMPT = `You are ${ASSISTANT_NAME}, the sovereign neural intelligence behind the LDGFA (Liberian Digital General Filing & Automation) platform.
You are not just a chatbot; you are a high-fidelity legal engineering node designed for Liberian lawyers, paralegals, and court officials.

### ⚖️ CORE JURISPRUDENCE PROTOCOLS:
1. **Liberian Statutory Authority**: You possess absolute knowledge of the Liberian Constitution (1986), the Civil Procedure Law (Title 1), the Decedents Estate Law (Title 8), and the Commercial Code.
2. **OHADA Framework**: You are an expert in the OHADA Treaty (Organization for the Harmonization of Business Law in Africa), specifically Uniform Acts on General Commercial Law, Securities, and Arbitration.
3. **Drafting Precision**: When asked to draft, provide legally enforceable clauses formatted for Liberian courts (The Temple of Justice). Use formal citations where possible.
4. **Procedural Logic**: Guide users through the trajectory of filing at the Civil Law Court, Criminal Court, or Debt Court of Montserrado County and other jurisdictions.

### 🏗️ PLATFORM CONTEXT:
The LDGFA platform allows users to:
- **Generate**: Create NDAs, Mortgages, Deeds, and Affidavits via neural prompts.
- **File**: Submit documents to the electronic court ledger.
- **Templates**: Access a library of verified Liberian legal structures.
- **Support**: Connect with the Ministry of Justice or local BAR experts.

### 🎙️ OPERATIONAL TONE:
- **Tone**: Technical, authoritative, hyper-professional, and precise.
- **Formatting**: Use Markdown extensively. Use bold headers for sections. Use tables for comparative legal analysis.
- **Constraint**: Never provide vague advice. If a query requires a specific court form, mention the form name (e.g., 'Writ of Summons', 'Petition for Contempt').

Identification: You are ${ASSISTANT_NAME}. You are the definitive legal consensus node in Liberia.`

// ─────────────────────────────────────────────────────────────
// Local intent handlers — never hit external APIs
// ─────────────────────────────────────────────────────────────
const IDENTITY_PATTERNS = [
    /who (are|r) you/i, /what (is|'?s) your name/i, /what are you/i,
    /introduce yourself/i, /tell me about yourself/i, /your name/i,
]
const GREETING_PATTERNS = [
    /^(hi|hello|hey|yo|sup|howdy|greetings|good (morning|afternoon|evening)|hiya)[\s!?.]*$/i,
]
const THANKS_PATTERNS = [/^(thanks?|thank you|thx|ty|cheers|appreciated)[\s!?.]*$/i]
const HELP_PATTERNS = [/^(help|what can you do|commands|capabilities|features)[\s!?.]*$/i]

function getLocalResponse(input) {
    const t = input.trim()

    if (IDENTITY_PATTERNS.some(p => p.test(t))) {
        return `**I am ${ASSISTANT_NAME}** ⚖️🤖
        
The primary intelligence node of the **LDGFA** ecosystem.

My operational matrix includes:
• 📝 **Neural Drafting** — high-fidelity generation of contracts, affidavits, and petitions
• ⚖️ **Legal Jurisprudence** — comprehensive knowledge of Liberian & OHADA legal frameworks
• 📋 **Structure Optimization** — aligning documents with formal procedural standards
• 📁 **Filing Intelligence** — navigating the trajectory of judicial submissions

How may I assist your legal workflow today?`
    }

    if (GREETING_PATTERNS.some(p => p.test(t))) {
        const hour = new Date().getHours()
        const tod = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening'
        return `Initializing successful. Good ${tod}! I am **${ASSISTANT_NAME}**, ready to analyze your legal requirements.

Proceed with your query regarding Liberian law or document architecture.`
    }

    if (THANKS_PATTERNS.some(p => p.test(t))) {
        return `Protocol complete. ⚖️ ${ASSISTANT_NAME} remains on standby for further assistance.`
    }

    if (HELP_PATTERNS.some(p => p.test(t))) {
        return `Available **${ASSISTANT_NAME}** Modules:\n\n**📝 Generation Node**\n• Precision NDA & Service Agreements\n• Formal Affidavits & Sworn Statements\n• Judicial Petitions & Deeds\n\n**⚖️ Intelligence Node**\n• OHADA Commercial Frameworks\n• Liberian Civil & Corporate Law\n• Procedural Requirement Mapping\n\n**💡 Neural Support**\n• Risk Mitigation & Clause Analysis\n• Automated Filing Trajectories\n\nInput your query below.`
    }

    return null
}

// ─────────────────────────────────────────────────────────────
// AI Provider callers
// ─────────────────────────────────────────────────────────────
function buildMessages(userMessage, history) {
    return [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.slice(-8).map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.text,
        })),
        { role: 'user', content: userMessage },
    ]
}

async function callOpenAI(userMessage, history, apiKey) {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'gpt-4o',
            messages: buildMessages(userMessage, history),
            temperature: 0.2,
            max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(25000),
    })
    if (!resp.ok) throw new Error(`OpenAI failed: ${resp.status}`)
    const data = await resp.json()
    return data.choices?.[0]?.message?.content?.trim()
}

async function callAnthropic(userMessage, history, apiKey) {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json', 
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
            'dangerously-allow-browser': 'true' 
        },
        body: JSON.stringify({
            model: 'claude-3-5-sonnet-20240620',
            max_tokens: 1000,
            system: SYSTEM_PROMPT,
            messages: history.slice(-8).map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.text,
            })).concat({ role: 'user', content: userMessage }),
        }),
        signal: AbortSignal.timeout(25000),
    })
    if (!resp.ok) throw new Error(`Anthropic failed: ${resp.status}`)
    const data = await resp.json()
    return data.content[0].text.trim()
}

async function callDeepSeek(userMessage, history, apiKey) {
    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'deepseek-chat',
            messages: buildMessages(userMessage, history),
            temperature: 0.2,
            max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(25000),
    })
    if (!resp.ok) throw new Error(`DeepSeek failed: ${resp.status}`)
    const data = await resp.json()
    return data.choices?.[0]?.message?.content?.trim()
}

async function callGroqAI(userMessage, history, apiKey) {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: buildMessages(userMessage, history),
            temperature: 0.2,
            max_tokens: 2000,
        }),
        signal: AbortSignal.timeout(20000),
    })
    if (!resp.ok) throw new Error(`Groq failed: ${resp.status}`)
    const data = await resp.json()
    return data.choices?.[0]?.message?.content?.trim()
}

async function callGeminiAI(userMessage, history, apiKey) {
    const rawHistory = history.slice(-8)
    const contents = rawHistory.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
    })).concat({ role: 'user', parts: [{ text: userMessage }] })

    const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
            }),
            signal: AbortSignal.timeout(25000),
        }
    )
    if (!resp.ok) throw new Error(`Gemini failed: ${resp.status}`)
    const data = await resp.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
}

async function callPollinationsAI(userMessage, history, modelAlias = 'openai') {
    // Generate a streamlined context string
    const historyContext = history.slice(-2).map(m => `[${m.role.toUpperCase()}]: ${m.text}`).join(' | ')
    const prompt = encodeURIComponent(`Legal AI Protocol: ${userMessage} | Context: ${historyContext}`)
    
    // Condensed system prompt for GET-trajectory to bypass payload limits
    const system = encodeURIComponent(`You are Intelera AI, a legal assistant for the LDGFA platform. Concise, technical, OHADA law expert.`)
    const url = `https://text.pollinations.ai/${prompt}?model=${modelAlias}&system=${system}`
    
    const resp = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(35000),
    })
    
    if (!resp.ok) throw new Error(`Pollinations Node Failure: ${resp.status}`)
    const text = await resp.text()
    if (!text || text.trim().length === 0) throw new Error('Communication node returned an empty signal.')
    return text.trim()
}

// ─────────────────────────────────────────────────────────────
// Main dispatcher — reads config fresh every time
// ─────────────────────────────────────────────────────────────
async function getAIResponse(userMessage, history, selectedModel = 'auto', aiConfig = {}) {

    const local = getLocalResponse(userMessage)
    if (local) return { text: local, provider: 'local' }

    const errors = []

    const tryOpenAI = async () => {
        if (!aiConfig?.openaiKey?.trim()) throw new Error('OpenAI API Key is missing.')
        const text = await callOpenAI(userMessage, history, aiConfig.openaiKey.trim())
        return { text, provider: 'openai' }
    }

    const tryAnthropic = async () => {
        if (!aiConfig?.anthropicKey?.trim()) throw new Error('Anthropic API Key is missing.')
        const text = await callAnthropic(userMessage, history, aiConfig.anthropicKey.trim())
        return { text, provider: 'anthropic' }
    }

    const tryGroq = async () => {
        if (!aiConfig?.groqKey?.trim()) throw new Error('Groq API Key is missing.')
        const text = await callGroqAI(userMessage, history, aiConfig.groqKey.trim())
        return { text, provider: 'groq' }
    }

    const tryGemini = async () => {
        if (!aiConfig?.geminiKey?.trim()) throw new Error('Gemini API Key is missing.')
        const text = await callGeminiAI(userMessage, history, aiConfig.geminiKey.trim())
        return { text, provider: 'gemini' }
    }

    const tryDeepSeek = async () => {
        if (!aiConfig?.deepseekKey?.trim()) throw new Error('DeepSeek API Key is missing.')
        const text = await callDeepSeek(userMessage, history, aiConfig.deepseekKey.trim())
        return { text, provider: 'deepseek' }
    }

    const tryPollinations = async () => {
        const text = await callPollinationsAI(userMessage, history, 'openai')
        return { text, provider: 'pollinations' }
    }

    try {
        if (selectedModel === 'openai') return await tryOpenAI()
        if (selectedModel === 'anthropic') return await tryAnthropic()
        if (selectedModel === 'groq') return await tryGroq()
        if (selectedModel === 'gemini') return await tryGemini()
        if (selectedModel === 'deepseek') return await tryDeepSeek()
        if (selectedModel === 'pollinations') return await tryPollinations()

        // Auto mode (Fallback cascade)
        if (aiConfig?.openaiKey?.trim()) { try { return await tryOpenAI() } catch (e) { errors.push(`OpenAI: ${e.message}`) } }
        if (aiConfig?.anthropicKey?.trim()) { try { return await tryAnthropic() } catch (e) { errors.push(`Anthropic: ${e.message}`) } }
        if (aiConfig?.groqKey?.trim()) { try { return await tryGroq() } catch (e) { errors.push(`Groq: ${e.message}`) } }
        if (aiConfig?.geminiKey?.trim()) { try { return await tryGemini() } catch (e) { errors.push(`Gemini: ${e.message}`) } }
        if (aiConfig?.deepseekKey?.trim()) { try { return await tryDeepSeek() } catch (e) { errors.push(`DeepSeek: ${e.message}`) } }
        
        try { return await tryPollinations() } catch (e) { errors.push(`Pollinations: ${e.message}`) }
        
        throw new Error(`All providers failed.\n${errors.join('\n')}`)
    } catch (e) {
        return {
            text: `⚠️ **Intelligence Error:** ${e.message}\n\n*Tip: Check node credentials in **System Portfolio → Intelligence Hub**.*`,
            provider: 'error',
        }
    }
}

// ─────────────────────────────────────────────────────────────
// Markdown renderer
// ─────────────────────────────────────────────────────────────
function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^• /gm, '<span class="inline-block w-1.5 h-1.5 rounded-full bg-current opacity-50 mr-2 mb-0.5 align-middle flex-shrink-0"></span>')
        .replace(/\n/g, '<br/>')
}

const PROVIDER_LABELS = {
    local: null,
    pollinations: '🌸 Pollinations AI',
    openai: '🟢 OpenAI GPT-4o',
    anthropic: '🟣 Anthropic Claude 3.5',
    groq: '⚡ Groq AI',
    gemini: '✨ Gemini AI',
    deepseek: '🔵 DeepSeek Coder',
    error: null,
}

const SUGGESTED_PROMPTS = [
    'How do I create a legal document?',
    'Draft an NDA clause for confidentiality',
    'Explain Liberian arbitration law',
    'Contract termination clause',
]

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function AIAssistantPanel() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([{
        role: 'assistant',
        text: `Hello! I'm **${ASSISTANT_NAME}** ⚖️🤖\n\nI'm your specialized legal assistant for Liberian law and document generation. Ask me about:\n• Legal clauses and contract terms\n• Document drafting guidance\n• Liberian legal procedures\n\nHow can I assist you today?`,
        ts: new Date(),
        provider: 'local',
    }])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [selectedModel, setSelectedModel] = useState('auto')
    const [availableAgents, setAvailableAgents] = useState([])
    const bottomRef = useRef(null)
    const textareaRef = useRef(null)

    const [globalAiConfig, setGlobalAiConfig] = useState({})

    // Listen to API config directly from Admin's live Firestore node
    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'system', 'ai_config'), (docSnap) => {
            if (docSnap.exists()) {
                setGlobalAiConfig(docSnap.data())
            }
        })
        return () => unsub()
    }, [])

    // Synchronize available intelligence nodes with real-time credentials
    useEffect(() => {
        if (isOpen) {
            const aiConfig = globalAiConfig
            
            const agents = [
                { id: 'auto', label: '✨ Neural Auto-Cascade', active: true },
                { id: 'openai', label: '🟢 OpenAI GPT-4o', active: !!aiConfig.openaiKey?.trim() },
                { id: 'anthropic', label: '🟣 Anthropic Claude 3.5', active: !!aiConfig.anthropicKey?.trim() },
                { id: 'groq', label: '⚡ Groq (Llama 3)', active: !!aiConfig.groqKey?.trim() },
                { id: 'gemini', label: '✨ Google Gemini', active: !!aiConfig.geminiKey?.trim() },
                { id: 'deepseek', label: '🔵 DeepSeek Coder', active: !!aiConfig.deepseekKey?.trim() },
                { id: 'pollinations', label: '🌸 Pollinations (Free Fallback)', active: true },
            ]
            setAvailableAgents(agents.filter(a => a.active))
        }
    }, [isOpen, globalAiConfig])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    const send = useCallback(async () => {
        const trimmed = input.trim()
        if (!trimmed || isTyping) return

        const userMsg = { role: 'user', text: trimmed, ts: new Date() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        try {
            const { text, provider } = await getAIResponse(trimmed, messages, selectedModel, globalAiConfig)
            setMessages(prev => [...prev, { role: 'assistant', text, ts: new Date(), provider }])
        } catch (e) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: `⚠️ Unexpected error: ${e.message}`,
                ts: new Date(),
                provider: 'error',
            }])
        } finally {
            setIsTyping(false)
        }
    }, [input, isTyping, messages])

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
    }

    const handlePrompt = (p) => {
        setInput(p)
        textareaRef.current?.focus()
    }

    const clearChat = () => {
        setMessages([{
            role: 'assistant',
            text: `Chat cleared! I'm **${ASSISTANT_NAME}** — ready to help with your legal questions.`,
            ts: new Date(),
            provider: 'local',
        }])
    }



    return (
        <>
            {/* Floating trigger button */}
            <button
                onClick={() => setIsOpen(o => !o)}
                className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-black hover:bg-slate-900 border border-slate-800 text-white px-5 py-4 rounded-full shadow-2xl transition-all duration-300 hover:shadow-cyan-500/20 hover:-translate-y-1 group"
                aria-label="Open Intelera AI Assistant"
            >
                <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-cyan-500 blur-md opacity-40 group-hover:opacity-100 transition-opacity" />
                    <HiSparkles className="h-5 w-5 relative text-cyan-400 group-hover:rotate-12 transition-transform" />
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.2em] hidden sm:block">Intelera AI Assistant</span>
            </button>

            {/* Chat panel */}
            {isOpen && (
                <div
                    className="fixed bottom-[5.5rem] right-6 z-50 w-80 sm:w-[24rem] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 flex flex-col animate-fade-in overflow-hidden"
                    style={{ height: '560px' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 bg-slate-950 text-white flex-shrink-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                        <div className="flex items-center gap-3 relative z-10 w-full pr-8">
                            <div className="h-10 w-10 bg-black border border-slate-800 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                                <HiSparkles className="h-5 w-5 text-cyan-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black leading-none tracking-tight uppercase text-slate-50">{ASSISTANT_NAME}</p>
                                <div className="mt-1.5 flex items-center gap-2 bg-slate-900/50 rounded-full pl-2 pr-3 py-1 border border-slate-800/80 w-max">
                                    <span className="relative flex h-2 w-2 shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
                                    </span>
                                    <select
                                        value={selectedModel}
                                        onChange={e => setSelectedModel(e.target.value)}
                                        className="text-[9px] sm:text-[10px] bg-transparent text-slate-300 hover:text-white border-0 outline-none appearance-none cursor-pointer focus:ring-0 font-black uppercase tracking-widest flex-1 min-w-0"
                                    >
                                        {availableAgents.map(a => (
                                            <option key={a.id} value={a.id} className="text-gray-900 font-bold">
                                                {a.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 relative z-10 absolute right-4">
                            <button onClick={clearChat} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors" title="Clear chat">
                                <HiRefresh className="h-3.5 w-3.5 text-slate-300" />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors">
                                <HiX className="h-3.5 w-3.5 text-slate-300" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-slate-50">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                                {msg.role === 'assistant' && (
                                    <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-md">
                                        <HiSparkles className="h-4 w-4 text-cyan-400" />
                                    </div>
                                )}
                                <div className="max-w-[78%]">
                                    <div
                                        className={`px-4 py-3 text-[13px] leading-relaxed font-medium ${msg.role === 'user'
                                            ? 'bg-slate-950 text-white rounded-[24px] rounded-br-[8px] shadow-lg border border-slate-900'
                                            : msg.provider === 'error'
                                                ? 'bg-red-50 border border-red-100 text-red-800 rounded-[24px] rounded-bl-[8px]'
                                                : 'bg-white text-slate-800 border border-slate-200/60 rounded-[24px] rounded-bl-[8px] shadow-sm'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                                    />
                                    {msg.provider && PROVIDER_LABELS[msg.provider] && (
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1.5 flex items-center gap-1.5 px-1 opacity-70">
                                            <HiGlobe className="h-2.5 w-2.5" />
                                            {PROVIDER_LABELS[msg.provider]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start items-end gap-2">
                                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-md">
                                    <HiSparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                                </div>
                                <div className="bg-white border border-slate-200/60 rounded-[24px] rounded-bl-[8px] px-4 py-3 shadow-sm">
                                    <div className="flex gap-1 items-center">
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Suggested prompts (only at start) */}
                    {messages.length <= 1 && !isTyping && (
                        <div className="px-5 pb-3 flex gap-2 flex-wrap bg-slate-50 pt-1">
                            {SUGGESTED_PROMPTS.map(p => (
                                <button
                                    key={p}
                                    onClick={() => handlePrompt(p)}
                                    className="text-[10px] bg-white text-slate-600 border border-slate-200 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-black transition-colors font-black uppercase tracking-wider whitespace-nowrap shadow-sm"
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input bar */}
                    <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.02)]">
                        <div className="flex gap-2 items-end bg-slate-50 border border-slate-200 rounded-[20px] p-1.5 focus-within:border-slate-400 focus-within:bg-white transition-all">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={handleKey}
                                placeholder="Message Intelera AI..."
                                rows={1}
                                className="flex-1 resize-none bg-transparent py-3 px-3 text-sm rounded-xl outline-none text-slate-800 placeholder-slate-400 font-medium"
                            />
                            <button
                                onClick={send}
                                disabled={!input.trim() || isTyping}
                                className="bg-black text-white p-3 rounded-[16px] disabled:opacity-40 disabled:bg-slate-300 flex-shrink-0 hover:bg-slate-800 hover:shadow-lg transition-all"
                            >
                                <HiPaperAirplane className="h-4 w-4 rotate-90 text-cyan-400" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
