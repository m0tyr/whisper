"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { useWhisper } from '@/contexts/WhisperPostContext';
import { calculateTimeAgo } from '@/lib/utils';

import WhisperDropDownAction from '../shared/widgets/whisper_dropdown_actions';
import WhisperPostInteractions
  from '../WhisperPostLayout/WhisperPostInteractions';
import WhisperPostMediaAttachments
  from '../WhisperPostLayout/WhisperPostMediaAttachments';
import WhisperPostText from '../WhisperPostLayout/WhisperPostText';

const ParentWhisperPost = () => {
    const {
        parentId,
        author,
        createdAt,
        isNotComment,
        ping,
    } = useWhisper();

    return (
        <>
            <div className={`opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 ${parentId === undefined ? 'pt-[18px]' : 'pt-1.5'} mobile:px-[1.6rem] px-2.5   w-full cursor-pointer relative`} onClick={(e) => {
                ping(e)
            }} >
                <div className={`flex w-full flex-1 flex-col  ${isNotComment ? '' : 'gap-2'} mb-1 relative`}>
                    <div className="relative outline-none">
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1">
                            <>
                                {!isNotComment && (
                                    <div className=" flex flex-col w-10">

                                        <div className=" col-start-1 row-start-1 row-span-2 w-10  mt-[3px]  justify-center" onClick={(e) => {
                                            ping(e)
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
                                            ping(e)
                                        }}>
                                            <Link href={`${author.username}`} className="absolute top-0.5">
                                                <Image src={author.image} alt="logo" width={37} height={37} className=" cursor-pointer rounded-full" />

                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </>

                            <div className="w-full relative pb-1.5" onClick={(e) => {
                                ping(e)
                            }} >
                                <div className="float-right relative  text-white text-small-regular font-light opacity-50 flex h-5 top-1">

                                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
                                    <WhisperDropDownAction />
                                </div>
                                <div className="flex relative top-0.5 mb-0.5 " onClick={(e) => {
                                    ping(e)
                                }}>
                                    <Link href={`/${author.username}`} className="inline relative top-0">
                                        <p className="text-white text-small-semibold !text-[15px] hover:underline inline relative bottom-0.5 ">{author.username}</p>
                                    </Link>
                                </div>
                                <WhisperPostText />
                                <WhisperPostMediaAttachments />
                                <WhisperPostInteractions />
                            </div>
                        </div>

                    </div>

                </div>

            </div>



        </>
    )
}


export default ParentWhisperPost;