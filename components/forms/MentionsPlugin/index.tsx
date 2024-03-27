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
import { MentionSearchModel } from '@/lib/actions/user.actions';
import Loader from '@/components/shared/loader/loader';

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


// TODO !!
// use this has the backend call with use server directive : ~done
// make a cache data that will store the previous states of the search until refresh : done
// make a call with server actions to the backend at every mention results added to the list : done
// map the data to return parsed for postiung after exportDom etc... : not done
// filter function should return due to current index of letter so sofien would be first for sofie and sofiane shouldn't : not done
const dummyLookupService = {
  search(string: string, callback: (results: Array<any>) => void): void {
    setTimeout(async () => {
      const usermodal = await MentionSearchModel(string);
      console.log(usermodal)
      const results = usermodal.filter((mention) =>
        mention.username.toLowerCase().includes(string.toLowerCase())
      );
      callback(results);
    }, 500);
  },
};

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);

    mentionsCache.set(mentionString, null);
    dummyLookupService.search(mentionString, (newResults) => {
      mentionsCache.set(mentionString, newResults);
      setResults(newResults);
      setLoading(false);
    });
  }, [mentionString]);

  return { results, loading };
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
  image: string;
  username: string;

  constructor(name: string, image: string, username: string) {
    super(name);
    this.name = name;
    this.image = image;
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
    className = 'selected';
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
      onClick={onClick} >
      <div className='overflow-x-hidden  overflow-y-hidden flex items-center relative px-0 py-0 mx-0 my-0 w-full border-b border-border '>
        <div className='flex flex-col flex-shrink px-1 py-0.5'>
          <div className='flex flex-row flex-wrap p-2'>
            <div className='flex'>
              <div className='flex relative mt-1 mr-2.5 w-[36px] h-[36px]'>
                <img src={option.image} alt="" className='rounded-full' width={36} height={36} />
              </div>
              <div className=' justify-center flex flex-col relative '>
                <span className=" font-medium text-[15px] absolute bottom-4">{option.username}</span>
                <span className=" whitespace-nowrap max-w-full text-ellipsis font-light text-[15px] opacity-45 absolute top-[1.15rem]">{option.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </li>

  );
}

export default function NewMentionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const { results, loading } = useMentionLookupService(queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results.map((result: { name: any; image: any; username: any; }) => {
        const { name, image, username } = result;
        return new MentionTypeaheadOption(name, image, username);
      }).slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results]
  );
  const onSelectOption = useCallback(
    (
      selectedOption: { name: string; image: string; username: string },
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.username);
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
      anchorClassName="disable"
      menuRenderFn={(anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) =>
        anchorElementRef.current ? (
          ReactDOM.createPortal(
            <>
              {loading ? (
                <div className='rounded-xl'>
                  <div className="overflow-y-auto max-h-52 rounded-xl bg-[rgba(16,16,16,1)]" id='main-pop'>
                    <div className='overflow-x-hidden  overflow-y-hidden flex items-center relative px-0 py-0 mx-0 my-0 w-full'>
                      <div className='flex flex-col flex-shrink w-full px-1 py-0.5'>
                        <div className='flex flex-row flex-wrap p-2'>
                          <div className='flex h-[36px] justify-center items-center mx-auto'>
                            <svg aria-label="Chargement…" className="animate-spin text-white opacity-60" role="img" viewBox="0 0 100 100" width={20} height={20}>
                              <rect fill="white" height="10" opacity="0" rx="5" ry="5" transform="rotate(-90 50 50)" width="28" x="67" y="45"></rect>
                              <rect fill="white" height="10" opacity="0.125" rx="5" ry="5" transform="rotate(-45 50 50)" width="28" x="67" y="45"></rect>
                              <rect fill="white" height="10" opacity="0.25" rx="5" ry="5" transform="rotate(0 50 50)" width="28" x="67" y="45"></rect>
                              <rect fill="white" height="10" opacity="0.375" rx="5" ry="5" transform="rotate(45 50 50)" width="28" x="67" y="45"></rect>
                              <rect fill="white" height="10" opacity="0.5" rx="5" ry="5" transform="rotate(90 50 50)" width="28" x="67" y="45"></rect>
                              <rect fill="white" height="10" opacity="0.625" rx="5" ry="5" transform="rotate(135 50 50)" width="28" x="67" y="45"></rect>
                              <rect fill="white" height="10" opacity="0.75" rx="5" ry="5" transform="rotate(180 50 50)" width="28" x="67" y="45"></rect>
                              <rect fill="white" height="10" opacity="0.875" rx="5" ry="5" transform="rotate(225 50 50)" width="28" x="67" y="45"></rect>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className='rounded-xl'>
                  <div className=" rounded-[16px] w-full overflow-x-hidden drop-shadow-2xl" id='main-pop'>
                    <div className='overflow-y-auto max-h-[285px]'>
                      <ul className='bg-[#1b1b1b]  flex flex-col'>
                        {options.map((option, i: number) => (
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
                            option={option}
                            key={i}
                          />
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : null}
            </>,
            anchorElementRef.current
          )
        ) : null
      }
    />

  );
}