"use client"

export default function Loader() {
    return (<div className="flex flex-grow justify-center items-center">
        <svg aria-label="Chargement…" className="animate-spin absolute left-[50%] top-[50%] text-white opacity-60" role="img" viewBox="0 0 100 100" width={20} height={20}>
            <rect fill="white" height="10" opacity="0" rx="5" ry="5" transform="rotate(-90 50 50)" width="28" x="67" y="45"></rect>
            <rect fill="white" height="10" opacity="0.125" rx="5" ry="5" transform="rotate(-45 50 50)" width="28" x="67" y="45"></rect>
            <rect fill="white" height="10" opacity="0.25" rx="5" ry="5" transform="rotate(0 50 50)" width="28" x="67" y="45"></rect>
            <rect fill="white" height="10" opacity="0.375" rx="5" ry="5" transform="rotate(45 50 50)" width="28" x="67" y="45"></rect>
            <rect fill="white" height="10" opacity="0.5" rx="5" ry="5" transform="rotate(90 50 50)" width="28" x="67" y="45"></rect>
            <rect fill="white" height="10" opacity="0.625" rx="5" ry="5" transform="rotate(135 50 50)" width="28" x="67" y="45"></rect>
            <rect fill="white" height="10" opacity="0.75" rx="5" ry="5" transform="rotate(180 50 50)" width="28" x="67" y="45"></rect>
            <rect fill="white" height="10" opacity="0.875" rx="5" ry="5" transform="rotate(225 50 50)" width="28" x="67" y="45"></rect>
        </svg>
    </div>
    )
}