import Carousel from "@/components/Carousel/Carousel";
import { PrevImageData } from "@/lib/types/whisper.types";
import { deriveMultipleMediaHeight, getClampedMultipleMediaAspectRatio } from "@/lib/utils";
import Image from "next/image";

interface Props {
    medias: PrevImageData[];
    abortimage: (url: string) => void;
}
const MediaAttachments = ({ medias, abortimage }: Props) => {

    return (
        <>
            {medias.length === 1 && (
                <div className="pt-3">
                    <div className="max-h-[430px] my-1 grid-rows-1 grid-cols-1 grid">
                        <div style={{ aspectRatio: `${parseFloat(medias[0].width) / parseFloat(medias[0].height)}`, maxHeight: "430px" }}>
                            <div className="block relative h-full">
                                {medias[0].isVideo ? ( // Check if it's a video
                                    <div className="z-0 relative w-full h-full">
                                        <video
                                            loop
                                            autoPlay
                                            playsInline
                                            src={medias[0].url}
                                            className='w-full h-full '
                                            muted
                                        />
                                    </div>

                                ) : (
                                    <picture>
                                        <img
                                            draggable="false"
                                            src={medias[0].url}
                                            className='w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full rounded-lg border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
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
                                        onClick={(e) => abortimage(medias[0].url)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            )}
            {medias.length === 2 && (
                <div className="pt-3">
                    {(() => {
                        const tempfirstAttachmentAspectRatio = parseFloat(medias[0].aspectRatio)
                        const tempsecondAttachmentAspectRatio = parseFloat(medias[1].aspectRatio)
                        let aspectRatio;
                        aspectRatio = (tempfirstAttachmentAspectRatio + tempsecondAttachmentAspectRatio).toString();


                        return (
                            <div className="grid grid-rows-[100%] gap-[6px]" style={{
                                aspectRatio: aspectRatio,
                                gridTemplateColumns: `minmax(0, ${Math.floor(tempfirstAttachmentAspectRatio * 100)}fr) minmax(0, ${Math.floor(tempsecondAttachmentAspectRatio * 100)}fr)`
                            }}>
                                {medias.map(({ url, isVideo }, index) => (
                                    <div className="block relative h-full" key={index}>
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
                                ))}
                            </div>
                        );
                    })()}
                </div>
            )}
            {medias.length > 2 && (
                <Carousel DataArray={medias} abortimage={abortimage} />
            )}

        </>
    )
}
export default MediaAttachments