"use client"
import React, { useState } from 'react';
import WhisperCardMain from "../shared/WhisperCardMain";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import WhisperCardFooter from "../shared/WhisperCardFooter";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useWhisper } from '@/contexts/whisper_post.provider';

const WhisperCard = () => {
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
        likewhisper,
        currentUserId,
    } = useWhisper();

    const router = useRouter();

    const liketrackerIDs = like_info.liketracker.map((item: any) => item.id);
    const isLiking = liketrackerIDs.includes(currentUserId);
    const [isliking, setisliking] = useState(isLiking);

    const ping = () => {
        router.push(`/${author.username}/post/${id}`);
    };

    const LikeWhisper = async () => {
        like_info.like_count = await likewhisper(currentUserId, id, author.id);
        setisliking(!isliking);
    };

    return (
        <>
            <div
                className="rounded-3xl hover:opacity-100 transition-all duration-300 pb-3 pt-1 mobile:px-4 px-2.5  w-full cursor-pointer relative"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        ping();
                    }
                }}
            >
                <div className={`flex w-full flex-1 flex-col ${isNotComment ? '' : 'gap-2'} mb-1 relative`}>
                    <div className="relative outline-none">
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">
                            <WhisperCardLeft author={author} isNotComment={isNotComment} id={id} />
                            <WhisperCardMain
                                whisper_data={{
                                    id,
                                    parentId,
                                    content,
                                    medias,
                                    mentions,
                                    author,
                                    createdAt,
                                    comments,
                                    isNotComment,
                                }}
                                author={author}
                                id={id}
                                content={content}
                                medias={medias}
                                createdAt={createdAt}
                                mentions={mentions}
                                LikeWhisper={LikeWhisper}
                                Isliking={isliking}
                            />
                        </div>
                        {comments[0].posts.number === 0 && like_info.like_count === 0 ? (
                            <div></div>
                        ) : (
                            <WhisperCardFooter
                                author={author}
                                comments={comments}
                                isNotComment={isNotComment}
                                id={id}
                                like_count={like_info.like_count}
                            />
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-x-2 opacity-20 rounded-full " />
        </>
    );
};

export default WhisperCard;
