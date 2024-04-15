import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler, LegacyRef, Key, MutableRefObject } from "react";
import { motion, useAnimation, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import Image from "next/image";
import { DBImageData } from "@/lib/types/whisper.types";

interface Props {
    DataArray: DBImageData[];
    srcprovider: any;
    typeprovider: any;
    arprovider: any;
    setShowImage: any;
    showImage: boolean;
}

const WhisperCardCarousel = ({ DataArray, srcprovider, typeprovider, arprovider, setShowImage, showImage }: Props) => {
    const [width, setWidth] = useState(0)
    const [Audiostate, toggleAudio] = useState<boolean>(false)
    const togglePopup = (src: string, ar: string, isVideo: boolean) => {
        setShowImage(!showImage);
        srcprovider(src)
        typeprovider(ar)
        arprovider(isVideo)
    };

    const carouselRef = useRef<HTMLDivElement>(null);
    const fullcarouselRef = useRef<HTMLDivElement>(null);
    let height = "272px";
    for (let index = 0; index < DataArray.length; index++) {
        if (DataArray[index].isVideo) {
            height = "272px"; //need to see for scaling aspectratio
        }
    }
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
        <motion.div ref={carouselRef} className=" overflow-hidden mt-2 active:cursor-grabbing cursor-grab" whileTap={"grabbing"}>
            <motion.div
                ref={fullcarouselRef}
                drag="x"
                dragElastic={0.1}
                transition={{ type: "spring", stiffness: 100 }}
                dragConstraints={{ right: 0, left: -width }}
                className="flex flex-row ">
                <div className="w-[48px] flex-shrink-0 cursor-grab active:cursor-grabbing">

                </div>
                {DataArray.map(({ s3url, aspectRatio, width, isVideo }: DBImageData, index) => (
                    <div className="grid mr-2" style={{ aspectRatio: aspectRatio, height: height, width: `${parseInt(width) > 380 ? "380" : width}px` }}>
                        <div className="relative">
                            {isVideo ? ( // Check if it's a video
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
                                                togglePopup(s3url, aspectRatio, isVideo)
                                        }}

                                    />
                                    <div className="absolute bottom-0 right-0  select-none">
                                        <div className=" px-3 py-3 rounded-lg bg-transparent ">
                                            <div className="flex bg-[rgb(30,30,30)] px-2 py-2  rounded-full justify-center items-center" onClick={() => toggleAudio(!Audiostate)}>
                                                {!Audiostate ? (
                                                    <svg aria-label="Le son est coupé" role="img" className="stroke-white fill-white" viewBox="0 0 48 48" width={12} height={12}>
                                                        <title>Le son est coupé</title>
                                                        <path d="M1.5 13.3c-.8 0-1.5.7-1.5 1.5v18.4c0 .8.7 1.5 1.5 1.5h8.7l12.9 12.9c.9.9 2.5.3 2.5-1v-9.8c0-.4-.2-.8-.4-1.1l-22-22c-.3-.3-.7-.4-1.1-.4h-.6zm46.8 31.4-5.5-5.5C44.9 36.6 48 31.4 48 24c0-11.4-7.2-17.4-7.2-17.4-.6-.6-1.6-.6-2.2 0L37.2 8c-.6.6-.6 1.6 0 2.2 0 0 5.7 5 5.7 13.8 0 5.4-2.1 9.3-3.8 11.6L35.5 32c1.1-1.7 2.3-4.4 2.3-8 0-6.8-4.1-10.3-4.1-10.3-.6-.6-1.6-.6-2.2 0l-1.4 1.4c-.6.6-.6 1.6 0 2.2 0 0 2.6 2 2.6 6.7 0 1.8-.4 3.2-.9 4.3L25.5 22V1.4c0-1.3-1.6-1.9-2.5-1L13.5 10 3.3-.3c-.6-.6-1.5-.6-2.1 0L-.2 1.1c-.6.6-.6 1.5 0 2.1L4 7.6l26.8 26.8 13.9 13.9c.6.6 1.5.6 2.1 0l1.4-1.4c.7-.6.7-1.6.1-2.2z">
                                                        </path></svg>
                                                ) : (
                                                    <svg aria-label="L’audio est en cours de lecture" role="img" className="stroke-white fill-white" width={12} height={12} viewBox="0 0 24 24" >
                                                        <title>L’audio est en cours de lecture</title>
                                                        <path d="M16.636 7.028a1.5 1.5 0 1 0-2.395 1.807 5.365 5.365 0 0 1 1.103 3.17 5.378 5.378 0 0 1-1.105 3.176 1.5 1.5 0 1 0 2.395 1.806 8.396 8.396 0 0 0 1.71-4.981 8.39 8.39 0 0 0-1.708-4.978Zm3.73-2.332A1.5 1.5 0 1 0 18.04 6.59 8.823 8.823 0 0 1 20 12.007a8.798 8.798 0 0 1-1.96 5.415 1.5 1.5 0 0 0 2.326 1.894 11.672 11.672 0 0 0 2.635-7.31 11.682 11.682 0 0 0-2.635-7.31Zm-8.963-3.613a1.001 1.001 0 0 0-1.082.187L5.265 6H2a1 1 0 0 0-1 1v10.003a1 1 0 0 0 1 1h3.265l5.01 4.682.02.021a1 1 0 0 0 1.704-.814L12.005 2a1 1 0 0 0-.602-.917Z">
                                                        </path></svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ) : (
                                <div className="flex select-none h-full list-none text-inherit" style={ {
                                    width : width
                                }}>
                                    <picture className="select-none">
                                        <img
                                            draggable="false"
                                            src={s3url}
                                            className='w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full rounded-lg border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                            onClick={() => {
                                                if (s3url)
                                                    togglePopup(s3url, aspectRatio, isVideo)
                                            }}
                                        />
                                    </picture>
                                </div>
                            )}

                        </div>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    )
}
export default WhisperCardCarousel;