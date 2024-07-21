import React from 'react';

type Props = {
    width: number;
    height: number;
    color: string;
    Centered: boolean;
};

const Spinner = ({ width, height, color, Centered }: Props) => {
    return (
        <>
            {Centered ? (
                <div className="flex flex-grow justify-center items-center">
                    <svg
                        width={width}
                        height={height}
                        viewBox="0 0 100 100"
                        aria-label="Chargement…"
                        className={`animate-load absolute left-[50%] top-[50%] text-${color} opacity-60`}
                        role="img"
                    >
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0"
                            rx="5"
                            ry="5"
                            transform="rotate(-90 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0.125"
                            rx="5"
                            ry="5"
                            transform="rotate(-45 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0.25"
                            rx="5"
                            ry="5"
                            transform="rotate(0 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0.375"
                            rx="5"
                            ry="5"
                            transform="rotate(45 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0.5"
                            rx="5"
                            ry="5"
                            transform="rotate(90 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0.625"
                            rx="5"
                            ry="5"
                            transform="rotate(135 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0.75"
                            rx="5"
                            ry="5"
                            transform="rotate(180 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                        <rect
                            fill="currentColor"
                            height="10"
                            opacity="0.875"
                            rx="5"
                            ry="5"
                            transform="rotate(225 50 50)"
                            width="28"
                            x="67"
                            y="45"
                        ></rect>
                    </svg>
                </div>
            ) : (
                <svg
                    width={width}
                    height={height}
                    viewBox="0 0 100 100"
                    aria-label="Chargement…"
                    className={`animate-load text-${color} opacity-60`}
                    role="img"
                >
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0"
                        rx="5"
                        ry="5"
                        transform="rotate(-90 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0.125"
                        rx="5"
                        ry="5"
                        transform="rotate(-45 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0.25"
                        rx="5"
                        ry="5"
                        transform="rotate(0 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0.375"
                        rx="5"
                        ry="5"
                        transform="rotate(45 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0.5"
                        rx="5"
                        ry="5"
                        transform="rotate(90 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0.625"
                        rx="5"
                        ry="5"
                        transform="rotate(135 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0.75"
                        rx="5"
                        ry="5"
                        transform="rotate(180 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                    <rect
                        fill="currentColor"
                        height="10"
                        opacity="0.875"
                        rx="5"
                        ry="5"
                        transform="rotate(225 50 50)"
                        width="28"
                        x="67"
                        y="45"
                    ></rect>
                </svg>
            )}
        </>
    );
};

export default Spinner;