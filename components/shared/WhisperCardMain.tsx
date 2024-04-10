'use client'

interface Props {
    id: string;
    content: ExtractedElement[];
    media: string;
    author: {
        username: string;
        image: string;
        id: string;
    };
    createdAt: string;
    togglePopup: any;
    aspectRatio: string;
    mentions: {
        link: string,
        text: string,
        version: number
    }[];
}
import { calculateTimeAgo, getMeta, processElements } from "@/lib/utils";
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
import { useEffect, useState } from "react";
import ReplyWhisper from "../forms/ReplyWhisper";
import { motion } from "framer-motion";
import router, { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"
import React from "react";
import { ExtractedElement } from "../plugins/Main";

export default function WhisperCardMain({ id, content, media, author, createdAt, togglePopup, aspectRatio, mentions }: Props) {

    const router = useRouter();

    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
    let sections = processElements(content)
    return (
        <>

            <div className="w-full relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >
                <div className="float-right  text-white text-small-regular font-light opacity-50 flex h-5">

                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>

                    <DropdownMenu modal={false} >
                        <DropdownMenuTrigger className=" cursor-pointer ">

                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: .01 }} className="ml-2 relative bottom-1.5 left-0  text-sm align-middle group hover:bg-[#6262624c] transition-all duration-100 rounded-full w-8 h-8  flex items-center justify-center">
                                <svg aria-label="Plus" role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="#fff">
                                    <title>Plus</title>
                                    <circle cx="12" cy="12" r="1.5"></circle>
                                    <circle cx="6" cy="12" r="1.5"></circle>
                                    <circle cx="18" cy="12" r="1.5"></circle>
                                </svg>


                            </motion.div>
                        </DropdownMenuTrigger>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, delay: .1 }}
                        >
                            <DropdownMenuContent className="w-48 mr-36 rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]">
                                <DropdownMenuGroup className="text-white text-[14px]">
                                    <DropdownMenuItem >
                                        Enregistrer
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem>
                                        Bloquer
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem className="!text-[rgb(255,48,64)]">
                                        Signaler
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem className="!text-[rgb(255,48,64)]">
                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </motion.div>
                    </DropdownMenu>


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
                    {content && (
                        <div className="relative bottom-1" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }} >

                            <div className="break-words max-w-lg whitespace-pre-wrap mt-1.5 inline-block" >
                                {sections.map((section, index) => (
                                    <span key={index} className={`text-white leading-[calc(1.4_*_1em)] overflow-y-visible overflow-x-visible max-w-full text-left relative block !text-[15px] text-small-regular font-normal  mb-0 ${index === 0 ? '' : 'mt-[1rem]'} whitespace-pre-line break-words `}>
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
                    {media && (
                        <div className="relative bottom-1" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }}>
                            <ImageClickAnim src={media} aspectRatio={aspectRatio} />
                        </div>
                    )}


                    <div className="relative right-1.5 ">
                        <div className="grid grid-cols-[36px_36px_36px] w-full" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }}>
                            <div
                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }}
                                        className="justify-center flex items-center scale-100 transition-transform duration-150 select-none list-none">

                                        <svg width="21" height="21" aria-label="J’aime" role="img" viewBox="0 0 24 22" >
                                            <title>J’aime</title>
                                            <path className=" fill-transparent stroke-2 stroke-white" d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z">
                                            </path>
                                        </svg>
                                        <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{
                                                    backgroundColor: "#6262624c",
                                                    scale: 1,
                                                    transition: { duration: 0.1 },
                                                }}
                                                transition={{ duration: 0.02, ease: "easeOut" }}
                                                className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            <div
                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }} onClick={togglePopup}
                                        className="justify-center flex items-center scale-100 transition-transform duration-150 select-none list-none">
                                        <svg width="21" height="21" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

                                            <path fill="#fff" d="M1.23621 11.1034C1.23621 5.36133 6.07454 0.763672 11.9862 0.763671C14.2426 0.763671 16.3321 1.4227 18.073 2.58609C20.8865 4.4319 22.7362 7.55126 22.7362 11.1034C22.7362 14.2061 21.3193 16.9815 19.0724 18.8609C19.1676 18.9782 19.2691 19.1076 19.371 19.2448C19.5794 19.5251 19.8007 19.8529 19.9732 20.1857C20.1354 20.4987 20.3019 20.9046 20.3019 21.3173C20.3019 22.0126 19.8872 22.5507 19.4096 22.8608C18.9306 23.1718 18.303 23.3178 17.6892 23.1894C16.4767 22.9358 14.9799 22.4797 13.8035 22.0941C13.2115 21.9001 12.6936 21.7216 12.3236 21.5916C12.1385 21.5265 11.9902 21.4735 11.8878 21.4367L11.8522 21.4238C8.48271 21.3843 5.46883 19.8566 3.55066 17.4735C2.10188 15.7237 1.23621 13.5057 1.23621 11.1034ZM12.2448 19.9706L12.2538 19.9739L12.2827 19.9844L12.3959 20.0254C12.4951 20.0611 12.6398 20.1128 12.8209 20.1764C13.1834 20.3038 13.6909 20.4787 14.2706 20.6687C15.4375 21.0511 16.869 21.4854 17.9963 21.7212C18.1926 21.7623 18.4196 21.7152 18.5926 21.6028C18.767 21.4896 18.8019 21.3739 18.8019 21.3173C18.8019 21.2726 18.7727 21.1292 18.6413 20.8757C18.5202 20.6419 18.3501 20.3858 18.1671 20.1394C17.986 19.8957 17.8031 19.6762 17.6647 19.5169C17.5958 19.4376 17.5388 19.3742 17.4996 19.3313C17.48 19.3098 17.4649 19.2936 17.4551 19.283L17.4444 19.2716L17.4422 19.2693C17.2927 19.1117 17.2188 18.897 17.2397 18.6808C17.2606 18.4646 17.3742 18.2681 17.5511 18.142C19.803 16.5383 21.2362 13.9796 21.2362 11.1034C21.2362 8.08942 19.669 5.42603 17.2477 3.83866L17.242 3.8349C15.7471 2.83523 13.9468 2.26367 11.9862 2.26367C6.84332 2.26367 2.73621 6.24818 2.73621 11.1034C2.73621 13.1396 3.46909 15.0246 4.70907 16.5205L4.71623 16.5292C6.37286 18.5897 9.01179 19.9246 11.9862 19.9246C12.0744 19.9246 12.162 19.9402 12.2448 19.9706C12.2447 19.9706 12.2448 19.9706 12.2448 19.9706Z" />
                                        </svg>
                                        <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{
                                                    backgroundColor: "#6262624c",
                                                    scale: 1,
                                                    transition: { duration: 0.1 },
                                                }}
                                                transition={{ duration: 0.02, ease: "easeOut" }}
                                                className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            <div
                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }}
                                        className="justify-center flex items-center scale-100 transition-transform duration-150 select-none list-none">

                                        <svg width="25" height="25" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                                            <g fill="none" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" transform="translate(1 2.5)">
                                                <path d="m12.5 9.5 3 3 3-3" />
                                                <path d="m8.5.5h3c2.209139 0 4 1.790861 4 4v8" />
                                                <path d="m6.5 3.5-3-3-3 3" />
                                                <path d="m10.5 12.5h-3c-2.209139 0-4-1.790861-4-4v-8" />
                                            </g>
                                        </svg>
                                        <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{
                                                    backgroundColor: "#6262624c",
                                                    scale: 1,
                                                    transition: { duration: 0.1 },
                                                }}
                                                transition={{ duration: 0.02, ease: "easeOut" }}
                                                className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}
