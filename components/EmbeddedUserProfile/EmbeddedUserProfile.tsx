'use client'
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
    myusername: string;
    suggestion: any;
    follow: any;
}
export default function EmbeddedUserProfile({ myusername, suggestion, follow }: Props) {
    const [followtracker, setfollowtracker] = useState(false);
    const router = useRouter()
    const redirectToProfil = () => {
        router.push(`/${suggestion.username}`)
    }
    return (
        <motion.div whileTap={{ scale: 0.97, scaleX: 0.98 }} transition={{ duration: .01 }}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    e.stopPropagation();
                    router.push(`/${suggestion.username}`)
                }
            }}
            className=" cursor-pointer flex justify-center items-center select-none">
            <div
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        e.stopPropagation();
                        router.push(`/${suggestion.username}`)
                    }
                }} className=" flex flex-col justify-center  items-center mr-2 w-[156px] h-[204px] pt-[12px] pb-[12px] px-[12px] bg-[#161616] rounded-2xl ">
                <motion.a href={`/${suggestion.username}`} whileTap={{ scale: 0.98 }} transition={{ duration: .01 }} className=" cursor-pointer flex w-[80px] select-none">
                    <img src={suggestion.image} alt="" className="rounded-full border border-border" width={80} height={80} />
                </motion.a>
                <div className=" pb-[11px] w-full pt-2 mx-auto text-center inline-flex my-auto ">
                    <div className="inline-flex flex-col w-full ">
                         <span onClick={() => {redirectToProfil()}} className="text-center cursor-pointer hover:underline inline-block">{suggestion.name}</span>
                         <span onClick={() => {redirectToProfil()}} className="text-center text-[14px] text-white opacity-60 font-extralight cursor-pointer hover:underline inline-block">{suggestion.username}</span> 

                    </div>

                </div>
                <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }} className={`${followtracker ? ' bg-[#1E1E1E] border border-border ' : 'bg-white'} cursor-pointer h-[34px] rounded-[10px] hover:bg-dark border-[.15px] border-[rgba(243,245,247,.13333)]  inline-flex w-[128px] justify-center items-center`}
                    onClick={(event) => {
                        event.preventDefault();
                        setfollowtracker(!followtracker);
                        follow(myusername, suggestion.username)
                    }}
                >
                    <div
                        className={`${followtracker ? ' text-[rgb(200,200,200)] font-normal ' : 'text-black font-medium '} select-none !text-[14px] justify-center items-center`}

                        style={{ cursor: 'pointer' }}
                    >
                        {!followtracker ? "Suivre" : "Suivi(e)"}
                    </div>
                </motion.div>
            </div>
        </motion.div>

    )
}