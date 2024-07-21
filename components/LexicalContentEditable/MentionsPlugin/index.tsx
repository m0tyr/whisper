/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  useFloating,
  offset,
  flip,
  shift,
} from '@floating-ui/react';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { LexicalEditor, TextNode } from 'lexical';
import { useCallback, useEffect, useMemo, useState } from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { $createMentionNode } from './MentionNode';
import { MentionSearchModel } from '@/lib/actions/user.actions';
import Spinner from '@/components/Spinner/Spinner';

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

// Regular expression patterns for mentions
const mentionRegexPattern = "(^|[^a-zA-Z0-9_!#$%&*@/\uff20])";
const mentionSymbolPattern = "([@\uff20\uf000])";
const mentionUsernamePattern = "((?:[a-zA-Z0-9_]|\\.[a-zA-Z0-9_])+)";
const mentionRegex = new RegExp(mentionRegexPattern + mentionSymbolPattern + mentionUsernamePattern, "g");



//when certains person at the top of the list it display first 
//example
// motyr,
// test,
// motyr will display first for the query @t !important for referencement by follow etc


// TODO !!
// use this has the backend call with use server directive : done
// make a cache data that will store the previous states of the search until refresh : done
// make a call with server actions to the backend at every mention results added to the list : done
// map the data to return parsed for postiung after exportDom etc... : done
// filter function should return due to current index of letter so sofien would be first for sofie and sofiane shouldn't : done
const dummyLookupService = {
  search(string: string, callback: (results: Array<any>) => void): void {
    setTimeout(async () => {
      const usermodal = await MentionSearchModel(string);
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
  id: string;

  constructor(name: string, image: string, username: string, id: string) {
    super(name);
    this.name = name;
    this.image = image;
    this.username = username;
    this.id = id
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







export function MentionsPlugin(): JSX.Element | null {
  const composereditor = useLexicalComposerContext();
  const [realeditor] = useLexicalComposerContext();
  const [queryString, setQueryString] = useState<string | null>(null);
  const { results, loading } = useMentionLookupService(queryString);
  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    if (results !== null) {
      return results.map((result: { name: any; image: any; username: any; id: any; }) => {
        const { name, image, username, id } = result;
        return new MentionTypeaheadOption(name, image, username, id);
      }).slice(0, SUGGESTION_LIST_LENGTH_LIMIT);
    }
    return [];
  }, [results]);
  const onSelectOption = useCallback(
    (
      selectedOption: { name: string; image: string; username: string,id: string },
      nodeToReplace: TextNode | null,
      closeMenu: () => void
    ) => {
      realeditor.update(() => {
        const mentionNode = $createMentionNode(selectedOption.username, selectedOption.id);
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
          mentionNode.select();
          closeMenu();
          console.log(nodeToReplace)
        }
      }
      );
    },
    [composereditor]
  );

  const checkForMentionMatch = useCallback(
    (
      text: string,
      editor: LexicalEditor,
    ) => {

      const mentionMatch = getPossibleQueryMatch(text);
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      return !slashMatch && mentionMatch ? mentionMatch : null;
    },
    [checkForSlashTriggerMatch, composereditor]
  );

  const parent = document.getElementById('parent') as HTMLElement | undefined;
  const { x, y, refs, strategy } = useFloating({
    placement: 'bottom-start',
    middleware: [
      offset(6),
      flip(),
      shift()
    ],
  });

  return (

    <LexicalTypeaheadMenuPlugin
      onOpen={(r) => {
        refs.setPositionReference({
          getBoundingClientRect: r.getRect,
        });
      }}
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
                <div
                  className='rounded-xl'
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    width: 'max-content',
                  }}
                >
                  <div className="overflow-y-auto max-h-52 rounded-xl bg-[rgba(16,16,16,1)]" id='main-pop'>
                    <div className='overflow-x-hidden  overflow-y-hidden flex items-center relative px-0 py-0 mx-0 my-0 w-full'>
                      <div className='flex flex-col flex-shrink w-full px-1 py-0.5'>
                        <div className='flex flex-row flex-wrap p-2'>
                          <div className='flex h-[36px] justify-center items-center mx-auto'>
                           <Spinner width={22} height={22} color='white' Centered={false} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : results && results.length > 0 ? (
                <div
                  className='rounded-xl'
                  ref={refs.setFloating}
                  style={{
                    position: strategy,
                    top: y ?? 0,
                    left: x ?? 0,
                    width: 'max-content',
                  }}
                >
                  <div className=" rounded-[16px] w-full overflow-x-hidden drop-shadow" id='main-pop'>
                    <div className='overflow-y-auto max-h-[285px]'>
                      <ul className='bg-[#1b1b1b]  flex flex-col'>
                        {options.map((option, i: number) => (
                          <MentionsTypeaheadMenuItem
                            index={i}
                            isSelected={selectedIndex === i}
                            onClick={() => {
                              setHighlightedIndex(i);
                              try {
                                selectOptionAndCleanUp(option);
                                console.log(option)
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