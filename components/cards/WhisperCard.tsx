"use client"
import React, { useState } from 'react';
import WhisperCardMain from "../shared/WhisperCardMain";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import WhisperCardFooter from "../shared/WhisperCardFooter";
import { useRouter } from "next/navigation";
import { useWhisper } from '@/contexts/WhisperPostContext';

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
        ping
    } = useWhisper();


    const liketrackerIDs = like_info.liketracker.map((item: any) => item.id);
    const isLiking = liketrackerIDs.includes(currentUserId);
    const [isliking, setisliking] = useState(isLiking);
    const LikeWhisper = async () => {
        like_info.like_count = await likewhisper(currentUserId, id, author.id);
        setisliking(!isliking);
    };

    return (
        <>
            <div
                className="rounded-3xl hover:opacity-100 transition-all duration-300 pb-3 pt-1  mobile:px-[1.19rem] px-2.5  w-full cursor-pointer relative"
                onClick={(e) => {
                    ping(e)
                }}
            >
                <div className={`flex w-full flex-1 flex-col ${isNotComment ? '' : 'gap-2'} mb-1 relative`}>
                    <div className="relative outline-none">
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">
                            <WhisperCardLeft />
                            <WhisperCardMain       
                                author={author}
                                id={id}   
                                createdAt={createdAt}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <hr className="border-x-2 opacity-20 rounded-full " />
        </>
    );
};

export default WhisperCard;
