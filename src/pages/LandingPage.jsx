/**
 * LandingPage — Public-facing marketing page for LDGFA.
 */
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    HiSparkles, HiDocumentText, HiShieldCheck, HiTemplate,
    HiClipboardList, HiArrowRight, HiCheckCircle, HiLightningBolt
} from 'react-icons/hi'

const FEATURES = [
    { icon: HiSparkles,     title: 'AI-Powered Generation',   desc: 'Generate court-ready legal documents in seconds using our specialized AI trained on Liberian law.' },
    { icon: HiTemplate,     title: 'Professional Templates',  desc: 'Choose from a growing library of NDAs, Contracts, Affidavits, Petitions, and more.' },
    { icon: HiClipboardList,title: 'Filing Tracker',          desc: 'Track every submission from draft to approval with a real-time visual timeline.' },
    { icon: HiShieldCheck,  title: 'Compliance Assured',      desc: 'Every template is reviewed for compliance with OHADA and Liberian legal standards.' },
    { icon: HiDocumentText, title: 'Export PDF / DOCX',       desc: 'One-click export of court-ready documents in professional PDF or Word format.' },
    { icon: HiLightningBolt,title: 'Instant Clause Assist',   desc: 'Get AI clause suggestions in real-time as you draft — powered by legal knowledge base.' },
]

const PLANS = [
    { name: 'Starter', price: 'Free', period: '', features: ['5 documents/month', '2 templates', 'Basic AI assistance', 'Email support'], highlight: false },
    { name: 'Pro',     price: '$49',  period: '/mo', features: ['Unlimited documents', '20 templates', 'Advanced AI & clauses', 'Priority support', 'Export PDF/DOCX', 'Filing tracker'], highlight: true },
    { name: 'Enterprise', price: '$149', period: '/mo', features: ['Everything in Pro', 'Custom templates', 'RBAC & team management', 'API access', 'SLA guarantee', 'Dedicated manager'], highlight: false },
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 22 } } }

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white overflow-hidden">
            {/* Nav */}
            <nav className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-white/5 backdrop-blur-md sticky top-0 z-40">
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <HiDocumentText className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-black text-lg tracking-tight text-white">LDGFA<span className="text-primary-400">.</span></span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-4 py-2 text-sm font-semibold text-white/70 hover:text-white transition-colors"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white font-semibold text-sm rounded-xl transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
                    >
                        Get Started Free
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <motion.section
                initial="hidden"
                animate="show"
                variants={container}
                className="text-center px-6 pt-24 pb-20 max-w-5xl mx-auto"
            >
                <motion.div variants={item} className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 text-primary-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
                    <HiSparkles className="h-3.5 w-3.5" /> AI-Powered Legal Document Platform
                </motion.div>
                <motion.h1 variants={item} className="text-5xl md:text-7xl font-black leading-none tracking-tight mb-6">
                    Legal Documents,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-cyan-300">
                        Generated in Seconds.
                    </span>
                </motion.h1>
                <motion.p variants={item} className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
                    LDGFA empowers Liberian law firms with AI-driven document generation, compliance-assured templates, and intelligent filing management — all in one modern platform.
                </motion.p>
                <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/signup')}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 hover:bg-primary-500 rounded-2xl font-bold text-lg transition-all shadow-2xl shadow-primary-500/40 hover:shadow-primary-500/60 hover:-translate-y-0.5"
                    >
                        Start for Free <HiArrowRight className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 rounded-2xl font-bold text-lg transition-all"
                    >
                        Demo Login
                    </button>
                </motion.div>
                <motion.p variants={item} className="text-xs text-white/30 mt-6">No credit card required · Cancel anytime</motion.p>
            </motion.section>

            {/* Stats bar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="max-w-4xl mx-auto px-6 mb-24"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Documents Generated', value: '12,000+' },
                        { label: 'Law Firms Served',    value: '380+' },
                        { label: 'Templates Available', value: '50+' },
                        { label: 'Filing Success Rate', value: '98%' },
                    ].map((s) => (
                        <div key={s.label} className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-center backdrop-blur-sm">
                            <p className="text-2xl font-black text-white">{s.value}</p>
                            <p className="text-xs text-white/40 font-medium mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Features */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="max-w-6xl mx-auto px-6 mb-28"
            >
                <motion.div variants={item} className="text-center mb-14">
                    <h2 className="text-4xl font-black text-white tracking-tight">Everything you need</h2>
                    <p className="text-white/40 mt-3 text-base">Built specifically for modern legal practice in Liberia</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {FEATURES.map((f) => (
                        <motion.div
                            key={f.title}
                            variants={item}
                            className="rounded-2xl bg-white/5 border border-white/8 p-6 backdrop-blur-sm hover:bg-white/10 hover:border-primary-500/30 transition-all duration-300 group"
                        >
                            <div className="h-11 w-11 rounded-xl bg-primary-500/15 flex items-center justify-center mb-4 group-hover:bg-primary-500/25 transition-colors">
                                <f.icon className="h-5 w-5 text-primary-400" />
                            </div>
                            <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                            <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Pricing */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="max-w-5xl mx-auto px-6 mb-28"
            >
                <motion.div variants={item} className="text-center mb-14">
                    <h2 className="text-4xl font-black text-white tracking-tight">Simple pricing</h2>
                    <p className="text-white/40 mt-3 text-base">No hidden fees. Upgrade or downgrade anytime.</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {PLANS.map((plan) => (
                        <motion.div
                            key={plan.name}
                            variants={item}
                            className={`rounded-2xl p-7 flex flex-col relative border transition-all ${
                                plan.highlight
                                    ? 'bg-primary-600 border-primary-400 shadow-2xl shadow-primary-500/30 scale-105'
                                    : 'bg-white/5 border-white/10 backdrop-blur-sm'
                            }`}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-900 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">
                                    Most Popular
                                </div>
                            )}
                            <p className="font-black text-xl text-white mb-1">{plan.name}</p>
                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-black text-white">{plan.price}</span>
                                <span className="text-white/50 text-sm">{plan.period}</span>
                            </div>
                            <div className="flex-1 space-y-3 mb-8">
                                {plan.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                                        <HiCheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-400" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => navigate('/signup')}
                                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                                    plan.highlight
                                        ? 'bg-white text-primary-700 hover:bg-white/90'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                }`}
                            >
                                Get Started
                            </button>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto px-6 pb-28 text-center"
            >
                <div className="rounded-3xl bg-gradient-to-br from-primary-600 to-cyan-600 p-12 shadow-2xl shadow-primary-500/30">
                    <h2 className="text-3xl font-black text-white mb-4">Ready to transform your practice?</h2>
                    <p className="text-white/70 mb-8">Join hundreds of Liberian legal professionals already using LDGFA.</p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-10 py-4 bg-white text-primary-700 font-black text-lg rounded-2xl hover:bg-white/90 transition-all shadow-xl"
                    >
                        Create Free Account →
                    </button>
                </div>
            </motion.section>

            {/* Footer */}
            <footer className="border-t border-white/5 px-6 py-8 text-center text-xs text-white/20">
                © {new Date().getFullYear()} LDGFA Legal Document Generator. All rights reserved.
            </footer>
        </div>
    )
}
