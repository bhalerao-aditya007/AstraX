// src/components/ui/Icon.tsx

export type IconName =
    | "shield"
    | "fingerprint"
    | "evidence-tag"
    | "folder"
    | "phone-tower"
    | "wallet"
    | "badge-star"
    | "radar"
    | "chain-link"
    | "file-text"
    | "video-cctv"
    | "audio-mic"
    | "cdr-table"
    | "image-bio"
    | "alert-triangle"
    | "check-circle"
    | "clock"
    | "map-pin"
    | "network-graph"
    | "scale-justice"
    | "search"
    | "upload"
    | "chevron-down"
    | "chevron-right"
    | "arrow-left"
    | "arrow-right"
    | "refresh"
    | "plus"
    | "trash"
    | "edit"
    | "external-link"
    | "terminal"
    | "eye"
    | "filter"
    | "cross";

interface IconProps extends React.SVGProps<SVGSVGElement> {
    name: IconName;
    size?: number | string;
    className?: string;
}

export default function Icon({ name, size = 18, className = "", ...props }: IconProps) {
    const sizeStyle = { width: size, height: size };

    switch (name) {
        case "shield":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                </svg>
            );
        case "fingerprint":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                    <path d="M2 16h.01" />
                    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                    <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
                    <path d="M14 20a10 10 0 0 0 .5-3" />
                </svg>
            );
        case "evidence-tag":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m12.586 2.586-7 7A2 2 0 0 0 5 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 1.414-.586l7-7a2 2 0 0 0 0-2.828l-8-8a2 2 0 0 0-2.828 0Z" />
                    <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
                </svg>
            );
        case "folder":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                </svg>
            );
        case "phone-tower":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M12 2v20" />
                    <path d="m4.5 10.5 7.5-6 7.5 6" />
                    <path d="m6 15 6-4.5 6 4.5" />
                    <path d="M8 22h8" />
                </svg>
            );
        case "wallet":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                </svg>
            );
        case "badge-star":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
            );
        case "radar":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 12 19 5" />
                    <path d="M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
                </svg>
            );
        case "chain-link":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
            );
        case "file-text":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
                    <path d="M10 9H8" />
                    <path d="M16 13H8" />
                    <path d="M16 17H8" />
                </svg>
            );
        case "video-cctv":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.934a.5.5 0 0 0-.777-.416L16 11" />
                    <rect width="14" height="12" x="2" y="6" rx="2" />
                </svg>
            );
        case "audio-mic":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" x2="12" y1="19" y2="22" />
                </svg>
            );
        case "cdr-table":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M3 9h18" />
                    <path d="M3 15h18" />
                    <path d="M9 3v18" />
                </svg>
            );
        case "image-bio":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
            );
        case "alert-triangle":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                    <line x1="12" x2="12" y1="9" y2="13" />
                    <line x1="12" x2="12.01" y1="17" y2="17" />
                </svg>
            );
        case "check-circle":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="m9 11 3 3L22 4" />
                </svg>
            );
        case "clock":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
            );
        case "map-pin":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            );
        case "network-graph":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="18" cy="6" r="3" />
                    <circle cx="18" cy="18" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <line x1="8.5" x2="15.5" y1="7.5" y2="16.5" />
                    <line x1="9" x2="15" y1="6" y2="6" />
                    <line x1="6" x2="6" y1="9" y2="15" />
                    <line x1="18" x2="18" y1="9" y2="15" />
                </svg>
            );
        case "scale-justice":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                    <path d="M7 21h10" />
                    <path d="M12 3v18" />
                    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
            );
        case "search":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            );
        case "upload":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                </svg>
            );
        case "chevron-down":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m6 9 6 6 6-6" />
                </svg>
            );
        case "chevron-right":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m9 18 6-6-6-6" />
                </svg>
            );
        case "arrow-left":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                </svg>
            );
        case "arrow-right":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                </svg>
            );
        case "refresh":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                    <path d="M16 21h5v-5" />
                </svg>
            );
        case "plus":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
            );
        case "trash":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
            );
        case "edit":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
            );
        case "external-link":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" x2="21" y1="14" y2="3" />
                </svg>
            );
        case "terminal":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" x2="20" y1="19" y2="19" />
                </svg>
            );
        case "eye":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            );
        case "filter":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
            );
        case "cross":
            return (
                <svg style={sizeStyle} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
                    <line x1="18" x2="6" y1="6" y2="18" />
                    <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
            );
        default:
            return null;
    }
}
