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

export default function WhisperCardMain({ id, content, media, author, createdAt, togglePopup,aspectRatio }: Props) {


   
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
                <div>
                        <div className=" break-words max-w-lg">
                            <span className="text-white text-small-regular mt-1  whitespace-pre-line break-words block">{content}</span>
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
