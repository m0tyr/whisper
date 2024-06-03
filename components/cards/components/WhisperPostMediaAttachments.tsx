import { useWhisper } from "@/contexts/WhisperPostContext";
import WhisperCardMedia from "../ui/WhisperCardMedia";
import usePostMedia from "@/hooks/usePostMedia";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";

interface Props {
    ViewportProvider: string;
    isMainView: boolean;
    isInReplyContext: boolean;
    reply_ref_medias?: DBImageData[];
    reply_ref_content?: ExtractedElement[];
}

const WhisperPostMediaAttachments = ({ ViewportProvider, isInReplyContext,isMainView, reply_ref_medias, reply_ref_content }: Props) => {
    const { medias, content, ping, isReply } = usePostMedia(isInReplyContext, reply_ref_medias as DBImageData[], reply_ref_content as ExtractedElement[]);
    const getClassNames = () => {
        if (ViewportProvider === "parent") {
            return `relative ${medias.length > 2 ? 'w-[calc(100%_+_48px_+_2_*_25px)] ml-[calc(-1_*_(48px_+_25px))]' : ''} bottom-1 ${content && content.length === 0 ? "pt-1" : ""}`;
        } else if (ViewportProvider === "direct") {
            return `relative ${medias.length > 2 ? `w-[calc(100%_+_48px_+_2_*_1px)] ${isReply ? '' : 'ml-[calc(-1_*_(48px_-_22px))]'}` : ''} bottom-1 ${content && content.length === 0 ? "pt-1" : ""}`;
        } else if (ViewportProvider == "reply_modal") {
            return `relative ${medias.length > 2 ? 'w-[calc(100%_+_48px_+_2_*_10.5px)]' : ''} bottom-1 ${content && content.length === 0 ? "pt-1" : ""}`;
        } else {
            return `relative ${medias.length > 2 ? 'w-[calc(100%_+_48px_+_2_*_18.5px)] ml-[calc(-1_*_(48px_+_18.5px))]' : ''} bottom-1 ${content && content.length === 0 ? "pt-1" : ""}`;
        }
    };

    const classNames = getClassNames();

    return (
        <div className={classNames} onClick={(e) => ping(e)}>
            <WhisperCardMedia medias={medias} isReply={isReply} isMainView={isMainView} />
        </div>
    );
}

export default WhisperPostMediaAttachments;