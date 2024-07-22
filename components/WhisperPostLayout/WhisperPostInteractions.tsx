"use client"
import { useWhisper } from "@/contexts/WhisperPostContext"
import { useSessionUser } from "@/hooks/useSessionUser";
import { useWhisperModal } from "@/hooks/useWhisperModal";
import { Whisper_to_Reply } from "@/lib/types/whisper.types";
import { motion } from "framer-motion";
import { useState } from "react";

const WhisperPostInteractions = () => {
    const { user } = useSessionUser();

    const {
        id,
        parentId,
        content,
        author,
        medias,
        createdAt,
        comments,
        isNotComment,
        mentions,
        like_info,
        ping
    } = useWhisper();
    const currentUserId = user?.id as string;
    const whisper_data = {
        id,
        parentId,
        content,
        author,
        medias,
        createdAt,
        comments,
        isNotComment,
        mentions,
        like_info,
        currentUserId,
    };

    const { launchReplyContext } = useWhisperModal()

    const liketrackerIDs = like_info.liketracker.map((item: { id: string }) => item.id);

    const isLiking = liketrackerIDs.includes(user?.id as string);

    const [isliking, setisliking] = useState(isLiking)
    const LikeWhisper = async () => {
/*         like_info.like_count = await likewhisper(user?.username as string, id, author.id)
 */        setisliking(!isliking)
    }

    return (
        <>
            <div className="relative right-1.5 mt-1">
                <div className="flex w-full" onClick={(e) => {
                    ping(e)
                }}>
                    <div
                        className="  w-max flex justify-center items-center" >
                        <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                            <motion.div whileTap={{ scale: 0.95 }} whileHover={{
                                backgroundColor: "rgb(34, 34, 34)",
                                scale: 1,
                                transition: { duration: 0 },
                            }} transition={{ duration: 0 }} onClick={LikeWhisper}
                                className={`rounded-full justify-center h-[90%] outline-none flex items-center scale-100 select-none list-none`}>
                                <div className="z-10 h-[36px] inset-0 pointer-events-none flex flex-row gap-1.5 px-2 justify-center items-center">
                                    <svg width="19" height="19" aria-label="J’aime" role="img" viewBox="0 0 26 22" >
                                        <title>J’aime</title>
                                        <path className={isliking ? 'fill-red-600' : 'fill-transparent stroke-[2] stroke-white'} d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z" >
                                        </path>
                                    </svg>
                                    {like_info.like_count !== 0 ? (
                                        <span className={`text-[13px] font-normal ${isliking ? ' text-red-600' : 'text-white'}`}>{like_info.like_count}</span>

                                    )
                                        : (
                                            null
                                        )
                                    }
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <div
                        className=" w-max flex justify-center items-center" >
                        <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                            <motion.div whileTap={{ scale: 0.95 }} whileHover={{
                                backgroundColor: "rgb(34, 34, 34)",
                                scale: 1,
                                transition: { duration: 0 },
                            }} transition={{ duration: 0 }}
                                onClick={() => {
                                    launchReplyContext(
                                        whisper_data as Whisper_to_Reply
                                    )
                                }}
                                className={`rounded-full justify-center h-[90%] outline-none flex items-center scale-100 select-none list-none`}>
                                <div className="z-10 inset-0 pointer-events-none flex flex-row gap-1.5 px-2 justify-center items-center">

                                    <svg aria-label="Répondre" role="img" viewBox="0 0 24 24" width={17} height={17} ><title>Répondre</title><path className=" fill-transparent stroke-2 stroke-white" d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>
                                    {!isNotComment ? (
                                    <span className="text-[13px] font-normal">{comments[0].posts.number}</span>
                                    )
                                        : (
                                            null
                                        )
                                    }

                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <div
                        className=" w-max flex justify-center items-center" >
                        <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                            <motion.div  whileTap={{ scale: 0.95 }} whileHover={{
                                backgroundColor: "rgb(34, 34, 34)",
                                scale: 1,
                                transition: { duration: 0 },
                            }} transition={{ duration: 0 }}
                            className="rounded-full justify-center h-[90%] outline-none flex items-center scale-100 select-none list-none">
                                <div className="z-10 inset-0 pointer-events-none flex flex-row gap-1.5 px-2 justify-center items-center">
                                    <svg width="22" height="22" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="mt-1">
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
        </>
    )
}

export default WhisperPostInteractions