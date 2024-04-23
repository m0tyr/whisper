import { motion } from "framer-motion";
import Link from "next/link";
import Image from 'next/image';
import { useState } from "react";
interface Props {
    id: string;
    image: string;
    name: string;
    username: string;
    isfollowing: boolean;
}

const SearchResult = ({ id, image, name, username, isfollowing }: Props) => {
    const [followtracker, setfollowtracker] = useState(isfollowing);
    return (
        <li key={id}>
            <div className="w-full mx-0 my-0 px-0 py-0 overflow-hidden flex items-center relative">
                <Link href={`/${username}`} className="w-full relative flex-shrink-0 basis-auto inline-block z-0 mx-0 my-0 px-0 py-0">
                    <div className=" flex flex-nowrap items-center mb--[6px] mt--5 mx--[6px]">
                        <div className=" min-w-0 flex flex-shrink flex-col relative z-0 flex-grow px-[6px]  box-border basis-0 max-w-full">
                            <div className=" relative right-1.5 w-[592px] flex justify-center items-center flex-row flex-grow ">
                                <div className="relative flex px-[14.5px] py-[14.5px]" >
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                        <div className="w-[40px] h-[40px] flex">
                                            <Image src={image} alt="pfp" width={40} height={40} className="rounded-full cursor-pointer border-border border" />
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="py-4 px-4 border-solid border-b border-b-border content-center pl-0 flex flex-grow justify-between items-center">
                                    <div className="flex flex-col justify-center pr-2 h-11">
                                        <div className="flex items-center ">
                                            <span
                                                className="inline-block text-left overflow-x-visible overflow-y-visible min-w-0 font-semibold text-[15px] whitespace-pre-line"
                                                style={{ wordBreak: 'break-word' }}
                                            >
                                                {username}
                                            </span>
                                        </div>
                                        <div className="flex items-center ">
                                            <span
                                                className="inline-block text-[rgb(119,119,119)] text-left overflow-x-visible overflow-y-visible min-w-0 font-normal text-[15px] whitespace-pre-line"
                                                style={{ wordBreak: 'break-word' }}
                                            >
                                                {name}
                                            </span>
                                        </div>
                                    </div>
                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: .01 }} className=" h-[34px] rounded-xl hover:bg-dark border-[.15px] border-[rgba(243,245,247,.13333)]  inline-flex w-[104px] justify-center items-center"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setfollowtracker(!followtracker);
                                        }}
                                    >
                                        <div
                                            className={`${followtracker ? ' text-[rgb(119,119,119)] font-extralight ' : 'text-white'}  !text-[14px] font-medium justify-center items-center`}

                                            style={{ cursor: 'pointer' }}
                                        >
                                            {!followtracker ? "Suivre" : "Suivi(e)"}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </li>
    )
}
export default SearchResult