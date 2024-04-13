"use client"
import WhisperCardFooter from "../shared/WhisperCardFooter";
import { useEffect, useRef, useState } from "react";
import ReplyWhisper from "../forms/ReplyWhisper";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import ImageClickAnim from "../animations/ImageClickAnim";
import Image from "next/image";
import Link from "next/link";
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
import { calculateTimeAgo, getMeta, processElements } from "@/lib/utils";
import React from "react";
import { ExtractedElement } from "../plugins/Main";
import { likewhisper } from "@/lib/actions/whisper.actions";

interface Props {
    user: any;
    _id: string;
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: ExtractedElement[];
    media: string;
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
}

const ViewWhisperCard = ({
    user,
    _id,
    id,
    currentUserId,
    parentId,
    content,
    author,
    media,
    createdAt,
    comments,
    isNotComment,
    aspectRatio,
    mentions,
    like_info
}: Props) => {
    const whisperData = {
        id: id,
        content: content,
        author: author,
        media: media,
        createdAt: createdAt,
        comments: comments,
        isNotComment: isNotComment,

    };
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();


    const togglePopup = () => {
        setShowPopup(!showPopup);

    };
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
        like_info.like_count = await likewhisper(user.username, id)
        setisliking(!isliking)
    }

    let sections = processElements(content)

    return (
        <>
            {showPopup && (
                <>
                    <motion.div
                        initial={{ opacity: 0, zIndex: 0 }}
                        animate={{ opacity: 1, zIndex: 51 }}
                        exit={{ opacity: 0 }}
                        transition={{}}
                        id='top'
                        className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full " onClick={togglePopup}></motion.div>

                    <ReplyWhisper whisper_to_reply={{
                        id: id,
                        currentUserId: currentUserId,
                        parentId: parentId,
                        content: content,
                        media: media,
                        author: {
                            username: author.username,
                            image: author.image,
                            id: author.id
                        },
                        createdAt: createdAt,
                        comments: comments,
                        isComment: isNotComment,
                        mentions: mentions
                    }} _id={_id} user={user} toclose={togglePopup} togglePopup={undefined} aspectRatio={aspectRatio} />

                </>


            )}
            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 pb-1.5 mobile:px-0 px-2.5   w-full cursor-pointer relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >
                <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 relative' >

                    <div className="flex flex-row flex-1  gap-3 ">
                        <div className="w-full relative" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }} >

                            <div className="flex flex-row mb-2  items-center gap-3">
                                <Link href={`/${author.username}`}>
                                    <Image src={author.image} alt="logo" width={36} height={36} className=" cursor-pointer rounded-full" />
                                </Link>
                                <Link href={`/${author.username}`}>
                                    <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">{author.username}</p>
                                </Link>
                                <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">

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
                                            <DropdownMenuContent className="w-48 mr-36 rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px] ">
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
                            </div>

                            {content && (
                                <div className="relative bottom-1" >

                                    <div className="break-words max-w-lg whitespace-pre-wrap pt-[10px] cursor-auto">
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

                                </div>

                            )}
                            {media && (
                                <div className={`relative bottom-1 ${content && content.length !== 0 ? "" : "mt-5"} `} onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        ping();
                                    }
                                }}>
                                    <ImageClickAnim src={media} aspectRatio={aspectRatio} />
                                </div>
                            )}




                            <div className="relative right-1.5 mt-1">
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

                        </div>

                    </div>

                    {!isNotComment && (
                        <div className="w-full h-full flex flex-row" onClick={(e) => {
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
                            null
                        )
                    }
                    {like_info.like_count > 0 && isNotComment && (
                        <div className="w-full h-full flex flex-row" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }}>


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

            <hr className="border-x-2 opacity-20 rounded-full " />


        </>
    )
}


export default ViewWhisperCard;