import { useWhisper } from "@/contexts/WhisperPostContext";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";

const usePostMedia = (isInReplyContext: any, reply_ref_medias: DBImageData[], reply_ref_content: ExtractedElement[]) => {
  let medias = [];
  let content = [];
  let ping: (e: React.MouseEvent) => void = () => {};
  let isReply: boolean = false;
  if (isInReplyContext) {
    medias = reply_ref_medias || [];
    content = reply_ref_content || [];
    isReply = true;
  } else {
    const { medias: whisperMedias, content: whisperContent, ping: whisperPing } = useWhisper();
    medias = whisperMedias;
    content = whisperContent;
    ping = whisperPing;
  }

  return { medias, content, ping, isReply };
};

export default usePostMedia;
