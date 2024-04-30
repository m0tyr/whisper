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
    id: string;
  },
  SerializedTextNode
>;


function convertMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const id = domNode.id
  if (textContent !== null) {
    const node = $createMentionNode(textContent,id);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = "color: #1da1f2;";
export  class MentionNode extends TextNode {
  getStart() {
    throw new Error('Method not implemented.');
  }
  __mention: string;
  __user_id: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention,node.__user_id, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(serializedNode.mentionName, serializedNode.id);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mentionName: string,id: string , text?: string, key?: NodeKey) {
    super(text ?? mentionName, key);
    this.__mention = mentionName;
    this.__user_id = id;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      id : this.__user_id,
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
}

export function $createMentionNode(mentionName: string,id :string): MentionNode {
  const mentionNode = new MentionNode("@"+mentionName, id);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $mentionNodeAuto(mentionName = '',id :string):MentionNode{
  return $applyNodeReplacement(new MentionNode(mentionName,id));
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}