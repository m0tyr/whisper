import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React, { useCallback } from "react";
import { useEffect } from "react";
import { $createMentionNode, MentionNode } from "./MentionsPlugin/MentionNode";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { LinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { HashtagNode } from '@lexical/hashtag';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin'
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';

import MentionsPlugin from "./MentionsPlugin";
import { $createRangeSelection, $getRoot, $getSelection, $setSelection, RangeSelection, TextNode } from "lexical";
import { InitMention } from "./InitMention";
import { ExtractedElement, Input, MentionsDatas, Root } from "@/lib/types/whisper.types";


export function extractElements(input: Input): ExtractedElement[] {
  const extractedElements: ExtractedElement[] = [];

  // Iterate over each paragraph
  input.root.children.forEach(paragraph => {
      // Iterate over each element in the paragraph
      paragraph.children.forEach(element => {
          // If it's a linebreak, set text to '\n'
          const text = element.type === 'linebreak' ? '\n' : element.text;
          
          if (text && element.type) {
              // Extract text and type
              const { type } = element;
              extractedElements.push({ text, type });
          }
      });
  });

  return extractedElements;
}

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


export const ContentPlayer = React.forwardRef((props: any, ref: any) => {
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
        contentEditable={<ContentEditable id="editable_content" spellCheck className=" outline-none text-[14px]" onKeyDown={watchtext} />}
        placeholder={<div className="absolute top-0 pointer-events-none text-[14px] !font-light opacity-50">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
});



export function extractMention(json: Root): MentionsDatas {
  const extractedData: MentionsDatas = { mentions: []};

  const { children } = json.root;
  children.forEach((paragraph: any) => {
    paragraph.children.forEach((child: any) => {
      if (child.type === 'mention') {
        extractedData.mentions.push(child.text || 'N/A');
      }
    });
  });

  return extractedData;
}