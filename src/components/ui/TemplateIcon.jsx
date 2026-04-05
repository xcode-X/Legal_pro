import React from 'react'
import {
    HiOutlineLockClosed,
    HiOutlineClipboardList,
    HiOutlineScale,
    HiOutlineDocumentText,
    HiOutlineBriefcase,
    HiOutlineMail,
    HiOutlineHome,
    HiOutlineDocument
} from 'react-icons/hi'

const ICON_MAP = {
    lock: HiOutlineLockClosed,
    clipboard: HiOutlineClipboardList,
    scale: HiOutlineScale,
    document: HiOutlineDocumentText,
    briefcase: HiOutlineBriefcase,
    mail: HiOutlineMail,
    home: HiOutlineHome,
    default: HiOutlineDocument
}

export default function TemplateIcon({ name, className = "h-8 w-8 text-primary-600" }) {
    const Icon = ICON_MAP[name] || ICON_MAP.default
    return <Icon className={className} />
}
