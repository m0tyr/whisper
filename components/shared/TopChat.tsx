"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CreateWhisper from "../forms/CreateWhisper";

const TopChat = ({ user, _id }: any) => {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);

    };

    return (
        <>

            <div className="mt-2 mb-3.5 ">
                <Link href="/user">
                    <Image src={user.image} alt="logo" width={37} height={37} className="opacity-85 hover:opacity-100 transition-all duration-300 float-left gap-3 mt-0.5 cursor-pointer rounded-full" />
                </Link>
                <input

                    name=""
                    placeholder="Commencer un Whisper.."
                    onClick={togglePopup}
                    readOnly
                    className="bg-navcolor text-small-regular rounded-full pl-3 pr-12 pt-3 outline-none font text-gray-300 opacity-65 px-12"
                />
                <button className="float-right right-2 bg-white rounded-full py-1 h-9 px-4 transition-all duration-150 text-small-semibold mt-0.5 opacity-50" disabled>
                    Publier
                </button>
            </div>
            {showPopup && (
                <>
                    <div className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 z-40 w-full transition-all duration-100" onClick={togglePopup}></div>

                    <CreateWhisper user={user} _id={_id} />

                </>
            )}
        </>
    );
};

export default TopChat;