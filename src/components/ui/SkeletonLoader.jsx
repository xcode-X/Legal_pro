/**
 * SkeletonLoader — Placeholder loading animation for cards and lists.
 */
import React from 'react'
import clsx from 'clsx'

function SkeletonBlock({ className }) {
    return <div className={clsx('shimmer rounded-lg', className)} />
}

export function DocumentCardSkeleton() {
    return (
        <div className="card animate-pulse">
            <div className="flex items-start justify-between mb-4">
                <SkeletonBlock className="h-5 w-48" />
                <SkeletonBlock className="h-6 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-4 w-32 mb-2" />
            <SkeletonBlock className="h-4 w-24" />
            <div className="flex gap-2 mt-4">
                <SkeletonBlock className="h-8 w-20 rounded-lg" />
                <SkeletonBlock className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="card animate-pulse">
            <div className="flex items-center justify-between mb-3">
                <SkeletonBlock className="h-10 w-10 rounded-xl" />
                <SkeletonBlock className="h-4 w-16" />
            </div>
            <SkeletonBlock className="h-8 w-16 mb-2" />
            <SkeletonBlock className="h-4 w-28" />
        </div>
    )
}

export function TableRowSkeleton({ cols = 5 }) {
    return (
        <tr>
            {Array.from({ length: cols }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <SkeletonBlock className="h-4 w-full max-w-xs" />
                </td>
            ))}
        </tr>
    )
}

export default SkeletonBlock
