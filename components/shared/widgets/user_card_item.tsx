'use client'
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface Props {
    myusername:string;
    suggestion: any;
    follow:any;
}
export default function UserCardItem({myusername, suggestion, follow}:Props) {
    const [followtracker, setfollowtracker] = useState(false);
    return (
        <div className="flex justify-center items-center">
            <div className=" flex flex-col justify-center  items-center gap-1.5 mr-5 w-[165px] h-full p-4 border-border border rounded-xl ">
                <motion.a href={`/${suggestion.username}`} whileTap={{ scale: 0.98 }} transition={{ duration: .01 }} className=" cursor-pointer flex w-[85px] select-none">
                    <img src={suggestion.image} alt="" className="rounded-full border border-border" width={85} height={85} />
                </motion.a>
                <div className="flex">
                    <Link href={`/${suggestion.username}`} className="text-center cursor-pointer hover:underline ">{suggestion.name}</Link>
                </div>
                <div className="flex select-none">
                    <p className="text-[13.5px] font-extralight text-center">{suggestion.user_social_info.followers.length} followers</p>
                </div>
                <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }} className=" cursor-pointer h-[34px] rounded-xl hover:bg-dark border-[.15px] border-[rgba(243,245,247,.13333)]  inline-flex w-[104px] justify-center items-center"
                    onClick={(event) => {
                        event.preventDefault();
                        setfollowtracker(!followtracker);
                        follow(myusername,suggestion.username)
                    }}
                >
                    <div
                        className={`${followtracker ? ' text-[rgb(119,119,119)] font-extralight ' : 'text-white'} select-none !text-[14px] font-medium justify-center items-center`}

                        style={{ cursor: 'pointer' }}
                    >
                        {!followtracker ? "Suivre" : "Suivi(e)"}
                    </div>
                </motion.div>
            </div>
        </div>

    )
}