"use client"
import { Whisper, WhisperData, useWhisper } from '@/contexts/WhisperPostContext';
import { ReactNode } from 'react';
import WhisperPostText from './components/WhisperPostLayout/WhisperPostText';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image'
import WhisperDropDownAction from '../shared/widgets/whisper_dropdown_actions';
import { calculateTimeAgo } from '@/lib/utils';
import WhisperPostMediaAttachments from './components/WhisperPostLayout/WhisperPostMediaAttachments';
import WhisperPostInteractions from './components/WhisperPostLayout/WhisperPostInteractions';

interface WhisperPostProps {
    children: ReactNode;
    post: WhisperData;
};

function WhisperPost({ children, post }: WhisperPostProps) {
    return (
        <Whisper value={post}>
            {children}
        </Whisper>
    );
}

WhisperPost.DefaultContainer = function WhisperPostDefaultContainer({ children }: { children: ReactNode }) {
    const { isNotComment, ping } = useWhisper();
    return (
        <>
            <div
                className="rounded-3xl hover:opacity-100 transition-all duration-300 pb-3 pt-1 mobile:px-[1.19rem] px-2.5 w-full cursor-pointer relative"
                onClick={(e) => {
                    ping(e);
                }}
            >
                <div className={`flex w-full flex-1 flex-col ${isNotComment ? '' : 'gap-2'} mb-1 relative`}>
                    <div className="relative outline-none">
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">

                            {children}
                        </div>
                    </div>
                </div>
            </div>
            <hr className="border-x-2 opacity-20 rounded-full" />
        </>
    );
};

WhisperPost.DefaultRightContainer = function WhisperPostDefaultRightContainer({ children }: { children: ReactNode }) {
    const { ping } = useWhisper()
    return (
        <>
            <div className=" mt-[6.2px] w-full relative" onClick={(e) => {
                ping(e);
            }} >
               {children}
            </div>
        </>
    );
};

WhisperPost.ViewingContainer = function WhisperPostViewingContainer() {
    const { isNotComment, ping, parentId } = useWhisper();
    return (
        <>
            <div className={`rounded-3xl hover:opacity-100 transition-all duration-300  pb-3 ${parentId === undefined ? 'pt-3.5' : ''}  mobile:px-[1.6rem] px-2.5   w-full cursor-pointer relative`} onClick={(e) => {
                ping(e)
            }} >
                <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 relative' >
                    <div className="flex flex-row flex-1  gap-3 ">
                        <div className="w-full relative" onClick={(e) => {
                            ping(e)
                        }} >
                            {/* Add content here */}
                        </div>
                    </div>
                </div>
            </div>
            {!isNotComment ?
                (
                    <>
                        <hr className="border-x-2 opacity-20 rounded-full " />
                    </>
                )
                :
                (
                    null
                )
            }

        </>
    );
};

WhisperPost.Text = function WhisperPostTexts() {
    return (<WhisperPostText />)
}

WhisperPost.HeaderCell = function WhisperPostHeaderCell() {
    const { author, createdAt, } = useWhisper()

    return (
        <>
                       <div className="flex flex-row mb-0.5  items-center gap-3">
                                <Link href={`/${author.username}`}>
                                    <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">{author.username}</p>
                                </Link>
                                <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">

                                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
                                    <WhisperDropDownAction />

                                </div>
                            </div>

        
        </>
    )
}

WhisperPost.HeaderCellOnlyMedia = function WhisperPostHeaderCellOnlyMedia() {
    const {
        author,
        createdAt,
    } = useWhisper();
    return (
        <>
        <div className="flex flex-row mt-2.5  items-center gap-3">
        <Link href={`/${author.username}`}>
            <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">{author.username}</p>
        </Link>
        <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">

            <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
            <WhisperDropDownAction />

        </div>
    </div>
    </>
    )
}

WhisperPost.LeftCell = function WhisperPostLeftCell() {
    const {
        isInReplyContext,
        author,
        isNotComment,
        ping,
        comments,
    } = useWhisper();
    return (
        <>
            {!isNotComment && (
                <div className={`${isInReplyContext ? "" : "mt-2 relative"} flex flex-col w-10`}>
                    <div className="flex w-10 mt-[3px] justify-center items-center" onClick={(e) => ping(e)}>
                        <Link href={`/${author.username}`}>
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={author.image} alt="logo" width={40} height={40} className="cursor-pointer rounded-full border-border border" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                    <div className={`${isInReplyContext ? "" : "relative left-[18px]"} thread-card_bar`} />
                    <div className=" relative bottom-[29px] mt-8 w-12 flex">
                        <div className="justify-center flex w-full relative">
                            {comments[0].childrens.length >= 10 ? (
                                <>
                                    <div className="w-[21px] h-[21px] flex absolute top-[-0.165rem] left-[0.265rem] ">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={21} height={21} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-[17px] h-[17px] flex absolute top-3 right-[0.675rem]">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={17} height={17} className="rounded-full border border-[#4747476e]" />
                                    </div>

                                    <div className="w-[13px] h-[13px] flex absolute top-[1.125rem] left-2">
                                        <Image src={comments[0].childrens[2].author.image} alt="logo" width={13} height={13} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                </>
                            ) : comments[0].childrens.length >= 2 ? (
                                <>
                                    <div className="w-[20px] h-[20px] flex absolute left-0.5 top-0">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-[20px] h-[20px] flex absolute top-0 right-3">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-double border-[#4747477e]" />
                                    </div>
                                </>
                            ) : comments[0].childrens.length === 1 ? (
                                <div className="w-[20px] h-[20px] flex absolute left-[0.565rem] top-0">
                                    <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
            {isNotComment && (
                <div className="mt-2 flex flex-col w-10">
                    <div className="flex-grow col-start-1 row-start-1 row-span-2 w-10 justify-center mt-[1px] relative" onClick={(e) => ping(e)}>
                        <Link href={`/${author.username}`} className="absolute top-0.5">
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={author.image} alt="logo" width={40} height={40} className="border-border border cursor-pointer rounded-full" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}

WhisperPost.Medias = function WhisperPostMedias() {
    return (<WhisperPostMediaAttachments />)
}

WhisperPost.InteractionElements = function WhisperPostInteractionElements() {
    return (<WhisperPostInteractions />)
}




export default WhisperPost;