"use client"
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import UpdateProfile from "../forms/UpdateProfil";

interface Props {
    name: string;
    username: string;
    image: string;
    id: string;
    bio: string;
    _id: any;

}

function UserCard({
    name,
    username,
    image,
    id,
    bio,
    _id
}: Props) {
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);

    };
    return (
        <>
            <div className=" w-[99%] mx-auto">
                <div className="my-3 mobile:mx-0 mx-3">
                    <div className="grid grid-cols-1 items-center columns-12">
                        <div className=" col-start-1">
                            <h2 className="text-white text-heading3-bold !text-[24px]  ">{name}</h2>
                            <p className=" text-slate-200 text-body1-normal !text-[15px] ">{`${username}`}</p>
                        </div>
                        <div className=" col-start-2">

                            <Image src={image} alt="pfp" width={85} height={85} className="rounded-full" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-white text-small-medium font-normal !text-[15px]">
                            {bio}
                        </span>
                    </div>
                    <div className="mt-3">
                        <span className=" text-white opacity-50 text-small-medium font-extralight !text-[15px] line-clamp-2 ">no data :/</span>
                    </div>
                </div>
                <div>
                    <div className="mobile:mx-0 mx-3">
                        <motion.div
                            whileTap={{ scale: 0.95 }}>
                            <button
                                className="w-full rounded-xl h-[34px] hover:bg-dark transition-all duration-150 text-white 
         border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] 
                             border-y-[rgba(243,245,247,.13333)] my-3 !text-[15px] font-medium" onClick={togglePopup}>
                                Modifier le profil
                            </button>
                        </motion.div>
                    </div>
                    <div className="text-center text-gray-2 h-full grid grid-cols-[1fr_1fr_1fr] w-full justify-center items-center text-base-regular ">
                        <div className="w-full h-12 border-b  border-solid border-white block">
                            <a href={`./${username}`} className="hover:text-gray text-white transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">Whispers</a>
                        </div>
                        <div className="w-full h-12 border-b  border-solid border-gray-2 block">
                            <a href={`./${username}/replies`} className="hover:text-gray transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">Réponses</a>
                        </div>
                        <div className="w-full  h-12 border-b  border-solid border-gray-2 block ">
                            <a href={`./${username}/reposts`} className="hover:text-gray transition-all duration-150 text-[15px] mx-auto my-auto px-0 py-2.5 flex justify-center items-center font-normal">Republications</a>
                        </div>
                    </div>
                </div>
            </div>
            {showPopup && (
                <>
                    <motion.div
                        initial={{ opacity: 0, zIndex: 0 }}
                        animate={{ opacity: 1, zIndex: 51 }}
                        exit={{ opacity: 0 }}
                        transition={{}}
                        id='top'
                        className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full " onClick={togglePopup}></motion.div>

                    <UpdateProfile toclose={togglePopup} _id={_id} user={{
                        id: id,
                        username: username,
                        name: name,
                        bio: bio,
                        image: image
                    }} />

                </>


            )}
        </>
    )
}
export default UserCard