'use client'
import Carousel from "@/components/shared/ui/Carousel";
import { DBImageData } from "@/lib/types/whisper.types";
import Image from "next/image";
import WhisperPostCarousel from "./WhisperPostCarousel";
import ShowImage from "@/components/shared/ShowImage";
import { useState } from "react";
import { motion } from "framer-motion";
import { useWhisper } from "@/contexts/WhisperPostContext";

interface Props {
    medias: DBImageData[];
    isReply: boolean;
    isMainView: boolean;
    ViewportProvider: string;
}
const WhisperPostMedia = () => {
    const { medias, isInReplyContext } = useWhisper()
    const [showImage, setShowImage] = useState(false);
    const [targetImage, settargetImage] = useState<string | undefined>("")
    const [targetAR, settargetAR] = useState<string | undefined>("")
    const [targetWidth, settargetWidth] = useState<string | undefined>("")
    const [targetType, settargetType] = useState<boolean>(false)
    const [Audiostate, toggleAudio] = useState<boolean>(false)
    const togglePopup = (src: string, ar: string, isVideo: boolean, width: string) => {
        if (!isInReplyContext ) {
            setShowImage(!showImage);
            settargetImage(src)
            settargetAR(ar)
            settargetType(isVideo)
            settargetWidth(width)
        }

    };
    const { isOnlyMediaPost } = useWhisper()
    return (
        <>
            {medias.length === 1 && (
                <div className={`max-h-[430px] ${isOnlyMediaPost ? 'pt-[0.425rem]' :  'pt-1.5'} my-2 grid-rows-1 grid-cols-1 grid`}>
                    <div style={{ aspectRatio: `${parseFloat(medias[0].width) / parseFloat(medias[0].height)}`, maxHeight: "430px" }}>
                        <div className="block relative h-full">
                            {medias[0].isVideo ? (
                                <div className="z-0 relative w-full h-full">
                                    <video
                                        loop
                                        autoPlay
                                        playsInline
                                        src={medias[0].s3url}
                                        className='w-full h-full rounded-lg '
                                        muted={!Audiostate}
                                        onClick={() => {
                                            if (medias[0].s3url)
                                                togglePopup(medias[0].s3url, medias[0].aspectRatio, medias[0].isVideo, medias[0].width)
                                        }}
                                    />
                                    <div className="absolute bottom-0 right-0">
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
                                <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.01 }} className="flex select-none h-full list-none text-inherit" style={{ width:  medias[0].width }}>
                                <picture>
                                    <img
                                        draggable="false"
                                        src={medias[0].s3url}
                                        className=' select-none w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full rounded-lg border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                        onClick={() => {
                                            if (medias[0].s3url)
                                                togglePopup(medias[0].s3url, medias[0].aspectRatio, medias[0].isVideo, medias[0].width)
                                        }}
                                    />
                                </picture>
                                </motion.div>
                            )}

                        </div>
                    </div>
                </div>
            )}
            {medias.length === 2 && (
                <div className={` ${isOnlyMediaPost ? 'pt-[0.975rem]' :  'pt-1.5'}`}>
                    {(() => {
                        const tempfirstAttachmentAspectRatio = parseFloat(medias[0].aspectRatio)
                        const tempsecondAttachmentAspectRatio = parseFloat(medias[1].aspectRatio)
                        let aspectRatio;
                        aspectRatio = (tempfirstAttachmentAspectRatio + tempsecondAttachmentAspectRatio).toString();


                        return (
                            <div className="grid grid-rows-[100%] max-h-[430px]  gap-[6px]" style={{
                                aspectRatio: aspectRatio,
                                gridTemplateColumns: `minmax(0, ${Math.floor(tempfirstAttachmentAspectRatio * 100)}fr) minmax(0, ${Math.floor(tempsecondAttachmentAspectRatio * 100)}fr)`
                            }}>
                                {medias.map(({ s3url, aspectRatio, isVideo, width }, index) => (
                                    <div className="block relative max-h-[430px] " key={index}>
                                        {isVideo ? ( // Check if it's a video
                                            <div className="z-0 relative w-full h-full">
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
                                                <div className="absolute bottom-0 right-0">
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
                                            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.01 }} className="flex select-none h-full list-none text-inherit" style={{ width: width }}>
                                            <picture>
                                                <img
                                                    draggable="false"
                                                    src={s3url}
                                                    className=' select-none w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full rounded-lg border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                                    onClick={() => {
                                                        if (s3url)
                                                            togglePopup(s3url, aspectRatio, isVideo, width)
                                                    }}
                                                />
                                            </picture>
                                            </motion.div>
                                        )}

                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </div>
            )}
            {medias.length > 2 && (
                <WhisperPostCarousel DataArray={medias} widthprovider={settargetWidth} 
                srcprovider={settargetImage} typeprovider={settargetType} arprovider={settargetAR} setShowImage={setShowImage} 
                showImage={showImage} />
            )}
            {showImage && (
                <ShowImage width={targetWidth} src={targetImage} ar={targetAR} togglePopup={togglePopup} isVideo={targetType} />
            )}
        </>
    )
}
export default WhisperPostMedia