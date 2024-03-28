import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import React from "react";
import { useEffect } from "react";
import { MentionNode } from "./MentionsPlugin/MentionNode";
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import MentionsPlugin from "./MentionsPlugin";
interface Props {
    ref: any;
    watchtext : any;
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
      MentionNode
    ]
  };
  export const ContentPlayer = React.forwardRef((props: any, ref: any) => {
    const { watchtext, ...rest } = props;
    return (
        <LexicalComposer initialConfig={initialConfig} >
        <MentionsPlugin />
        <EditorCapturePlugin ref={ref} />
        <RichTextPlugin
          contentEditable={<ContentEditable  id="editable_content" spellCheck className=" outline-none text-[14px]" onKeyDown={watchtext} />}
          placeholder={<div className="absolute top-0 pointer-events-none text-[14px] !font-light opacity-50">Commencer un whisper...</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />
      </LexicalComposer>
    );
  });


  interface Child {
    type: string;
    text?: string;
}

interface Paragraph {
    children: Child[];
}

interface Root {
    root: { children: any; };
    children: Paragraph[];
}
interface ExtractedData {
    mentions: string[];
    texts: string[];
}

export function extractTypeAndText(json: Root): ExtractedData {
    const extractedData: ExtractedData = { mentions: [], texts: [] };

    const { children } = json.root;
    children.forEach((paragraph : any) => {
        paragraph.children.forEach((child : any) => {
            if (child.type === 'mention') {
                extractedData.mentions.push(child.text || 'N/A');
            } else if (child.type === 'text') {
                extractedData.texts.push(child.text || 'N/A');
            }
        });
    });

    return extractedData;
}