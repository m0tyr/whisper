import { useWhisper } from "@/contexts/WhisperPostContext"
import WhisperCardMedia from "../ui/WhisperCardMedia"

const WhisperPostMediaAttachments = () => {
    const { medias, content, ping } = useWhisper()
    return (
        <>
            {medias && medias.length <= 2 ? (
                <div className={`relative w-full bottom-1 ${content && content.length !== 0 ? "" : "mt-5"} `} onClick={(e) => {
                    ping(e)
                }}>
                    <WhisperCardMedia medias={medias} isReply={false} isMainView={true} />
                </div>
            ) : (
                <div className={`relative w-[calc(100%_+_48px_+_2_*_1px)] ml-[calc(-1_*_(48px_-_22px))] bottom-1 ${content && content.length === 0 ? "pt-1" : ""}`} onClick={(e) => {
                    ping(e)
                }}>
                    <WhisperCardMedia medias={medias} isReply={false} isMainView={true} />
                </div>
            )}
        </>
    )
}

export default WhisperPostMediaAttachments