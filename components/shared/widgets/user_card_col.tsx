'use client'

import { useEffect, useRef, useState } from "react";
import UserCardItem from "./user_card_item"
import { motion } from "framer-motion";
import { CAROUSEL_DIRECTION_VALUE } from "@/lib/css/motion";

interface Props {
    grid_display: number;
    suggestions: any;
    follow: any;
    my_username: any;
}
export default function UserCardColumn({ grid_display, suggestions, follow, my_username }: Props) {
    const carouselRef = useRef<HTMLDivElement>(null);
    const fullcarouselRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(1000)
    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current && fullcarouselRef.current) {
                carouselRef.current.scrollTo(0, 0);
                const newWidth = fullcarouselRef.current.scrollWidth - carouselRef.current.offsetWidth + 30;
                setWidth(newWidth > 0 ? newWidth : 0);
            }
        };
        updateWidth();

        const handleResize = () => {
            updateWidth();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const getTranslateXValue = () => {
        if (fullcarouselRef.current) {
            const transformStyle = fullcarouselRef.current.style.transform;
            if (transformStyle) {
                const match = transformStyle.match(/translateX\(([^)]+)\)/);
                if (match && match[1]) {
                    return parseFloat(match[1]);
                }
            }
        }
        return 0;
    };
    const handleLeftArrowClick = () => {

        if (fullcarouselRef.current) {
            const newTranslateX = Math.abs(getTranslateXValue()) - CAROUSEL_DIRECTION_VALUE;
            if (newTranslateX >= 0) {
                fullcarouselRef.current.style.transform = `translateX(${-(newTranslateX)}px)`;
            } else {
                fullcarouselRef.current.style.transform = `translateX(${0}px)`;

            }
        }
    };
    const handleRightArrowClick = () => {

        if (fullcarouselRef.current) {
            const newTranslateX = Math.abs(getTranslateXValue()) + CAROUSEL_DIRECTION_VALUE;

            if (newTranslateX <= width) {
                fullcarouselRef.current.style.transform = `translateX(${-(newTranslateX)}px)`;
            } else {
                fullcarouselRef.current.style.transform = `translateX(${-width}px)`;

            }
        }
    }
    const [isDragged, setIsDragged] = useState(false);

    const wrapper = isDragged ? "your-component--dragged" : "your-component";

    const onDragStart = () => {
        setIsDragged(true);
    };

    const onDragEnd = () => {
        setIsDragged(false);
    };
    const renderRows = () => {
        const rows = [];
        for (let i = 0; i < grid_display; i++) {
            const startIndex = i * 3;
            rows.push(
                <motion.div
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                    }}
                    key={i} className="flex flex-row justify-center items-center mt-5">
                    <UserCardItem suggestion={suggestions[startIndex]} myusername={my_username} follow={follow} />
                    <UserCardItem suggestion={suggestions[startIndex + 1]} myusername={my_username} follow={follow} />
                    <UserCardItem suggestion={suggestions[startIndex + 2]} myusername={my_username} follow={follow} />
                </motion.div>
            );
        }
        return rows;
    };

    return (

        <motion.div ref={carouselRef} onDrag={onDragStart} onDragEnd={onDragEnd}
            className="flex flex-row  overflow-x-hidden active:cursor-grabbing cursor-grab ml-[1.25rem]">
            <div className={` mobile:flex hidden justify-center items-center absolute top-0   left-[-72px] h-full w-[72px] gap-2 cursor-pointer`} onClick={handleLeftArrowClick}>
                <div className={` px-3 "bg-[#111111] z-[1]"  rounded-full py-3 `} >

                    <motion.svg xmlns="http://www.w3.org/2000/svg" whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.01 }} className="outline-none" height="10px" width="10px" viewBox="0 0 34.075 34.075" >
                        <g>
                            <g>
                                <path className=" fill-white stroke-white" d="M24.57,34.075c-0.505,0-1.011-0.191-1.396-0.577L8.11,18.432c-0.771-0.771-0.771-2.019,0-2.79    L23.174,0.578c0.771-0.771,2.02-0.771,2.791,0s0.771,2.02,0,2.79l-13.67,13.669l13.67,13.669c0.771,0.771,0.771,2.021,0,2.792    C25.58,33.883,25.075,34.075,24.57,34.075z" />
                            </g>
                        </g>
                    </motion.svg>
                </div>

            </div>
            <motion.div
                ref={fullcarouselRef}
                drag="x"
                dragElastic={0.1}
                transition={{ type: "spring", stiffness: 100 }}
                dragConstraints={{ right: 0, left: -width }}
                className={wrapper}
            >
                {renderRows()}
            </motion.div>
            <div className={`mobile:flex hidden justify-center items-center absolute top-0 right-[-72px] h-full w-[72px] gap-2 cursor-pointer`} onClick={handleRightArrowClick}>
                <div className={` px-3   bg-border opacity-80 rounded-full py-3 `} >
                    <motion.svg xmlns="http://www.w3.org/2000/svg" height="10px" width="10px" className=" justify-center items-center outline-none" whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.01 }} viewBox="0 0 185.343 185.343">
                        <g>
                            <g>
                                <path className=" fill-white stroke-white" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175    l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934    c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
                            </g>
                        </g>
                    </motion.svg>
                </div>
            </div>
        </motion.div>
    );
}