'use client'

interface Props {
    id: string;
    content: string;
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
import { calculateTimeAgo } from "@/lib/utils";
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

export default function WhisperCardMain({ id, content, media, author, createdAt, togglePopup,aspectRatio,mentions }: Props) {


   
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
                            {content.split(/\n{2,}/).map((paragraph, index) => {
                                const mentionsRegex = /@[a-zA-Z0-9]+/g;
                                const mymentions = paragraph.match(mentionsRegex);
                                const matchText: string[] = [];
                                const textesTableau2 = new Set(mentions.map(objet => objet.text));
                                if (mymentions) {
                                    for (const text of mymentions) {
                                        if (textesTableau2.has(text)) {
                                            matchText.push(text);
                                        }
                                    }
                                }

                                if (textesTableau2.size !== 0 && mymentions) {
                                    return (
                                        <span key={index} className={`text-white leading-relaxed overflow-y-visible overflow-x-visible max-w-full text-left relative block text-small-regular mb-0 ${index == 0 ? '' : 'mt-[1rem]'} whitespace-pre-line break-words`} >
                                            {paragraph.split(mentionsRegex).map((text, i) => {
                                                if (textesTableau2.has(mymentions[i])) {
                                                    return (
                                                        <React.Fragment key={i}>
                                                            {text}
                                                            {mymentions[i] && (
                                                                <div className="inline-block">
                                                                    <Link href={"/" + mymentions[i].substring(1)} className="text-[rgb(29,161,242)] text-[14px] hover:underline py-0.5">{mymentions[i]}</Link>
                                                                </div>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                } else {
                                                    return (
                                                        <React.Fragment key={i}>
                                                            {text}
                                                            {mymentions[i] && (
                                                                <React.Fragment>
                                                                    {mymentions[i]}
                                                                </React.Fragment>
                                                            )}
                                                        </React.Fragment>
                                                    );
                                                }
                                            })}
                                        </span>
                                    );
                                } else {
                                    return (
                                        <span key={index} className={`text-white leading-relaxed overflow-y-visible overflow-x-visible max-w-full text-left relative block text-small-regular mb-0 ${index == 0 ? '' : 'mt-[1rem]'} whitespace-pre-line break-words`}>
                                            {paragraph}
                                        </span>
                                    );
                                }
                            })}
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
