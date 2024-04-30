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
    const [followtracker, setfollowtracker] = useState(false);

    return (
        <>
            {type === ActivityType.LIKE ? (
                <div className="w-full mobile:max-w-[580px]"  >
                    <div className="mt-1">
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                            <div className="relative block mx-auto mt-1.5 w-[40px] h-[40px] justify-center items-center">
                                <motion.div onClick={() => { router.push(`/${username}`) }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto cursor-pointer">
                                    <div className="w-[40px] h-[40px] flex">
                                        <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />

                                    </div>
                                    <div className=" bg-insanedark px-0.5 py-0.5 rounded-full absolute top-5 right-[-5px]">
                                        <div className=" bg-rose-500 h-5 w-5 rounded-full flex justify-center items-center">
                                            <svg width="10" height="10" aria-label="J’aime" role="img" viewBox="0 0 24 22" >
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
                                    <div className="flex-grow flex flex-col" onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            ping();
                                        }
                                    }}>
                                        <div onClick={(e) => {
                                            if (e.target === e.currentTarget) {
                                                ping();
                                            }
                                        }}>
                                            <span onClick={() => { router.push(`/${username}`) }} className="hover:underline max-w-full text-[15px] font-semibold">{username}</span>
                                            <span className="max-w-full ml-2 text-[14px] font-extralight opacity-65">{calculateTimeAgo(createdAt.toString())}</span>
                                        </div>
                                        <div className="max-w-full" onClick={(e) => {
                                            if (e.target === e.currentTarget) {
                                                ping();
                                            }
                                        }}>
                                            <span className="text-[14px] inline-flex font-extralight opacity-65">
                                                A aimé votre whisper
                                            </span>
                                        </div>
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
                                    <motion.div onClick={() => { router.push(`/${username}`) }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto cursor-pointer ">
                                        <div className="w-[40px] h-[40px] flex">
                                            <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />

                                        </div>
                                        <div className=" bg-insanedark px-0.5 py-0.5 rounded-full absolute top-5 right-[-5px]">
                                            <div className=" bg-sky-700 h-5 w-5 rounded-full flex justify-center items-center">
                                                <svg aria-label="Profil" role="img" viewBox="0 0 26 26" width={12} height={12} className=" fill-white stroke-white">
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
                                                    onClick={() => { router.push(`/${username}`) }}
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
                ) :
                    type === ActivityType.MENTION ? (
                        <div className="w-full mobile:max-w-[580px]">
                            <div className="mt-1">
                                <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                                    <div className="relative block mx-auto mt-1.5 w-[40px] h-[40px] justify-center items-center">
                                        <motion.div onClick={() => { router.push(`/${username}`) }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto cursor-pointer">
                                            <div className="w-[40px] h-[40px] flex">
                                                <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />

                                            </div>
                                            <div className=" bg-insanedark px-0.5 py-0.5 rounded-full absolute top-5 right-[-5px]">
                                                <div className=" bg-green-500 h-5 w-5 rounded-full flex justify-center items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className=" fill-white stroke-white stroke-1 mt-0.5" viewBox="0 0 33 42.5" width={15} height={15}>
                                                        <path className=" fill-white stroke-white stroke-1" d="M16.3915385,23.4867692 C13.4746154,23.4867692 11.1115385,21.1236923 11.1115385,18.2090769 C11.1115385,15.2921538 13.4746154,12.9290769 16.3915385,12.9290769 C19.3061538,12.9290769 21.6692308,15.2921538 21.6692308,18.2090769 C21.6692308,21.1236923 19.3061538,23.4867692 16.3915385,23.4867692 M16.3938462,1.81753846 L16.3915385,1.81753846 C14.7807692,1.81753846 12.21,2.05523077 9.40846154,3.37292308 C8.19,3.94523077 5.84307692,5.23523077 3.77307692,7.74138462 C0.0807692308,12.2113846 0,17.2490769 0,18.2090769 C0.00461538462,25.0813846 4.36384615,29.3806154 5.07923077,30.0636923 C5.27307692,30.2483077 9.90692308,34.5452308 16.3915385,34.596 L16.5092308,34.596 C19.08,34.596 21.1453846,33.936 21.51,33.816 C23.4253846,33.186 24.8630769,32.2998462 25.8,31.6213846 C26.4253846,31.1921538 26.5846154,30.3221538 26.1530769,29.6967692 C25.8876923,29.3090769 25.4515385,29.1013846 25.0084615,29.1013846 C24.7384615,29.1013846 24.4661538,29.1798462 24.2284615,29.3436923 C23.3630769,29.9690769 21.9415385,30.8436923 20.0053846,31.3698462 C19.7353846,31.4436923 18.2930769,31.8267692 16.5207692,31.8267692 L16.3915385,31.8267692 C10.7861538,31.7690769 6.88384615,27.9636923 6.88384615,27.9636923 C2.85,24.036 2.77153846,19.056 2.77153846,18.2090769 C2.77153846,17.6067692 2.84769231,12.7952308 6.44307692,8.916 C7.87153846,7.37446154 9.39230769,6.48138462 10.3315385,6.01523077 C12.8353846,4.76676923 15.1361538,4.59138462 16.3915385,4.58907692 L16.4123077,4.58907692 C19.3223077,4.58907692 21.48,5.51676923 22.3846154,5.95753846 C22.9523077,6.23446154 25.3915385,7.47830769 27.4776923,10.2913846 C28.6384615,11.8536923 30.0115385,14.946 30.0115385,18.2067692 C30.0115385,19.7367692 28.7538462,20.9944615 27.2238462,20.9944615 C25.6961538,20.9944615 24.4384615,19.7367692 24.4384615,18.2067692 C24.4384615,16.5152308 24.2330769,15.5829231 23.2038462,13.9075385 C22.9015385,13.4136923 22.5969231,13.0698462 22.4146154,12.8667692 C21.2376923,11.5490769 19.9430769,10.9606154 19.4976923,10.776 C19.0292308,10.5798462 17.8984615,10.1621538 16.3915385,10.1598462 L16.3846154,10.1598462 C14.9861538,10.1598462 13.9407692,10.5198462 13.53,10.6744615 C13.1469231,10.8221538 12.2792308,11.1867692 11.3538462,11.9321538 C9.77769231,13.2083077 9.11307692,14.7290769 8.91461538,15.2252308 C8.7,15.7606154 8.34461538,16.8221538 8.34230769,18.2067692 C8.34230769,19.6998462 8.75307692,20.8306154 8.97692308,21.3544615 C9.23307692,21.966 9.89076923,23.2998462 11.2961538,24.4444615 C13.4423077,26.1890769 15.8076923,26.256 16.3846154,26.256 L16.3915385,26.256 C17.1138462,26.2536923 18.7384615,26.1567692 20.4507692,25.1552308 C22.1353846,24.1721538 23.0146154,22.8383077 23.3746154,22.2106154 C23.6976923,22.5198462 24.24,22.9675385 25.02,23.3067692 C25.35,23.4498462 26.1623077,23.7613846 27.2076923,23.7613846 L27.2238462,23.7613846 C29.4992308,23.7544615 31.0061538,22.2683077 31.1792308,22.0929231 C32.7207692,20.5213846 32.7784615,18.6036923 32.7807692,18.2067692 C32.8223077,13.0098462 29.8638462,8.75676923 29.1184615,7.85446154 C28.2646154,6.81830769 25.7515385,4.02830769 21.5030769,2.63215385 C20.5223077,2.30907692 18.7084615,1.81753846 16.3938462,1.81753846" />
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
                                            <div className="flex-grow flex flex-col" onClick={(e) => {
                                                if (e.target === e.currentTarget) {
                                                    ping();
                                                }
                                            }}>
                                                <div onClick={(e) => {
                                                    if (e.target === e.currentTarget) {
                                                        ping();
                                                    }
                                                }}>
                                                    <span onClick={() => { router.push(`/${username}`) }} className="hover:underline max-w-full text-[15px] font-semibold">{username}</span>
                                                    <span className="max-w-full ml-2 text-[14px] font-extralight opacity-65">{calculateTimeAgo(createdAt.toString())}</span>
                                                </div>
                                                <div className="max-w-full" onClick={(e) => {
                                                    if (e.target === e.currentTarget) {
                                                        ping();
                                                    }
                                                }}>
                                                    <span className="text-[14px] inline-flex font-extralight opacity-65">
                                                        A mentionné votre nom
                                                    </span>
                                                </div>
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
                    ) : type === ActivityType.REPLY ? (
                        <div className="w-full mobile:max-w-[580px]">
                            <div className="mt-1">
                                <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                                    <div className="relative block mx-auto mt-1.5 w-[40px] h-[40px] justify-center items-center">
                                        <motion.div onClick={() => { router.push(`/${username}`) }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto cursor-pointer">
                                            <div className="w-[40px] h-[40px] flex">
                                                <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />

                                            </div>
                                            <div className=" bg-insanedark px-0.5 py-0.5 rounded-full absolute top-5 right-[-5px]">
                                                <div className=" bg-indigo-700  h-5 w-5 rounded-full flex justify-center items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 100 125" width={13} height={13} className="mt-[1px] fill-white stroke-white">
                                                        <path d="M3.93,46.27,42.27,17.51A2.92,2.92,0,0,1,47,19.85V35c41.79,0,49.71,29,51,44.51a3,3,0,0,1-5.23,2.16C74.22,60,47,65,47,65V80.15a2.92,2.92,0,0,1-4.68,2.34L3.93,53.74A4.67,4.67,0,0,1,3.93,46.27Z" />
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
                                            <div className="flex-grow flex flex-col" onClick={(e) => {
                                                if (e.target === e.currentTarget) {
                                                    ping();
                                                }
                                            }}>
                                                <div onClick={(e) => {
                                                    if (e.target === e.currentTarget) {
                                                        ping();
                                                    }
                                                }}>
                                                    <span onClick={() => { router.push(`/${username}`) }} className="hover:underline max-w-full text-[15px] font-semibold">{username}</span>
                                                    <span className="max-w-full ml-2 text-[14px] font-extralight opacity-65">{calculateTimeAgo(createdAt.toString())}</span>
                                                </div>
                                                <div className="max-w-full" onClick={(e) => {
                                                    if (e.target === e.currentTarget) {
                                                        ping();
                                                    }
                                                }}>
                                                    <span className="text-[14px] inline-flex font-extralight opacity-65">
                                                        A commenter sous votre whisper
                                                    </span>
                                                </div>
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
                    ) : null
                // Add other activity types here if needed
            )}

        </>
    )
}
export default ActivityCard