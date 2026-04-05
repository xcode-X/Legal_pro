/**
 * Modal — Accessible dialog overlay.
 * Usage: <Modal isOpen={bool} onClose={fn} title="..." size="md|lg|xl">
 */
import React, { useEffect } from 'react'
import { HiX } from 'react-icons/hi'
import clsx from 'clsx'

const SIZE_MAP = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
}

export default function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
    // Close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose() }
        if (isOpen) document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Panel */}
            <div className={clsx(
                'relative w-full bg-white rounded-2xl shadow-soft-xl border border-gray-100 animate-fade-in flex flex-col',
                SIZE_MAP[size],
                'max-h-[90vh]'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <HiX className="h-5 w-5" />
                    </button>
                </div>
                {/* Body */}
                <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 flex gap-3 justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}
