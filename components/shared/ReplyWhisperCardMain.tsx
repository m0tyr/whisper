'use client'

interface Props {
    id: string;
    content: ExtractedElement[];
    media: string;
    author: {
        username: string;
        image: string;
        id: string;
    };
    createdAt: string;
    togglePopup:any;
    aspectRatio?:any;
    mentions: {
        link: string,
        text: string,
        version: number
    }[];
}
import { calculateTimeAgo, processElements } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import ImageClickAnim from "../animations/ImageClickAnim";
import { useState } from "react";
import ReplyWhisper from "../forms/ReplyWhisper";
import { motion } from "framer-motion";
import React from "react";
import { ExtractedElement } from "../plugins/Main";

export default function WhisperCardMain({ id, content, media, author, createdAt, togglePopup,aspectRatio,mentions }: Props) {


    let sections = processElements(content)

    return (
        <>
  
        <div className="w-full ">
            <div className="float-right  text-white text-small-regular font-light opacity-50 flex h-5">

                <p className="opacity-50 pr-2.5">{calculateTimeAgo(createdAt.toString())}</p>
               
            </div>
            <div>
                <Link href={`/${author.username}`}>
                    <p className="text-white text-small-semibold hover:underline">{author.username}</p>
                </Link>
            </div>
            {content && (
                    <div className="relative bottom-1" >

                        <div className="break-words max-w-lg whitespace-pre-wrap mt-1.5">
                        {sections.map((section, index) => (
                                <span key={index} className={`text-white leading-[calc(1.4_*_1em)] overflow-y-visible overflow-x-visible max-w-full text-left relative block !text-[15px] font-light mb-0 ${index === 0 ? '' : 'mt-[1rem]'} whitespace-pre-line break-words`}>
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
            {media && (
                <ImageClickAnim src={media} aspectRatio={aspectRatio} />
            )}  
            <div className="mb-6">

            </div>



        </div>
          
        </>
    )

}
