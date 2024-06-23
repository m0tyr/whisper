import { useWhisper } from "@/contexts/WhisperPostContext";
import usePostMedia from "@/hooks/usePostMedia";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";
import WhisperPostMedia from "./WhisperPostMedia";


const WhisperPostMediaAttachments = () => {
    const { medias, content, ping, isInReplyContext,ViewportIndicator } = useWhisper();
    const getClassNames = () => {
        if (ViewportIndicator === "parent") {
            return `relative ${medias.length > 2 ? 'w-[calc(100%_+_48px_+_2_*_25px)] ml-[calc(-1_*_(48px_+_25px))]' : ''} bottom-1 ${content && content.length === 0 ? "pt-[0.015rem]" : ""}`;
        } else if (ViewportIndicator === "direct") {
            return `relative ${medias.length > 2 ? `w-[calc(100%_+_48px_+_2_*_1px)] ${isInReplyContext ? '' : 'ml-[calc(-1_*_(48px_-_22px))]'}` : ''} bottom-1 ${content && content.length === 0 ? "pt-[0.015rem]" : ""}`;
        } else if (ViewportIndicator == "reply_modal") {
            return `relative ${medias.length > 2 ? 'w-[calc(100%_+_48px_+_2_*_10.5px)]' : ''} bottom-1 ${content && content.length === 0 ? "pt-[0.015rem]" : ""}`;
        } else if (ViewportIndicator == "default") {
            return `relative ${medias.length > 2 ? 'w-[calc(100%_+_48px_+_2_*_18.5px)] ml-[calc(-1_*_(48px_+_18.5px))]' : ''} bottom-1 ${content && content.length === 0 ? "pt-[0.25rem]" : ""}`;
        }
    };

    const classNames = getClassNames();

    return (
        <div className={classNames} onClick={(e) => ping(e)}>
            <WhisperPostMedia />
        </div>
    );
}

export default WhisperPostMediaAttachments;