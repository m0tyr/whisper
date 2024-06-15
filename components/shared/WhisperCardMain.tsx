'use client'

interface Props {
    id: string;
    author: {
        username: string;
        image: string;
        id: string;
    };
    createdAt: string;
}
import { calculateTimeAgo } from "@/lib/utils";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import WhisperDropDownAction from "./widgets/whisper_dropdown_actions";
import WhisperPostInteractions from "../cards/components/WhisperPostLayout/WhisperPostInteractions";
import WhisperPostMediaAttachments from "../cards/components/WhisperPostLayout/WhisperPostMediaAttachments";
import WhisperPostText from "../cards/components/WhisperPostLayout/WhisperPostText";
import { useWhisper } from "@/contexts/WhisperPostContext";

export default function WhisperCardMain({ id, author, createdAt }: Props) {
    const router = useRouter();
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
     const { content } = useWhisper()
    return (
        <>

            <div className=" mt-[6.2px] w-full relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >

                <div className={`float-right ${content.length === 0 ? 'mt-[10px]' : 'mt-[1.333333px]'} text-white text-small-regular font-light opacity-50 flex h-5`}>

                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>

                    <WhisperDropDownAction />
                </div>
                <div className={` ${content.length === 0 ? 'mt-[10px]' : ''}`} onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        ping();
                    }
                }}>
                    <Link href={`/${author.username}`} className="inline">
                        <p className="text-white text-small-semibold !text-[15px] font-semibold hover:underline inline relative">{author.username}</p>
                    </Link>
                </div>
                <div className="mt-0.5">
                    <WhisperPostText />
                    <WhisperPostMediaAttachments />
                    <WhisperPostInteractions />
                </div>
            </div>

        </>
    )

}
