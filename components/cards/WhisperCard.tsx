"use client"
import WhisperCardMain from "../shared/WhisperCardMain";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import WhisperCardFooter from "../shared/WhisperCardFooter";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { DBImageData, ExtractedElement } from "@/lib/types/whisper.types";

import dynamic from "next/dynamic";
import { Modal } from "../shared/Modal";
import { useSessionUser } from "@/hooks/useSessionUser";
const DynamicReplyWhisper = dynamic(() => import("../forms/ReplyWhisper"), {
    ssr: false,
})

interface Props {
    id: string;
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

const WhisperCard = ({
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
    likewhisper
}: Props) => {
    const [user] = useSessionUser()
    const whisperData = {
        id: id,
        currentUserId: user?.id as string,
        parentId: parentId,
        content: content,
        medias: medias,
        mentions: mentions,
        author: author,
        createdAt: createdAt,
        comments: comments,
        isNotComment: isNotComment,
    };

    const router = useRouter();

    const liketrackerIDs = like_info.liketracker.map((item: { id: string }) => item.id);

    const isLiking = liketrackerIDs.includes(user?.id as string);

    const [isliking, setisliking] = useState(isLiking)

    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }

    const LikeWhisper = async () => {
        like_info.like_count = await likewhisper(user?.username as string, id, author.id)
        setisliking(!isliking)
    }

    return (
        <>
         
            
            <div className="rounded-3xl hover:opacity-100 transition-all duration-300 pb-3 pt-1  mobile:px-0 px-2.5  w-full cursor-pointer relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >
                <div className={`flex w-full flex-1 flex-col  ${whisperData.isNotComment ? '' : 'gap-2'} mb-1 relative`}>
                    <div className="relative outline-none">
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">


                            <WhisperCardLeft author={whisperData.author} isNotComment={whisperData.isNotComment} id={id} />

                            <WhisperCardMain whisper_data={whisperData} author={whisperData.author} id={whisperData.id} content={whisperData.content}
                                medias={whisperData.medias} createdAt={whisperData.createdAt} mentions={whisperData.mentions} LikeWhisper={LikeWhisper} Isliking={isliking} />

                        </div>
                        {comments[0].posts.number == 0 && like_info.like_count == 0 ? <div></div> :
                            <WhisperCardFooter author={whisperData.author} comments={whisperData.comments} isNotComment={whisperData.isNotComment} id={id} like_count={like_info.like_count} />
                        }
                    </div>

                </div>
            </div>
            <hr className="border-x-2 opacity-20 rounded-full " />



        </>
    )
}


export default WhisperCard;