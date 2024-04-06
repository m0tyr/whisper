/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {LexicalEditor, Spread} from 'lexical';

import {
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  $applyNodeReplacement,
  TextNode,
  $getNodeByKey,
  $isTextNode,
} from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
  },
  SerializedTextNode
>;


function convertMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createMentionNode(textContent);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = "color: #1da1f2;";
export class MentionNode extends TextNode {
  getStart() {
    throw new Error('Method not implemented.');
  }
  __mention: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(serializedNode.mentionName);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mentionName: string, text?: string, key?: NodeKey) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    return dom;
  }
  setMention(mention: string): void {
    const writable = this.getWritable();
    writable.__mention = mention;
  }
  onMentionChange = (newName: string, editor: LexicalEditor) => {
    editor.update(() => {
      const node = $getNodeByKey(this.getKey()) as MentionNode;
      if (node !== null && $isMentionNode(node)) {
        node.setMention(newName);
      }
    });
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.textContent = this.__text;
    return {element};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createMentionNode(mentionName: string | undefined): MentionNode {
  const mentionNode = new MentionNode("@"+mentionName);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}