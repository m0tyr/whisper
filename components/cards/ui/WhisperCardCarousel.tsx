'use client'
import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler, LegacyRef, Key, MutableRefObject } from "react";
import { AnimatePresence, motion, useAnimation, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { DBImageData } from "@/lib/types/whisper.types";
import { CAROUSEL_DIRECTION_VALUE } from "@/lib/css/motion";
import { randomBytes } from "crypto";
import { deriveMultipleMediaHeight } from "@/lib/utils";

interface Props {
    DataArray: DBImageData[];
    srcprovider: any;
    widthprovider: any;
    typeprovider: any;
    arprovider: any;
    setShowImage: any;
    showImage: boolean;
    isReply: boolean;
}

const WhisperCardCarousel = ({ DataArray, widthprovider, srcprovider, typeprovider, arprovider, setShowImage, showImage, isReply }: Props) => {
    const id: string = randomBytes(10).toString('hex');
    const [width, setWidth] = useState(0)
    const [
        Audiostate, toggleAudio] = useState<boolean>(false)
    let currentGlobalHeight: number = 0;
    const tempfirstAttachmentAspectRatio = parseFloat(DataArray[0].aspectRatio)
    const tempsecondAttachmentAspectRatio = parseFloat(DataArray[1].aspectRatio)
    currentGlobalHeight = deriveMultipleMediaHeight(
        tempfirstAttachmentAspectRatio,
        tempsecondAttachmentAspectRatio
    );

    const togglePopup = (src: string, ar: string, isVideo: boolean, width: string) => {
        if (!isReply) {
            setShowImage(!showImage);
            srcprovider(src)
            typeprovider(isVideo)
            arprovider(ar)
            widthprovider(width)
        }
    };
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
    };

    return (
        <AnimatePresence>
            <motion.div ref={carouselRef} className=" overflow-hidden mt-2 active:cursor-grabbing cursor-grab" whileTap={"grabbing"}>
                <div className={` mobile:flex hidden justify-center items-center absolute top-0 ${isReply ? "left-[-20px]" : "left-[-72px]"} h-full w-[72px] gap-2 cursor-pointer`} onClick={handleLeftArrowClick}>
                    <div className={` px-3 ${isReply ? "bg-[#111111] z-[1]" : "bg-border opacity-80"} rounded-full py-3 `} >

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
                        key={id}
                        ref={fullcarouselRef}
                        /* resize problem causing re render of dom tryna c a alternative later  */
                        drag="x"
                        dragElastic={0.1}
                        style={{ scrollBehavior: 'smooth' }}
                        transition={{ type: "spring", stiffness: 100 }}
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex flex-row translate-x-0"
                    >
                        <div className="w-[48px] flex-shrink-0 cursor-grab active:cursor-grabbing"></div>
                        {DataArray.map(({ s3url, aspectRatio, width, height, isVideo }: DBImageData, index) => (
                            <div /* TODO make the width directly the value of Math.floor to not have a werid deform when loading */ key={index} className="grid mr-2" style={{ aspectRatio: aspectRatio, height: currentGlobalHeight, width: `${Math.floor(currentGlobalHeight * parseFloat(aspectRatio))}px` }}> 
                                <div className="relative">
                                    {isVideo ? (
                                        <div className="z-0 relative w-full h-full select-none">
                                            <video
                                                loop
                                                autoPlay
                                                playsInline
                                                src={s3url}
                                                className='w-full h-full rounded-lg '
                                                muted={!Audiostate}
                                                onClick={() => {
                                                    if (s3url)
                                                        togglePopup(s3url, aspectRatio, isVideo, width)
                                                }}
                                            />
                                            <div className="absolute bottom-0 right-0  select-none">
                                                <div className=" px-3 py-3 rounded-lg bg-transparent ">
                                                    <div className="flex bg-[rgb(30,30,30)] px-2 py-2  rounded-full justify-center items-center" onClick={() => toggleAudio(!Audiostate)}>
                                                        {!Audiostate ? (
                                                            <svg aria-label="Le son est coupé" role="img" className="stroke-white fill-white" viewBox="0 0 48 48" width={12} height={12}>
                                                                <title>Le son est coupé</title>
                                                                <path d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z">
                                                                </path>
                                                            </svg>
                                                        ) : (
                                                            <svg aria-label="L’audio est en cours de lecture" role="img" className="stroke-white fill-white" width={12} height={12} viewBox="0 0 24 24" >
                                                                <title>L’audio est en cours de lecture</title>
                                                                <path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z">
                                                                </path>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.01 }} className="flex select-none h-full list-none text-inherit" style={{ width: width }}>
                                            <picture className=" w-full h-full select-none">
                                                <img
                                                    onClickCapture={undefined}
                                                    draggable="false"
                                                    src={s3url}
                                                    className='w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full rounded-lg border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                                    onClick={() => {
                                                        if (s3url)
                                                            togglePopup(s3url, aspectRatio, isVideo, width)
                                                    }}
                                                />
                                            </picture>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                <div className={`mobile:flex hidden justify-center items-center absolute top-0 ${isReply ? "right-[-20px]" : "right-[-72px]"} h-full w-[72px] gap-2 cursor-pointer`} onClick={handleRightArrowClick}>
                    <div className={` px-3 ${isReply ? "bg-[#111111]" : "bg-border opacity-80"} rounded-full py-3 `} >
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
        </AnimatePresence>
    )
}
export default WhisperCardCarousel;