import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";
import { useEffect } from "react";
import { MentionNode } from "@/components/plugins/MentionsPlugin/MentionNode";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { HashtagNode } from '@lexical/hashtag';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { MentionsPlugin } from "@/components/plugins/MentionsPlugin";



export const EditorCapturePlugin = React.forwardRef((props: any, ref: any) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    ref.current = editor;
    return () => {
      ref.current = null;
    };
  }, [editor, ref]);

  return null;
});

const theme = {

}
function onError(error: any) {
  console.error(error);
}
const initialConfig = {
  namespace: 'MyEditor',
  theme,
  onError,
  nodes: [
    MentionNode,
    LinkNode,
    HashtagNode,
  ]
};

 const ContentPlayer = React.forwardRef((props: any, ref: any) => {
  const { watchtext, placeholder } = props;
  const onChange = () => {
  }
  return (
    <LexicalComposer initialConfig={initialConfig} >
      <MentionsPlugin/>
      <EditorCapturePlugin ref={ref} />
      <HistoryPlugin />
      <LinkPlugin />
      <HashtagPlugin />
  <OnChangePlugin onChange={onChange} />
      <PlainTextPlugin
        contentEditable={<ContentEditable id="editable_content" spellCheck className=" outline-none text-[14.75px]" onKeyDown={watchtext} />}
        placeholder={<div className="absolute top-0 pointer-events-none text-[14.75px] !font-light opacity-50">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
});
 
export default ContentPlayer


