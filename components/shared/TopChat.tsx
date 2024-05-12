"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useToast } from '../ui/use-toast';
import { Modal } from './Modal';
import { useModal } from '@/hooks/useModal';

const TopChat = ({ user, _id }: any) => {
    const { toast } = useToast()
    const {
        togglePopup,
        opendismiss,
        showDismiss,
        showPopup,
    } = useModal()
    return (
        <>
            <div className="hidden md:block w-full">
                <div className="pb-3 pt-2 w-full flex flex-row">
                    <Link href={user.username}>
                        <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} >
                            <div className="w-[40px] h-[40px] flex">
                                <Image src={user.image} alt="logo" width={40} height={40} className="border-border border float-left cursor-pointer rounded-full" />
                            </div>
                        </motion.div>
                    </Link>
                    <input

                        name=""
                        placeholder="Commencer un Whisper.."
                        onClick={togglePopup(true)}
                        readOnly
                        className="bg-navcolor w-full text-small-regular cursor-pointer rounded-full pl-3 pr-12 outline-none font text-gray-300 opacity-65 px-12"
                    />
                    <button

                        className="float-right right-2 bg-white  rounded-full py-1 h-9 px-3.5 transition-all duration-150 mt-0.5 opacity-50" disabled>
                        <span className="font-semibold text-[15px] text-black justify-center items-center">
                            Publier
                        </span>
                    </button>
                </div>
                <hr className="border-x-2 opacity-20 rounded-full " />
            </div>
            <Modal type="create" _id={_id} user={user} togglePopup={togglePopup} opendismiss={opendismiss} showDismiss={showDismiss} showPopup={showPopup} />

        </>
    );
};

export default TopChat;