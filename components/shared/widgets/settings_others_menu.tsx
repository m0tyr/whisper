'use client'
import { motion } from "framer-motion";

export default function SettingsOthersMenu() {
    return (
        <div className=" pt-5">
            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className=" flex flex-row flex-shrink-0 justify-between relative pt-2 pb-3 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">

                    <span className="font-normal select-none text-[14px]">
                        A propos
                    </span>
                </div>
                <div className="flex flex-col relative justify-center ">
                    <span className="w-full justify-center items-center inline-block opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11px" width="11px" className=" justify-center items-center outline-none stroke-2" viewBox="0 0 185.343 185.343">
                            <g>
                                <g>
                                    <path className=" fill-white stroke-white stroke-2" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175    l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934    c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
                                </g>
                            </g>
                        </svg>
                    </span>
                </div>

            </motion.div>

            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className="flex flex-row flex-shrink-0 justify-between relative pt-4 pb-3 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">

                    <span className=" font-normal text-[14px] select-none ">
                        Aide
                    </span>
                </div>
                <div className="flex flex-col relative justify-center ">
                    <span className="w-full justify-center items-center inline-block opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11px" width="11px" className=" justify-center items-center outline-none stroke-2" viewBox="0 0 185.343 185.343">
                            <g>
                                <g>
                                    <path className=" fill-white stroke-white stroke-2" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175    l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934    c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
                                </g>
                            </g>
                        </svg>
                    </span>
                </div>
            </motion.div>

            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className="flex flex-row flex-shrink-0 justify-between relative pt-4 pb-6 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">

                    <span className=" font-normal select-none text-[14px]">
                        Langue
                    </span>
                </div>
                <div className="flex flex-col relative justify-center ">
                    <span className="w-full justify-center items-center inline-block opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11px" width="11px" className=" justify-center items-center outline-none stroke-2" viewBox="0 0 185.343 185.343">
                            <g>
                                <g>
                                    <path className=" fill-white stroke-white stroke-2" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175    l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934    c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
                                </g>
                            </g>
                        </svg>
                    </span>
                </div>
            </motion.div>
            
            <hr className="border-x-2 opacity-20 rounded-full " />
            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className="flex flex-row flex-shrink-0 justify-between relative pt-6 pb-4  cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">
                  
                    <span className=" font-normal select-none text-[14px] text-red-900">
                         Personne Bloqué
                    </span>
                </div>
                <div className="flex flex-col relative justify-center ">
                    <span className="w-full justify-center items-center inline-block opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11px" width="11px" className=" text-red-900 justify-center items-center outline-none stroke-2" viewBox="0 0 185.343 185.343">
                            <g>
                                <g>
                                    <path className=" fill-red-900 stroke-red-900 stroke-2" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175    l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934    c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
                                </g>
                            </g>
                        </svg>
                    </span>
                </div>

            </motion.div>
           
        </div>
    )
}