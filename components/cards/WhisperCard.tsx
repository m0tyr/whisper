"use client"
import WhisperCardMain from "../shared/WhisperCardMain";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import WhisperCardFooter from "../shared/WhisperCardFooter";
import { useEffect, useLayoutEffect, useState } from "react";
import ReplyWhisper from "../forms/ReplyWhisper";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton"
import { getMeta } from "@/lib/utils";

interface Props {
    user: any;
    _id: string;
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
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
        text:string,
        version:number
    }[];
}

const WhisperCard = ({
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
    mentions
}: Props) => {
    const whisperData = {
        id: id,
        content: content,
        author: author,
        media: media,
        createdAt: createdAt,
        comments: comments,
        isNotComment: isNotComment,
        mentions : mentions
    };
    const [showPopup, setShowPopup] = useState(false);

    const router = useRouter();


    const togglePopup = () => {
        setShowPopup(!showPopup);

    };
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }

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
                        mentions:mentions
                    }} _id={_id} user={user} toclose={togglePopup} togglePopup={undefined} aspectRatio={aspectRatio} />

                </>


            )}
            <div className="rounded-3xl hover:opacity-100 transition-all duration-300 py-1.5 mobile:px-0 px-2.5  w-full cursor-pointer relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >
                <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 relative' >
                    <div className="flex flex-row flex-1  gap-3 ">


                        <WhisperCardLeft author={whisperData.author} isNotComment={whisperData.isNotComment} id={id} />

                        <WhisperCardMain author={whisperData.author} id={whisperData.id} content={whisperData.content}
                            media={whisperData.media} createdAt={whisperData.createdAt} togglePopup={togglePopup} aspectRatio={aspectRatio} mentions={whisperData.mentions} />

                    </div>
                    {comments[0].posts.number == 0 ? <div></div> :
                        <WhisperCardFooter author={whisperData.author} comments={whisperData.comments} isNotComment={whisperData.isNotComment} id={id} />
                    }


                </div>
            </div>
            <hr className="border-x-2 opacity-20 rounded-full " />



        </>
    )
}


export default WhisperCard;