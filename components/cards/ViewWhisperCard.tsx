"use client"
import { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
const DynamicReplyWhisper = dynamic(() => import("../forms/ReplyWhisper"), {
    ssr: false,
})

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import { calculateTimeAgo, getMeta, processElements } from "@/lib/utils";
import React from "react";
import { likewhisper } from "@/lib/actions/whisper.actions";
import WhisperCardMedia from "./ui/WhisperCardMedia";
import { DBImageData, ExtractedElement, Whisper_to_Reply } from "@/lib/types/whisper.types";
import WhisperDropDownAction from "../shared/widgets/whisper_dropdown_actions";
import { Modal } from "../shared/Modal";
import { useWhisper } from "@/contexts/WhisperPostContext";
import { useSessionUser } from "@/hooks/useSessionUser";
import { useWhisperModal } from "@/hooks/useWhisperModal";
import WhisperPostText from "./components/WhisperPostText";
import WhisperPostInteractions from "./components/WhisperPostInteractions";
import WhisperPostMediaAttachments from "./components/WhisperPostMediaAttachments";


const ViewWhisperCard = () => {
    const {
        parentId,
        author,
        createdAt,
        isNotComment,
        ping
    } = useWhisper();
    return (
        <>
            <div className={`opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300  pb-3 ${parentId === undefined ? 'pt-3.5' : 'pt-1'}  mobile:px-[1.6rem] px-2.5   w-full cursor-pointer relative`} onClick={(e) => {
                ping(e)
            }} >
                <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 relative' >

                    <div className="flex flex-row flex-1  gap-3 ">
                        <div className="w-full relative" onClick={(e) => {
                            ping(e)
                        }} >

                            <div className="flex flex-row mb-2  items-center gap-3">
                                <Link href={`/${author.username}`}>
                                    <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                        <div className="w-[40px] h-[40px] flex">
                                            <Image src={author.image} alt="logo" width={40} height={40} className=" border-border border cursor-pointer rounded-full" />
                                        </div>
                                    </motion.div>
                                </Link>
                                <Link href={`/${author.username}`}>
                                    <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">{author.username}</p>
                                </Link>
                                <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">

                                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
                                    <WhisperDropDownAction />

                                </div>
                            </div>

                            <WhisperPostText />

                            <WhisperPostMediaAttachments/>
                          
                            <WhisperPostInteractions />
                        </div>
                    </div>
                </div>

            </div>
            {!isNotComment ?
                (
                    <>
                        <hr className="border-x-2 opacity-20 rounded-full " />
                    </>
                )
                :
                (
                    null
                )
            }




        </>
    )
}


export default ViewWhisperCard;