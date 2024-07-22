"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSessionUser } from '@/hooks/useSessionUser';
import { useWhisperModal } from '@/hooks/useWhisperModal';
import PostComposerButton from '../PostComposer/PostComposerButton';

const TopChat = () => {
    const { user } = useSessionUser();
    const { launchCreateContext } = useWhisperModal();
    return (
        <>
            <motion.div whileTap={{ scale: 0.99 }} transition={{ duration: 0.01 }} className=" cursor-text  hidden md:block w-full py-1.5">
                <div className="pb-2 pt-4 px-5 w-full flex flex-row">
                    {user ? (
                        <Link href={`/${user?.username as string}`}>
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} >
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={user?.image} alt="logo" width={40} height={40} className=" float-left cursor-pointer rounded-full" />
                                </div>
                            </motion.div>
                        </Link>
                    ) : (
                        <Link href="/">
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} >
                                <div className="w-[40px] h-[40px] flex rounded-full bg-[#141414]">
                                </div>
                            </motion.div>
                        </Link>
                    )
                    }

                    <input
                        name=""
                        placeholder="Commencer un Whisper.."
                        onClick={() => { launchCreateContext() }}
                        readOnly
                        className="bg-good-gray w-full text-small-regular cursor-text  rounded-full pl-3 pr-12 outline-none font text-gray-300 opacity-65 px-12"
                    />
                    <PostComposerButton isFixed={false} />
                </div>
            </motion.div>

            <hr className="border-x-2 opacity-20 rounded-full " />

        </>
    );
};

export default TopChat;