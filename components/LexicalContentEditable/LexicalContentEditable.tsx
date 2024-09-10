import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";
import { useEffect } from "react";
import { MentionNode } from "@/components/LexicalContentEditable/MentionsPlugin/MentionNode";
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
import { MentionsPlugin } from "@/components/LexicalContentEditable/MentionsPlugin";



const EditorCapturePlugin = React.forwardRef((props: any, ref: any) => {
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
const urlRegExp = new RegExp(
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/,
);

export function validateUrl(url: string): boolean {
  return url === 'https://' || urlRegExp.test(url);
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
    HashtagNode
  ]
};

 const LexicalContentEditable = React.forwardRef((props: any, ref: any) => {
  const { watchtext, placeholder, style } = props;

  const onChange = () => {
  }
  window.onload = function() {
      document?.getElementById("editable_content")?.focus();
};

  return (
    <LexicalComposer initialConfig={initialConfig} >
      <MentionsPlugin/>
      <EditorCapturePlugin ref={ref} />
      <HistoryPlugin />
      <LinkPlugin validateUrl={validateUrl} />
      <HashtagPlugin />
  <OnChangePlugin onChange={onChange} />
      <PlainTextPlugin
        contentEditable={<ContentEditable id="editable_content" spellCheck style={style} className=" outline-none text-[15px]" onKeyDown={watchtext} autoFocus/>}
        placeholder={<div className="absolute top-0 pointer-events-none text-[15px] !font-light opacity-50">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
});
 
export default LexicalContentEditable


