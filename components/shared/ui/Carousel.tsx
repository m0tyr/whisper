import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler, LegacyRef, Key, MutableRefObject } from "react";
import { motion, useAnimation, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import Image from "next/image";
import { PrevImageData } from "@/lib/types/whisper.types";
import { deriveMultipleMediaHeight, getClampedMultipleMediaAspectRatio } from "@/lib/utils";

interface Props {
    DataArray: PrevImageData[];
    abortimage: (url: string) => void;
}

const Carousel = ({ DataArray, abortimage }: Props) => {
    const [width, setWidth] = useState(0)

    let currentGlobalHeight: number = 0;
    const tempfirstAttachmentAspectRatio = parseFloat(DataArray[0].aspectRatio)
    const tempsecondAttachmentAspectRatio = parseFloat(DataArray[1].aspectRatio)
    currentGlobalHeight = deriveMultipleMediaHeight(
        tempfirstAttachmentAspectRatio,
        tempsecondAttachmentAspectRatio
    );

    const carouselRef = useRef<HTMLDivElement>(null);
    const fullcarouselRef = useRef<HTMLDivElement>(null);

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
    }, [DataArray]);
    return (
        <div className=" pr-[2.88rem]">
            <motion.div ref={carouselRef} className=" overflow-hidden mt-2 active:cursor-grabbing cursor-grab" whileTap={"grabbing"}>
                <motion.div
                    ref={fullcarouselRef}
                    drag="x"
                    dragElastic={0.1}
                    transition={{ type: "spring", stiffness: 100 }}
                    dragConstraints={{ right: 0, left: -width }}
                    className="flex"
                    onDrag={(event) => {
                        event.stopPropagation()
                    }}
                    >
                    {DataArray.map(({ url, aspectRatio, width, isVideo }: PrevImageData, index) => (
                        <div className="grid mr-2" style={{ aspectRatio: aspectRatio, height: `${currentGlobalHeight}px`, width: `${Math.floor(currentGlobalHeight * parseFloat(aspectRatio))}px` }}>
                            <div className="relative">
                                {isVideo ? ( // Check if it's a video
                                    <div className="z-0 relative w-full h-full">
                                        <video
                                            loop
                                            autoPlay
                                            playsInline
                                            src={url}
                                            className='w-full h-full '
                                            muted

                                        />
                                    </div>
                                ) : (
                                    <picture>
                                        <img
                                            draggable="false"
                                            src={url}
                                            className='w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full rounded-lg border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                            alt={`Image 0`}
                                        />
                                    </picture>
                                )}
                                <div className="absolute top-2 right-2 px-1 py-1">
                                    <div className="px-[13px] py-[13px] bg-[rgba(0,0,0,0.4)] backdrop-blur-lg rounded-full absolute bottom-[1px] left-[1px] ">
                                    </div>
                                    <Image
                                        src="/svgs/close.svg"
                                        width={20}
                                        height={20}
                                        alt=""
                                        className="invert-0  bg-opacity-90 rounded-full cursor-pointer"
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