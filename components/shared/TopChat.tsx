"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CreateWhisper from "../forms/CreateWhisper";
import { motion } from 'framer-motion';
import { useToast } from '../ui/use-toast';
import { ToastAction } from '../ui/toast';

const TopChat = ({ user, _id }: any) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
        console.log("test")

    };
    const { toast } = useToast()

    return (
        <>
            <div className="hidden md:block w-full">
                <div className="pb-5 pt-2 w-full flex flex-row">
                    <Link href={user.username}>
                    <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} >
                            <div className="w-[40px] h-[40px] flex">
                                <Image src={user.image} alt="logo" width={40} height={40} className="border-border border float-left gap-3 mt-0.5 cursor-pointer rounded-full" />
                            </div>
                        </motion.div>
                    </Link>
                    <input

                        name=""
                        placeholder="Commencer un Whisper.."
                        onClick={togglePopup}
                        readOnly
                        className="bg-navcolor w-full text-small-regular cursor-pointer rounded-full pl-3 pr-12 outline-none font text-gray-300 opacity-65 px-12"
                    />
                    <button

                        className="float-right right-2 bg-white text-black rounded-full py-1 h-9 px-4 transition-all duration-150 text-small-semibold mt-0.5 opacity-50" disabled>
                        Publier
                    </button>
                </div>
                <hr className="border-x-2 opacity-20 rounded-full " />
            </div>
            {showPopup && (
                <>
                    <motion.div
                        initial={{ opacity: 0, zIndex: 0 }}
                        animate={{ opacity: 1, zIndex: 51 }}
                        exit={{ opacity: 0 }}
                        transition={{}}
                        id='top'
                        className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full 
                         " onClick={togglePopup}></motion.div>
                    <CreateWhisper user={user} _id={_id} toclose={togglePopup} />

                </>
            )}
        </>
    );
};

export default TopChat;