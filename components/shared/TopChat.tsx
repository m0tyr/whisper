"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useSessionUser } from '@/hooks/useSessionUser';
import { useWhisperModal } from '@/hooks/useWhisperModal';
import PostComposerButton from './widgets/composer_post_button';

const TopChat = () => {
    const [user] = useSessionUser();
    const { launchCreateContext } = useWhisperModal();

    const userImage = user?.image as string
    return (
        <>
            <motion.div whileTap={{ scale: 0.99 }} transition={{ duration: 0.01 }} className="  hidden md:block w-full py-1.5">
                <div className="pb-3 pt-2 w-full flex flex-row">
                    <Link href={`/${user?.username as string}`}>
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} >
                            <div className="w-[40px] h-[40px] flex">
                                <Image src={userImage} alt="logo" width={40} height={40} className="border-border border float-left cursor-pointer rounded-full" />
                            </div>
                        </motion.div>
                    </Link>
                    <input
                        name=""
                        placeholder="Commencer un Whisper.."
                        onClick={() => { launchCreateContext() }}
                        readOnly
                        className="bg-navcolor w-full text-small-regular cursor-pointer rounded-full pl-3 pr-12 outline-none font text-gray-300 opacity-65 px-12"
                    />
                    <PostComposerButton isFixed={false} />
                </div>
            </motion.div>

            <hr className="border-x-2 opacity-20 rounded-full " />

        </>
    );
};

export default TopChat;