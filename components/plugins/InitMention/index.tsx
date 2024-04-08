import {$createTextNode, $insertNodes, type TextNode} from 'lexical';


import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalTextEntity} from '@lexical/react/useLexicalTextEntity';
import {useCallback, useEffect} from 'react';
import { $createMentionNode, $mentionNodeAuto, MentionNode } from '../MentionsPlugin/MentionNode';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['@'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  '(?! )' + // Disallow additional space
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
  '[' +
  TRIGGERS +
  ']' +
  '((?:' +
  VALID_CHARS +
  VALID_JOINS +
  '){0,' +
  LENGTH_LIMIT +
  '})' +
  ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
  '[' +
  TRIGGERS +
  ']' +
  '((?:' +
  VALID_CHARS +
  '){0,' +
  ALIAS_LENGTH_LIMIT +
  '})' +
  ')$',
);

export function InitMention() {
    const [editor] = useLexicalComposerContext();
  
    useEffect(() => {
      if (!editor.hasNodes([MentionNode])) {
        throw new Error('InitMention: MentionNode not registered on editor');
      }
    }, [editor]);
  
    const createMentionNode = useCallback((textNode: TextNode): MentionNode => {
      return $mentionNodeAuto(textNode.getTextContent());
    }, []);
  
    const getMentionMatch = useCallback((text: string) => {
    const REGEX = new RegExp(AtSignMentionsRegexAliasRegex, 'i');
      let matchArr = REGEX.exec(text);
  
      if (matchArr === null) {
        console.log("in")
        return null;
    }

      const mentionLength = matchArr[3].length + 1;
      const startOffset = matchArr.index + matchArr[1].length;
      const endOffset = startOffset + mentionLength;
      if (matchArr !== null) {
        // The strategy ignores leading whitespace but we need to know it's
        // length to add it to the leadOffset
        const maybeLeadingWhitespace = matchArr[1];
    
        const matchingString = matchArr[3];
        if (matchingString.length >= 1) {
            return {
                end: endOffset + maybeLeadingWhitespace.length,
                start: startOffset,
              };
        }
      }
      return null;    
    }, []);
  
    useLexicalTextEntity<MentionNode>(
      getMentionMatch,
      MentionNode,
      createMentionNode,
    );
  
    return null;
  }