/**
 * StatusBadge — Renders a styled badge for document/filing status.
 * Supports: Draft, Pending, Submitted, Approved, Rejected
 */
import React from 'react'
import clsx from 'clsx'

const STATUS_STYLES = {
    Draft: 'bg-gray-100 text-gray-600',
    Pending: 'bg-amber-50 text-amber-700',
    Submitted: 'bg-blue-50 text-blue-700',
    Approved: 'bg-emerald-50 text-emerald-700',
    Rejected: 'bg-red-50 text-red-700',
    Paid: 'bg-emerald-50 text-emerald-700',
    Unpaid: 'bg-amber-50 text-amber-700',
    Overdue: 'bg-red-50 text-red-700',
}

const STATUS_DOTS = {
    Draft: 'bg-gray-400',
    Pending: 'bg-amber-500',
    Submitted: 'bg-blue-500',
    Approved: 'bg-emerald-500',
    Rejected: 'bg-red-500',
    Paid: 'bg-emerald-500',
    Unpaid: 'bg-amber-500',
    Overdue: 'bg-red-500',
}

export default function StatusBadge({ status, size = 'sm' }) {
    const style = STATUS_STYLES[status] || STATUS_STYLES.Draft
    const dot = STATUS_DOTS[status] || STATUS_DOTS.Draft

    return (
        <span className={clsx(
            'inline-flex items-center gap-1.5 rounded-full font-semibold',
            size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm',
            style
        )}>
            <span className={clsx('h-1.5 w-1.5 rounded-full', dot)} />
            {status}
        </span>
    )
}
