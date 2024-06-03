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
import router, { useRouter } from "next/navigation";
import React from "react";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";
import WhisperDropDownAction from "./widgets/whisper_dropdown_actions";
import WhisperPostInteractions from "../cards/components/WhisperPostInteractions";
import WhisperPostMediaAttachments from "../cards/components/WhisperPostMediaAttachments";
import WhisperPostText from "../cards/components/WhisperPostText";

export default function WhisperCardMain({ id, author, createdAt }: Props) {
    const router = useRouter();
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
    return (
        <>

            <div className=" mt-2 w-full relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >

                <div className="float-right mt-[1.333333px]  text-white text-small-regular font-light opacity-50 flex h-5">

                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>

                    <WhisperDropDownAction />
                </div>
                <div onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        ping();
                    }
                }}>
                    <Link href={`/${author.username}`} className="inline">
                        <p className="text-white text-small-semibold !text-[15px] font-semibold hover:underline inline relative">{author.username}</p>
                    </Link>
                </div>
                <div>
                    <WhisperPostText isInReplyContext={false} />
                    <WhisperPostMediaAttachments ViewportProvider={""} isInReplyContext={false} isMainView={false} />
                    <WhisperPostInteractions />
                </div>
            </div>

        </>
    )

}
