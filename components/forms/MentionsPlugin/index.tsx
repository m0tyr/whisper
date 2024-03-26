/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { $createMentionNode } from './MentionNode';

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
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
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

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 10;

const mentionsCache = new Map();


//when certains person at the top of the list it display first 
//example
// motyr,
// test,
// motyr will display first for the query @t !important for referencement by follow etc
const dummyMentionsData = [
  {
    name: 'soso',
    picture: '/profil.jpg',
    username: 'soso123',
  },
  {
    name: 'azza',
    picture: '/profil.jpg',
    username: 'azza456',
  },
  {
    name: 'gris',
    picture: '/profil.jpg',
    username: 'gris789',
  },
  {
    name: 'soso',
    picture: '/profil.jpg',
    username: 'soso123',
  },
  {
    name: 'azza',
    picture: '/profil.jpg',
    username: 'azza456',
  },
  {
    name: 'gris',
    picture: '/profil.jpg',
    username: 'gris789',
  },
  {
    name: 'soso',
    picture: '/profil.jpg',
    username: 'soso123',
  },
  {
    name: 'azza',
    picture: '/profil.jpg',
    username: 'azza456',
  },
  {
    name: 'gris',
    picture: '/profil.jpg',
    username: 'gris789',
  },
  {
    name: 'soso',
    picture: '/profil.jpg',
    username: 'soso123',
  },
  {
    name: 'azza',
    picture: '/profil.jpg',
    username: 'azza456',
  },
  {
    name: 'gris',
    picture: '/profil.jpg',
    username: 'gris789',
  },
  {
    name: 'soso',
    picture: '/profil.jpg',
    username: 'soso123',
  },
  {
    name: 'azza',
    picture: '/profil.jpg',
    username: 'azza456',
  },
  {
    name: 'gris',
    picture: '/profil.jpg',
    username: 'gris789',
  },
];

// TODO !!
// use this has the backend call with use server directive
// make a cache data that will store the previous states of the search until refresh
// make a call with server actions to the backend at every mention results added to the list
// map the data to return parsed for postiung after exportDom etc...
// filter function should return due to current index of letter so sofien would be first for sofie and sofiane shouldn't
const dummyLookupService = {
  search(string: string, callback: (results: Array<any>) => void): void {
    setTimeout(() => {
      const results = dummyMentionsData.filter((mention) =>
        mention.username.toLowerCase().includes(string.toLowerCase())
      );
      callback(results);
    }, 500);
  },
};

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<Array<any>>([]); // Change type to Array<any>

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString);

    if (mentionString === null) {
      setResults([]);
      return;
    }

    if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    mentionsCache.set(mentionString, null);
    dummyLookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults);
      setResults(newResults);
    });
  }, [mentionString]);

  return results;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 1);
}

class MentionTypeaheadOption extends MenuOption {
  name: string;
  picture: string;
  username: string;

  constructor(name: string, picture: string, username: string) {
    super(name);
    this.name = name;
    this.picture = picture;
    this.username = username;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}>
      <div className='flex'>
        <div className='flex relative mt-3 mr-3  w-[36px] h-[36px]'>
          <img src={option.picture} alt="" className='rounded-full' width={36} height={36} />
        </div>
        <div className=' justify-center flex flex-col relative'>
          <span className=" font-semibold text-[15px] absolute top-2">{option.username}</span>
          <span className=" font-light text-[16px] absolute bottom-0">{option.name}</span>
        </div>
      </div>
    </li>
  );
}

export default function NewMentionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const results = useMentionLookupService(queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results.map((result) => {
        const { name, picture, username } = result;
        return new MentionTypeaheadOption(name, picture, username);
      }).slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );
  const onSelectOption = useCallback(
    (
      selectedOption: { name: string; picture: string; username: string },
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.name);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor]
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor]
  );
  const parent = document.getElementById('parent') as HTMLElement | undefined;
  
  return (
    <LexicalTypeaheadMenuPlugin
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch} 
      options={options}
      parent={parent}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }
      ) =>
        anchorElementRef.current && results.length ? (
          ReactDOM.createPortal(
            <div className='rounded-xl '>
              <div className="overflow-y-auto max-h-[280px] rounded-3xl " id='main-pop'>
                <ul className='bg-[rgba(16,16,16,1)] flex flex-col'>
                  {options.map((option, i: number) => (
                    <div className='overflow-x-hidden  overflow-y-hidden flex items-center relative px-0 py-0 mx-0 my-0 w-full border-b border-border ' key={i}>
                      <div className='flex flex-col flex-shrink px-1 py-1'>
                        <div className='flex flex-row flex-wrap p-2'>
                          <MentionsTypeaheadMenuItem
                            index={i}
                            isSelected={selectedIndex === i}
                            onClick={() => {
                              setHighlightedIndex(i);
                              console.log("selected");
                              try {
                                selectOptionAndCleanUp(option);
                              } catch (error) {
                                console.error("Error in selectOptionAndCleanUp:", error);
                              }
                            }}
                            onMouseEnter={() => {
                              setHighlightedIndex(i);
                            }}
                            option={option} />
                        </div>
                      </div>
                    </div>
                  ))}
                </ul>
              </div>
            </div>,
            anchorElementRef.current
          )
        ) : null
      }
    />
  );
}