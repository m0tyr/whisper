'use client'

interface Props {
    whisper_data: any;
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
    LikeWhisper: any;
    Isliking: boolean;
}
import { calculateTimeAgo, getMeta, processElements } from "@/lib/utils";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import router, { useRouter } from "next/navigation";
import React from "react";
import { DBImageData, ExtractedElement, Whisper_to_Reply } from "@/lib/types/whisper.types";
import WhisperCardMedia from "../cards/ui/WhisperCardMedia";
import PopOver from "./DirectDialog";
import WhisperDropDownAction from "./widgets/whisper_dropdown_actions";
import { DELETE_WHPR_ACTION, DELETE_WHPR_CONTENT, DELETE_WHPR_TITLE } from "@/constants/message";
import { useWhisperModal } from "@/hooks/useWhisperModal";
import WhisperPostInteractions from "../cards/components/WhisperPostInteractions";

export default function WhisperCardMain({ whisper_data,id, content, medias, author, createdAt, mentions, LikeWhisper, Isliking }: Props) {
    const router = useRouter();
    const { launchReplyContext } = useWhisperModal()
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
    const [isliking, setisliking] = useState(Isliking)
    const LikingAction = () => {
        LikeWhisper()
        setisliking(!isliking)

    }
 
    let sections = processElements(content)
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
                <div >
                    {content && content.length !== 0 && (
                        <div className="relative bottom-1" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }} >

                            <div className="break-words max-w-lg whitespace-pre-wrap mt-1.5 inline-block" >
                                {sections.map((section, index) => (
                                    <span key={index} className={`text-white leading-[calc(1.4_*_1em)] overflow-y-visible overflow-x-visible max-w-full text-left relative block !text-[14.5px] text-small-regular font-normal  mb-0 ${index === 0 ? '' : 'mt-[1rem]'} whitespace-pre-line break-words `}>
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
                    {medias && medias.length <= 2 ? (
                        <div className={`relative w-full bottom-1 ${content && content.length !== 0 ? "" : "mt-5"} `} onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }}>
                            <WhisperCardMedia medias={medias} isReply={false} isMainView={false} />
                        </div>
                    ) : (
                        <div className={`relative w-[calc(100%_+_48px_+_2_*_18.5px)] ml-[calc(-1_*_(48px_+_18.5px))] bottom-1 ${content && content.length !== 0 ? "" : "pt-5"}`} onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }}>
                            
                            <WhisperCardMedia medias={medias} isReply={false} isMainView={false} />
                        </div>
                    )}

<WhisperPostInteractions />
                </div>
            </div>

        </>
    )

}
