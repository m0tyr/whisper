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
    LikeWhisper : any;
    Isliking:boolean;
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

export default function WhisperCardMain({ id, content, media, author, createdAt, togglePopup, aspectRatio, mentions, LikeWhisper, Isliking }: Props) {

    const router = useRouter();
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
    const [isliking,setisliking] = useState(Isliking)
    const LikingAction = () =>{
        LikeWhisper()
        setisliking(!isliking)

    }
    let sections = processElements(content)

    return (
        <>

            <div className="w-full relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >
                <div className="float-right mt-[1.333333px]  text-white text-small-regular font-light opacity-50 flex h-5">

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
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }} onClick={LikeWhisper}
                                        className="justify-center outline-none flex items-center scale-100 transition-transform duration-150 select-none list-none">
                                        <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{
                                                    backgroundColor: "#6262624c",
                                                    scale: 1,
                                                    transition: { duration: 0.01 },
                                                }}
                                                transition={{ duration: 0.01, ease: "easeOut" }}
                                                className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                            />
                                        </div>
                                        <div className="z-10 inset-0 pointer-events-none">
                                            <svg width="21" height="21" aria-label="J’aime" role="img" viewBox="0 0 24 22" >
                                                <title>J’aime</title>
                                                <path className={Isliking ? 'fill-red-600' : 'fill-transparent stroke-2 stroke-white'} d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z" >
                                                </path>
                                            </svg>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            <div
                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }} onClick={togglePopup}
                                        className="justify-center flex items-center scale-100 transition-transform duration-150 select-none list-none">


                                        <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{
                                                    backgroundColor: "#6262624c",
                                                    scale: 1,
                                                    transition: { duration: 0.01 },
                                                }}
                                                transition={{ duration: 0.01, ease: "easeOut" }}
                                                className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                            />
                                        </div>
                                        <div className="z-10 inset-0 pointer-events-none">

                                            <svg aria-label="Répondre" role="img" viewBox="0 0 24 24" width={20} height={20} ><title>Répondre</title><path className=" fill-transparent stroke-2 stroke-white" d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            <div
                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }}
                                        className="justify-center flex items-center scale-100 transition-transform duration-150 select-none list-none">
                                        <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{
                                                    backgroundColor: "#6262624c",
                                                    scale: 1,
                                                    transition: { duration: 0.01 },
                                                }}
                                                transition={{duration: 0.01, ease: "easeOut" }}
                                                className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                            />
                                        </div>
                                        <div className="z-10 inset-0 pointer-events-none">
                                            <svg width="25" height="25" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                                                <g className="stroke-1" fill="none" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" transform="translate(1 2.5)">
                                                    <path d="m12.5 9.5 3 3 3-3" />
                                                    <path d="m8.5.5h3c2.209139 0 4 1.790861 4 4v8" />
                                                    <path d="m6.5 3.5-3-3-3 3" />
                                                    <path d="m10.5 12.5h-3c-2.209139 0-4-1.790861-4-4v-8" />
                                                </g>
                                            </svg>
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
