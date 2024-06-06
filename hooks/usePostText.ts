import { useWhisper } from "@/contexts/WhisperPostContext";
import { ExtractedElement } from "@/lib/types/whisper.types";
import { processElements } from "@/lib/utils";

const usePostText = (isInReplyContext: any, reply_ref_content: ExtractedElement[]) => {
  let PostTextObject = [];
  let PostTextComputedObject = [];
  let PostTextping: any;

  if (isInReplyContext) {
    PostTextObject = reply_ref_content || [];
  } else {
    const { content, ping } = useWhisper();
    PostTextObject = content;
    PostTextping = ping;
  }

  PostTextComputedObject = processElements(PostTextObject);

  return { PostTextObject, PostTextComputedObject, PostTextping };
};

export default usePostText;
