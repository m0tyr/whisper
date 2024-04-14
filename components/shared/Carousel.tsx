import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler, LegacyRef, Key, MutableRefObject } from "react";
import { motion, useAnimation, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import Image from "next/image";

interface ImageData {
    url: string;
    aspectRatio: string;
    width: string;
}

interface Props {
    DataArray: ImageData[];
    abortimage: (url: string) => void;
}

const Carousel = ({ DataArray, abortimage }: Props) => {
    const [width, setWidth] = useState(0)
    const carouselRef = useRef<HTMLDivElement>(null);
    const RTwidth = () => {
        if (carouselRef.current) {
            console.log(carouselRef.current.scrollWidth)
            console.log(carouselRef.current.offsetWidth)
            const newWidth = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth + 30;
            setWidth(newWidth > 0 ? newWidth : 0); // Ensure width is never negative
        }
    };
    useEffect(() => {
        const updateWidth = () => {
            if (carouselRef.current) {
                console.log(carouselRef.current.scrollTop)
                console.log(carouselRef.current.scrollWidth)
                console.log(carouselRef.current.offsetWidth)
                const newWidth = carouselRef.current.scrollWidth - carouselRef.current.offsetWidth + 30;
                setWidth(newWidth > 0 ? newWidth : 0); // Ensure width is never negative
            }
        };

        updateWidth();
        if(carouselRef.current)
        carouselRef.current.addEventListener('resize', updateWidth);
        return () => {
            if(carouselRef.current)
            carouselRef.current.removeEventListener('resize', updateWidth);
        };
    }, [DataArray,carouselRef.current]);
    return (
        <div className=" pr-[2.88rem]">
            <motion.div ref={carouselRef} className=" overflow-hidden mt-2 active:cursor-grabbing cursor-grab" whileTap={"grabbing"}>
                <motion.div
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    className="flex">
                    {DataArray.slice(0, 4).map(({ url, aspectRatio, width }: ImageData, index) => (
                        <div className="grid mr-2" style={{ aspectRatio: aspectRatio, height: '272px', width: `${parseInt(width) > 380 ? "380" : width}px` }}>
                            <div className="relative">
                                <picture className="select-none">
                                    <img
                                        draggable={false}
                                        src={url}
                                        className='w-full max-w-full object-cover box-border select-none absolute top-0 bottom-0 left-0 right-0 h-full rounded-lg border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                        alt={`Image ${index}`}
                                    />
                                </picture>
                                <div className="absolute top-2 right-2">
                                    <Image
                                        src="/svgs/close.svg"
                                        width={20}
                                        height={20}
                                        alt=""
                                        className="invert-0 bg-dark-4 bg-opacity-90 rounded-full cursor-pointer"
                                        onClick={(e) => abortimage(url)}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    )
}
export default Carousel;