"use client"
import { useWhisper } from "@/contexts/WhisperPostContext"
import { processElements } from "@/lib/utils"
import Link from "next/link"
import React from "react"

const WhisperPostText = () => {
    const { content } = useWhisper()

    let sections = processElements(content)
    return (
        <>
            {content && content.length !== 0 && (
                <div className="relative bottom-1" >

                    <div className="break-words max-w-lg whitespace-pre-wrap pt-[10px] cursor-auto">
                        {sections.map((section, index) => (
                            <span key={index} className={`text-white leading-[calc(1.4_*_1em)] overflow-y-visible overflow-x-visible max-w-full text-left relative block !text-[15px] text-small-regular mb-0 ${index === 0 ? '' : 'mt-[1rem]'} whitespace-pre-line break-words`}>
                                {section.map((line, subIndex) => (
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
                                ))}
                            </span>
                        ))}
                    </div>

                </div>

            )}
        </>
    )
}

export default WhisperPostText