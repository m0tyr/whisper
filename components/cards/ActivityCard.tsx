'use client'
import { calculateTimeAgo, limitNewlines, processElements } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { ExtractedElement } from "@/lib/types/whisper.types";
import { motion } from "framer-motion";
import Image from 'next/image';
import { ActivityType } from "@/lib/types/notification.types";

interface Props {
    username: string;
    image: string;
    notification_link: string | undefined;
    caption?: string | undefined;
    createdAt: string;
    type: string;
}

function ActivityCard({
    username,
    image,
    notification_link,
    caption,
    createdAt,
    type
}: Props) {
    const router = useRouter();
    const ping = () => {
        router.push(`/${username}/post/${notification_link}`)
    }
    console.log(caption)
    const [followtracker, setfollowtracker] = useState(false);

    return (
        <>
            {type === ActivityType.LIKE ? (
                <div className="w-full mobile:max-w-[580px]"  >
                    <div className="mt-1">
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                            <div className="relative block mx-auto mt-1.5 w-[40px] h-[40px] justify-center items-center">
                                <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                    <div className="w-[40px] h-[40px] flex">
                                        <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />

                                    </div>
                                    <div className=" bg-insanedark px-0.5 py-0.5 rounded-full absolute top-5 right-[-5px]">
                                        <div className=" bg-rose-500 h-5 w-5 rounded-full flex justify-center items-center">
                                            <svg width="10" height="10" aria-label="J’aime" role="img" viewBox="0 0 24 22" >
                                                <title>J’aime</title>
                                                <path className={'fill-white stroke-2 stroke-white'} d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z" >
                                                </path>
                                            </svg>
                                        </div>
                                    </div>

                                </motion.div>
                            </div>

                            <div className="flex py-1 max-w-full cursor-pointer ">
                                <div key={notification_link} className="flex-grow min-w-0 " onClick={(e) => {
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
                                        <span className="max-w-full text-[14px] font-extralight opacity-65 flex">A aimé votre whisper</span>
                                    </div>
                                    {caption &&
                                    <div className="flex-grow max-w-full inline-block"  >
                                        <span className={`text-white leading-[calc(1.4_*_1em)] line-clamp-3 max-w-full text-left relative !text-[15px] text-small-regular font-normal  mb-0 whitespace-pre-line break-words `} onClick={(e) => {
                                            if (e.target === e.currentTarget) {
                                                ping();
                                            }
                                        }}>
                                            {caption}

                                        </span>
                                    </div>
                                    }
                                    <hr className="border-x-2 opacity-20 rounded-full mt-[0.66rem] " />

                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            ) : (
                type === ActivityType.FOLLOW ? (
                    <div className="w-full mobile:max-w-[580px]"  >
                        <div className="mt-1">
                            <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                                <div className="relative block mx-auto mt-1  w-[40px] h-[40px] justify-center items-center">
                                    <motion.div onClick={() => {router.push(`/${username}`)}}  whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto cursor-pointer ">
                                        <div className="w-[40px] h-[40px] flex">
                                            <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />

                                        </div>
                                        <div className=" bg-insanedark px-0.5 py-0.5 rounded-full absolute top-5 right-[-5px]">
                                            <div className=" bg-sky-700 h-5 w-5 rounded-full flex justify-center items-center">
                                                <svg aria-label="Profil" role="img" viewBox="0 0 26 26" width={12} height={12} className=" fill-white stroke-white">
                                                    <title>Profil</title>
                                                    <circle cx="13" cy="7.25" r="4" stroke="currentColor" strokeWidth="2.5">
                                                    </circle>
                                                    <path d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z" stroke="currentColor" strokeWidth="2.5"></path>
                                                </svg>
                                            </div>
                                        </div>

                                    </motion.div>
                                </div>
                                <div>
                                    <div className=" py-1 content-center pl-0 flex flex-grow justify-between items-center">
                                        <div className="flex flex-col justify-center pr-2 h-11">
                                            <div className="flex items-center ">
                                                <span
                                                onClick={() => {router.push(`/${username}`)}}
                                                    className=" cursor-pointer hover:underline inline-block text-left overflow-x-visible overflow-y-visible min-w-0 font-semibold text-[15px] whitespace-pre-line"
                                                    style={{ wordBreak: 'break-word' }}
                                                >
                                                    {username}
                                                </span>
                                                <span className="max-w-full ml-2 pb-0.5 text-[14px] font-extralight opacity-65">{calculateTimeAgo(createdAt.toString())}</span>

                                            </div>
                                            <span className="max-w-full text-[14px] font-extralight opacity-65 flex">A commencé à vous Suivre</span>

                                        </div>
                                        <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }} className=" h-[34px] rounded-xl hover:bg-dark border-[.15px] border-[rgba(243,245,247,.13333)]  inline-flex w-[104px] justify-center items-center"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                setfollowtracker(!followtracker);
                                            }}
                                        >
                                            <div
                                                className={`${followtracker ? ' text-[rgb(119,119,119)] font-extralight ' : 'text-white'}  !text-[14px] font-medium justify-center items-center`}

                                                style={{ cursor: 'pointer' }}
                                            >
                                                {!followtracker ? "Suivre" : "Suivi(e)"}
                                            </div>
                                        </motion.div>
                                    </div>
                                    <hr className="border-x-2 opacity-20 rounded-full mt-[0.66rem] " />
                                </div>
                            </div>

                        </div>
                    </div>
                ) : null // Add other activity types here if needed
            )}

        </>
    )
}
export default ActivityCard