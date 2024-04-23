'use client'
import { calculateTimeAgo, limitNewlines, processElements } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import { ExtractedElement } from "@/lib/types/whisper.types";
import { motion } from "framer-motion";
import Image from 'next/image';

interface Props {
    username: string;
    image: string;
    _id: string;
    caption: string;
    createdAt: string;
    content: ExtractedElement[];
}

function ActivityCard({
    username,
    image,
    _id,
    caption,
    createdAt,
    content
}: Props) {
    const router = useRouter();

    const ping = () => {
        router.push(`/${username}/post/${_id}`)
    }
    let sections = processElements(content)
    let mainrows = 0
    console.log(caption)
    return (
        <>
            <div className="w-full mobile:max-w-[580px]"  >
                <div className="mt-1">
                    <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                        <div className="relative block mx-auto mt-1.5 w-[40px] h-[40px] justify-center items-center">
                            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />
                                </div>
                            </motion.div>
                        </div>

                        <div className="flex py-1 max-w-full cursor-pointer ">
                            <div key={_id} className="flex-grow min-w-0 " onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    ping();
                                }
                            }}  >
                                <div className="flex-grow" onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        ping();
                                    }
                                }}>
                                    <span className=" max-w-full text-[15px] font-semibold">{username}</span>
                                    <span className="max-w-full ml-2 text-[14px] font-extralight opacity-65">{calculateTimeAgo(createdAt.toString())}</span>
                                    <span className="max-w-full text-[14px] font-extralight opacity-65 flex">A mentionné votre Nom</span>
                                </div>
                                <div className="flex-grow max-w-full inline-block"  >
                                    <span className={`text-white leading-[calc(1.4_*_1em)] line-clamp-3 max-w-full text-left relative !text-[15px] text-small-regular font-normal  mb-0 whitespace-pre-line break-words `} onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            ping();
                                        }
                                    }}>
                                        {caption}

                                    </span>
                                </div>
                                <hr className="border-x-2 opacity-20 rounded-full mt-[0.66rem] " />

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}
export default ActivityCard