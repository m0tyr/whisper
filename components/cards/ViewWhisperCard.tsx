"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { calculateTimeAgo } from "@/lib/utils";
import WhisperDropDownAction from "../shared/widgets/whisper_dropdown_actions";
import { useWhisper } from "@/contexts/WhisperPostContext";
import WhisperPostText from "./components/WhisperPostLayout/WhisperPostText";
import WhisperPostInteractions from "./components/WhisperPostLayout/WhisperPostInteractions";
import WhisperPostMediaAttachments from "./components/WhisperPostLayout/WhisperPostMediaAttachments";


const ViewWhisperPost = () => {
    const {
        parentId,
        author,
        createdAt,
        isNotComment,
        ping
    } = useWhisper();
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
                            <div className="flex flex-row mb-2  items-center gap-3">
                                <Link href={`/${author.username}`}>
                                    <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                        <div className="w-[40px] h-[40px] flex">
                                            <Image src={author.image} alt="logo" width={40} height={40} className=" border-border border cursor-pointer rounded-full" />
                                        </div>
                                    </motion.div>
                                </Link>
                                <Link href={`/${author.username}`}>
                                    <p className="text-white text-small-semibold !text-[15px] hover:underline inline  ">{author.username}</p>
                                </Link>
                                <div className="absolute right-0  text-white text-small-regular font-light opacity-50 flex h-5">

                                    <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
                                    <WhisperDropDownAction />

                                </div>
                            </div>

                            <WhisperPostText  />

                            <WhisperPostMediaAttachments />
                          
                            <WhisperPostInteractions />
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
    )
}


export default ViewWhisperPost;