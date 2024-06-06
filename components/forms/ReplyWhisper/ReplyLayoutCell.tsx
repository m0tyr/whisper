'use client'

interface Props {
    id: string;
    content: ExtractedElement[];
    medias: DBImageData[];
    author: {
        username: string;
        image: string;
        id: string;
    };
    createdAt: string;
    mentions: {
        link: string,
        text: string,
        version: number
    }[];
}
import { calculateTimeAgo } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";
import { motion } from "framer-motion";
import WhisperPostText from "@/components/cards/components/WhisperPostText";
import WhisperPostMediaAttachments from "@/components/cards/components/WhisperPostMediaAttachments";

export default function ReplyLayoutCell({ content, medias, author, createdAt }: Props) {
    return (
        <>
            <div className={`flex flex-col  w-10`}>

                <div className=" flex w-10  mt-[3px]   justify-center items-center">
                    <Link href={`${author.username}`}>
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                            <div className="w-[40px] h-[40px] flex">
                                <Image src={author.image} alt="logo" width={40} height={40} className=" cursor-pointer rounded-full border-border border" />
                            </div>
                        </motion.div>

                    </Link>
                </div>
                <div className={`thread-card_bar `} />
            </div>
            <div className="w-full ">
                <div className="flex flex-row gap-2 mb-1">
                    <div>
                        <Link href={`/${author.username}`}>
                            <p className="text-white !text-[15px] text-small-semibold hover:underline">{author.username}</p>
                        </Link>
                    </div>
                    <div className=" text-white text-small-regular font-light opacity-70 flex h-5">
                        <p className="opacity-50 pr-2.5">{calculateTimeAgo(createdAt.toString())}</p>
                    </div>
                </div>
                <WhisperPostText isInReplyContext={true} reply_ref_content={content} />

                <WhisperPostMediaAttachments ViewportProvider="reply_modal" isMainView={false} isInReplyContext={true} reply_ref_content={content} reply_ref_medias={medias} />
                <div className=" mb-3">

                </div>
            </div>

        </>
    )

}
