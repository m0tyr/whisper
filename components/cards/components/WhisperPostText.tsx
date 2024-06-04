"use client";

import { useWhisper } from "@/contexts/WhisperPostContext";
import usePostText from "@/hooks/usePostText";
import { ExtractedElement } from "@/lib/types/whisper.types";
import Link from "next/link";
import React from "react";

interface Props {
    isInReplyContext: boolean;
    reply_ref_content?: ExtractedElement[];
}

const WhisperPostText = ({ isInReplyContext, reply_ref_content }: Props) => {
    const { PostTextObject, PostTextComputedObject } = usePostText(isInReplyContext, reply_ref_content as ExtractedElement[]);
    const { ping } = useWhisper()
    return (
        <>
            {PostTextObject && PostTextObject.length !== 0 && (
                <div className="relative bottom-[0.125rem]">
                    <div className="break-words max-w-lg whitespace-pre-wrap cursor-pointer" onClick={(e) => {
                        ping(e)
                    }}>
                        {PostTextComputedObject.map((section, index) => (
                            <span
                                key={index}
                                className={`text-white leading-[calc(1.4_*_1em)] cursor-default overflow-y-visible overflow-x-visible max-w-full text-left relative inline-block !text-[15px] text-small-regular font-normal mb-0 ${
                                    index === 0 ? '' : 'mt-[1rem]'
                                } whitespace-pre-line break-words`}
                            >
                                {section.map((line, subIndex) =>
                                    line.type === 'mention' ? (
                                        <div className="inline-block text-[#1da1f2]" key={`mention_${subIndex}`}>
                                            <Link href={`/${line.text.slice(1)}`} className="hover:underline">
                                                {line.text}
                                            </Link>
                                        </div>
                                    ) : (
                                        <React.Fragment key={`text_${subIndex}`}>
                                            {line.text}
                                        </React.Fragment>
                                    )
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default WhisperPostText;
