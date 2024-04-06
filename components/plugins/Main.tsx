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
interface Props {
  ref: any;
  watchtext: any;
}
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
  const { watchtext, ...rest } = props;
  //HOT POTENTIAL TO BE FUNCTIONAL /!\ /!\ /!\
  // /!\ /!\
  const handleMentionTrigger = (event: React.KeyboardEvent<HTMLDivElement>) => {
    ref.current.update(() => {
    const selection = $createRangeSelection();
    console.log("test")
    if (!selection) {
      return;
    }
      const anchorNode = selection.anchor.getNode();
      const anchorOffset = selection.anchor.offset;
      const textContent = anchorNode.getTextContent();
      const searchStr = textContent.slice(0, anchorOffset).match(/\S+$/);
      if (!searchStr) {
        return;
      }

      const index = textContent.length - searchStr[0].length;

      // Créer une nouvelle sélection pour la mention
      const mentionSelection = $createRangeSelection();
      mentionSelection.anchor.key = anchorNode.getKey();
      mentionSelection.anchor.offset = index;
      mentionSelection.focus.key = anchorNode.getKey();
      mentionSelection.focus.offset = index + searchStr[0].length;

      // Créer un nouveau nœud de mention et le remplacer par le texte sélectionné
      const mentionNode = $createMentionNode(searchStr[0]);
      anchorNode.replace(mentionNode);

      const newSelection = new RangeSelection(mentionSelection.anchor, mentionSelection.anchor, 0, mentionNode.getTextContent());
      $setSelection(newSelection);
      ref.current.setSelection(mentionSelection);
    
  });
  };

  return (
    <LexicalComposer initialConfig={initialConfig} >
      <MentionsPlugin />
      <EditorCapturePlugin ref={ref} />
      <HistoryPlugin />
      <LinkPlugin />
      <HashtagPlugin />
      <PlainTextPlugin
        contentEditable={<ContentEditable onKeyUp={handleMentionTrigger} id="editable_content" spellCheck className=" outline-none text-[14px]" onKeyDown={watchtext} />}
        placeholder={<div className="absolute top-0 pointer-events-none text-[14px] !font-light opacity-50">Commencer un whisper...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
    </LexicalComposer>
  );
});



export function extractTypeAndText(json: Root): ExtractedData {
  const extractedData: ExtractedData = { mentions: [], texts: [] };

  const { children } = json.root;
  children.forEach((paragraph: any) => {
    if (paragraph.direction === null && paragraph.children.type !== 'mention') {
      extractedData.texts.push('\n');
    }
    paragraph.children.forEach((child: any) => {
      if (child.type === 'mention') {
        extractedData.mentions.push(child.text || 'N/A');
        extractedData.texts.push(child.text || 'N/A');
      } else if (child.type === 'text') {
        extractedData.texts.push(child.text || 'N/A');
      }
    });
  });

  return extractedData;
}