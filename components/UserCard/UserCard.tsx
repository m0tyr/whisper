"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";
import Link from "next/link";
import { useWhisperModal } from "@/hooks/useWhisperModal";

interface Props {
    myusername: string;
    name: string;
    username: string;
    image: string;
    bio: string;
    Isfollowing: boolean;
    follow_count: number;
    follow: any;
    fetchedtype: string;
}

function UserCard({
    myusername,
    name,
    username,
    image,
    bio,
    follow_count,
    Isfollowing,
    follow,
    fetchedtype
}: Props) {
    const {lauchUpdateProfilContext} = useWhisperModal()
    const [isfollowing, setisfollowing] = useState(Isfollowing)

    const addFollow = async () => {
        await follow(myusername, username);
        setisfollowing(!isfollowing);
    };
    return (
        <>
            <div className=" w-full">
                <div className="mt-3 mobile:mx-0 mx-3  py-1 px-6">
                    <div className="grid grid-cols-1 relative items-center columns-12">
                        <div className=" absolute bottom-10px col-start-1">
                            <h2 className="text-white text-heading3-bold !text-[24px]  ">{name}</h2>
                            <p className=" text-slate-200 text-body1-normal !text-[15px] ">{`${username}`}</p>
                        </div>
                        <div className=" col-start-2">
                            <motion.div whileTap={{ scale: 0.95 }} transition={{duration : 0.01}} className="col-start-3 ml-auto">
                                <div className="w-[85px] h-[85px] flex">
                                    <img src={image} alt="pfp" width={90} height={90} className="rounded-full cursor-pointer border-border border" />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-white text-small-medium font-normal !text-[14px] whitespace-pre-line">
                            {bio}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className=" text-white opacity-50 text-small-medium font-extralight !text-[15px] line-clamp-2 ">{follow_count} Followers</span>
                    </div>
                </div>
                <div>
                    <div className="mobile:mx-0 mx-3  py-3 px-5">
                        {myusername === username ? (
                            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0}}>
                                <button
                                    className="w-full rounded-[10px] h-[34px] hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3 !text-[15px] font-medium"
                                    onClick={() => {lauchUpdateProfilContext()}}
                                >
                                    Modifier le profil
                                </button>
                            </motion.div>
                        ) : (
                            <>
                                <div className="grid grid-cols-[1fr,1fr] gap-2">

                                    <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0}} className="col-start-1">
                                        <button
                                            className={`w-full rounded-[10px] h-[34px] ${isfollowing ? ' text-white' : 'bg-white text-black'} duration-0 hover:bg-dark border-[.15px] border-[rgba(243,245,247,.13333)] my-3 !text-[15px] font-medium`}
                                            onClick={addFollow}
                                        >
                                            {!isfollowing ? "Suivre" : "Suivi(e)"}
                                        </button>
                                    </motion.div>
                                    <motion.div whileTap={{ scale: 0.95 }} className="col-start-2">
                                        <button
                                            className="w-full rounded-[10px] h-[34px] hover:bg-dark transition-all duration-150 text-white border-[.15px] border-[rgba(243,245,247,.13333)] my-3 !text-[15px] font-medium"
                                        >
                                            Mentionner
                                        </button>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="text-center text-gray-2 h-full mt-0.5 mb-1 grid grid-cols-[1fr_1fr_1fr] w-full justify-center items-center text-base-regular ">
                        <motion.div className={`w-full h-12 border-b border-solid ${fetchedtype === 'whisper' ? 'border-[#F3F5F7] text-[#F3F5F7]' : 'border-gray-2'} block`}>
                            <Link href={`/${username}`} className="hover:text-gray  transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">
                                <motion.span whileTap={{ scale: 0.98, opacity: 0.7 }} transition={{ duration: 0.01 }}>
                                    Whispers
                                </motion.span>
                            </Link>
                        </motion.div>
                        <motion.div className={`w-full h-12 border-b border-solid ${fetchedtype === 'replies' ? 'border-white text-white' : 'border-[#777777]'} block`}>
                            <Link href={`/${username}/replies`} className="hover:text-gray transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">
                                <motion.span whileTap={{ scale: 0.98, opacity: 0.7 }} transition={{ duration: 0.01 }}>
                                    Réponses
                                </motion.span>
                            </Link>
                        </motion.div>
                        <motion.div className={`w-full h-12 border-b border-solid ${fetchedtype === 'reposts' ? 'border-white text-white' : 'border-gray-2'} block`}>
                            <Link href={`/${username}/reposts`} className="hover:text-gray transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">
                                <motion.span whileTap={{ scale: 0.98, opacity: 0.7 }} transition={{ duration: 0.01 }}>
                                    Republications
                                </motion.span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </div>
       
        </>
    )
}
export default UserCard