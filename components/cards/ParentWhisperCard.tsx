"use client"
import WhisperCardMain from "../shared/WhisperCardMain";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import WhisperCardFooter from "../shared/WhisperCardFooter";
import { useEffect, useRef, useState } from "react";

import dynamic from "next/dynamic";
const DynamicReplyWhisper = dynamic(() => import("../forms/ReplyWhisper"), {
    ssr: false,
})

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
import React from "react";
import { likewhisper } from "@/lib/actions/whisper.actions";
import WhisperCardMedia from "./ui/WhisperCardMedia";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";
import WhisperDropDownAction from "../shared/widgets/whisper_dropdown_actions";
import { Modal } from "../shared/Modal";
interface Props {
    user: any;
    _id: string;
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: ExtractedElement[];
    medias: DBImageData[];
    author: {
        username: string;
        image: string;
        id: string;
    };
    createdAt: string;
    comments: {
        posts: {
            number: number;
        }
        childrens: any;
    }[];
    isNotComment?: boolean;
    aspectRatio: string;
    mentions: {
        link: string,
        text: string,
        version: number
    }[];
    like_info: {
        like_count: number;
        liketracker: []
    }
    likewhisper: any;
}

const ParentWhisperCard = ({
    user,
    _id,
    id,
    currentUserId,
    parentId,
    content,
    author,
    medias,
    createdAt,
    comments,
    isNotComment,
    aspectRatio,
    mentions,
    like_info,
    likewhisper
}: Props) => {
    const whisperData = {
        id: id,
        content: content,
        author: author,
        media: medias,
        createdAt: createdAt,
        comments: comments,
        isNotComment: isNotComment,
    };


    const router = useRouter();
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
    const prevLikeCountRef = useRef<number>(like_info.like_count);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [previoustate, setprevioustate] = useState(like_info.like_count)
    useEffect(() => {
        if (like_info.like_count !== prevLikeCountRef.current) {
            setIsAnimating(true);
            setprevioustate(prevLikeCountRef.current)
            const animationTimeout = setTimeout(() => {
                setIsAnimating(false);
            }, 550);

            prevLikeCountRef.current = like_info.like_count;

            return () => clearTimeout(animationTimeout);
        }

    }, [like_info.like_count]);
    const liketrackerIDs = like_info.liketracker.map((item: { id: string }) => item.id);

    const isLiking = liketrackerIDs.includes(user.id);

    const [isliking, setisliking] = useState(isLiking)
    const LikeWhisper = async () => {
        like_info.like_count = await likewhisper(user.username, id, author.id)
        setisliking(!isliking)
    }
    let sections = processElements(content)

    return (
        <>
            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300  pb-3 pt-3.5 mobile:px-[1.6rem] px-2.5   w-full cursor-pointer relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >
                <div className={`flex w-full flex-1 flex-col  ${isNotComment ? '' : 'gap-2'} mb-1 relative`}>
                    <div className="relative outline-none">

                        <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">


                            <>
                                {!isNotComment && (
                                    <div className=" flex flex-col w-10">

                                        <div className=" col-start-1 row-start-1 row-span-2 w-10  mt-[3px]  justify-center" onClick={(e) => {
                                            if (e.target === e.currentTarget) {
                                                ping();
                                            }
                                        }}>
                                            <Link href={`${author.username}`}>
                                                <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} >
                                                    <div className="w-[40px] h-[40px] flex">
                                                        <Image src={author.image} alt="logo" width={40} height={40} className="border-border border float-left cursor-pointer rounded-full" />
                                                    </div>
                                                </motion.div>
                                            </Link>
                                        </div>
                                        <div className="thread-card_bar " />
                                    </div>
                                )}
                                {isNotComment && (
                                    <div className="mt-2 flex flex-col w-10">
                                        <div className=" flex-grow  col-start-1 row-start-1 row-span-2 w-10 justify-center mt-[1px] relative" onClick={(e) => {
                                            if (e.target === e.currentTarget) {
                                                ping();
                                            }
                                        }}>
                                            <Link href={`${author.username}`} className="absolute top-0.5">
                                                <Image src={author.image} alt="logo" width={37} height={37} className=" cursor-pointer rounded-full" />

                                            </Link>





                                        </div>
                                    </div>
                                )}
                            </>

                            <div className="w-full relative pb-1.5" onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    ping();
                                }
                            }} >
                                <div className="float-right  text-white text-small-regular font-light opacity-50 flex h-5">

                                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
                                    <WhisperDropDownAction />


                                </div>
                                <div className="flex relative " onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        ping();
                                    }
                                }}>
                                    <Link href={`/${author.username}`} className="inline relative top-0">
                                        <p className="text-white text-small-semibold hover:underline inline relative bottom-0.5 ">{author.username}</p>
                                    </Link>
                                </div>
                                {content && (
                                    <div>
                                        <Link href={`/${author.username}/post/${id}`}>
                                            <div className=" break-words max-w-lg">
                                                {sections.map((section, index) => (
                                                    <span key={index} className={`text-white leading-[calc(1.4_*_1em)] overflow-y-visible overflow-x-visible max-w-full text-left relative block !text-[15px] text-small-regular mb-0 ${index === 0 ? '' : 'mt-[1rem]'} whitespace-pre-line break-words`}>
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
                                        </Link>
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
                                    <div className={`relative w-[calc(100%_+_48px)] ml-[calc(-1_*_48px)] bottom-1 ${content && content.length !== 0 ? "" : "pt-5"}`} onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            ping();
                                        }
                                    }}>
                                        <WhisperCardMedia medias={medias} isReply={false} isMainView={false} />
                                    </div>
                                )}




                                <div className="relative right-1.5 mt-1 ">
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
                                                            <path className={isliking ? 'fill-red-600' : 'fill-transparent stroke-2 stroke-white'} d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z" >
                                                            </path>
                                                        </svg>
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
                                                            transition={{ duration: 0.01, ease: "easeOut" }}
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
                                {!isNotComment && (
                                    <div className="w-full flex flex-row" onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            ping();
                                        }
                                    }}>


                                        <div className="flex flex-row gap-3 mb-0.5">
                                            <div className="flex ">
                                                {whisperData.comments[0]?.posts?.number > 1 ? (
                                                    <span className="text-gray-2 !text-[13.5px]">
                                                        {whisperData.comments[0]?.posts?.number} réponses
                                                    </span>
                                                ) : whisperData.comments[0]?.posts?.number === 1 ? (
                                                    <span className="text-gray-2 !text-[13.5px]">
                                                        {whisperData.comments[0]?.posts?.number} réponse
                                                    </span>
                                                ) : null}
                                            </div>
                                            <div className="flex ">
                                                <span className="text-gray-2 !text-[13.5px]">
                                                    ·
                                                </span>
                                            </div>
                                            <div className="flex ">
                                                <div className=" flex flex-shrink-0 mx-0 my-0 px-0 py-0 items-stretchoverflow-y-hidden overflow-x-visible max-w-full relative ">

                                                    <span className="text-gray-2 overflow-y-hidden !text-[13.5px] inline-flex whitespace-pre relative">
                                                        <AnimatePresence>
                                                            <motion.div

                                                                key={like_info.like_count}
                                                                initial={false}
                                                                animate={{ y: isAnimating ? -20 : 0 }}
                                                                className={`flex-col flex text-clip whitespace-pre break-words text-left ${isAnimating ? "" : "!transform-none"}  h-[calc(1.4_*_1em)]`}
                                                            >
                                                                {isAnimating ? (
                                                                    <div>
                                                                        {previoustate}
                                                                    </div>
                                                                ) : null}
                                                                <div>
                                                                    {like_info.like_count}
                                                                </div>
                                                            </motion.div>
                                                        </AnimatePresence>

                                                        &nbsp;mentions J'aime
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </div >
                                )}
                                {
                                    isNotComment && (
                                        <div className="mb-2" onClick={(e) => {
                                            if (e.target === e.currentTarget) {
                                                ping();
                                            }
                                        }}>

                                        </div>
                                    )
                                }
                                {like_info.like_count > 0 && isNotComment && (
                                    <div className="w-full h-full flex flex-row" onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            ping();
                                        }
                                    }}>
                                        <div className="w-12 flex">
                                        </div>

                                        <div className="flex flex-row gap-3 mb-0.5">

                                            <div className="flex ">
                                                <div className=" flex flex-shrink-0 mx-0 my-0 px-0 py-0 items-stretchoverflow-y-hidden overflow-x-visible max-w-full relative ">

                                                    <span className="text-gray-2 overflow-y-hidden !text-[13.5px] inline-flex whitespace-pre relative">
                                                        <AnimatePresence>
                                                            <motion.div

                                                                key={like_info.like_count}
                                                                initial={false}
                                                                animate={{ y: isAnimating ? -20 : 0 }}
                                                                className={`flex-col flex text-clip whitespace-pre break-words text-left ${isAnimating ? "" : "!transform-none"}  h-[calc(1.4_*_1em)]`}
                                                            >
                                                                {isAnimating ? (
                                                                    <div>
                                                                        {previoustate}
                                                                    </div>
                                                                ) : null}
                                                                <div>
                                                                    {like_info.like_count}
                                                                </div>
                                                            </motion.div>
                                                        </AnimatePresence>

                                                        &nbsp;mentions J'aime
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                )

                                }


                            </div>
                        </div>

                    </div>

                </div>

            </div>



        </>
    )
}


export default ParentWhisperCard;