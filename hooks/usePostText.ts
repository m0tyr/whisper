import { useWhisper } from "@/contexts/WhisperPostContext";
import { ExtractedElement } from "@/lib/types/whisper.types";
import { processElements } from "@/lib/utils";

const usePostText = (isInReplyContext: any, reply_ref_content: ExtractedElement[]) => {
  let PostTextObject = [];
  let PostTextComputedObject = [];

  if (isInReplyContext) {
    PostTextObject = reply_ref_content || [];
  } else {
    const { content } = useWhisper();
    PostTextObject = content;
  }

  PostTextComputedObject = processElements(PostTextObject);

  return { PostTextObject, PostTextComputedObject };
};

export default usePostText;
