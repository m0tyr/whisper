import { useWhisper } from "@/contexts/WhisperPostContext"
import WhisperCardMedia from "../ui/WhisperCardMedia"
import usePostMedia from "@/hooks/usePostMedia";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";

interface Props {
    isInReplyContext: boolean;
    reply_ref_medias?: DBImageData[];
    reply_ref_content?: ExtractedElement[];
  }
  
  const WhisperPostMediaAttachments = ({ isInReplyContext, reply_ref_medias, reply_ref_content }: Props) => {
    const { medias, content, ping, isReply } = usePostMedia(isInReplyContext, reply_ref_medias as DBImageData[], reply_ref_content as ExtractedElement[]);
    return (
        <>
            {medias.length <= 2 ? (
                <div className={`relative w-full bottom-1 ${content && content.length !== 0 ? "" : "mt-5"} `} onClick={(e) => {
                    ping(e)
                }}>
                    <WhisperCardMedia medias={medias} isReply={isReply} isMainView={true} />
                </div>
            ) : (
                <div className={`relative w-[calc(100%_+_48px_+_2_*_1px)] ${isReply ? '' : 'ml-[calc(-1_*_(48px_-_22px))]'}  bottom-1 ${content && content.length === 0 ? "pt-1" : ""}`} onClick={(e) => {
                    ping(e)
                }}>
                    <WhisperCardMedia medias={medias} isReply={isReply} isMainView={true} />
                </div>
            )}
        </>
    )
}

export default WhisperPostMediaAttachments