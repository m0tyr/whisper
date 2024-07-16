'use client'
import { motion } from "framer-motion";

export default function SettingsAccountMenu() {
    return (
        <div className=" pt-3">
            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className="flex flex-row px-2 py-2 rounded-xl  bg-gradient-to-r from-[#ffe0785d] via-[#f5f7621f] to-[#ffd64e15] flex-shrink-0 justify-between relative mb-2 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">
                    <div className="flex pr-2 justify-center items-center">
                        <img className=" drop-shadow-xl" src="/premium-logo.png" alt="premium-logo" width={40} height={40} />
                    </div>
                    <div className="flex justify-center items-center">
                        <span className=" bg-gradient-to-r from-[#ffdf78] via-[#f4f762] to-[#ffd64e] text-transparent bg-clip-text font-normal select-none text-[14px] justify-center items-center inline-block">
                            Souscrire à l'abonnement <p className=" drop-shadow-glow font-bold inline-block  bg-gradient-to-r from-[#ffc400] via-[#eef13b] to-[#ffe386] text-transparent bg-clip-text">Premium</p>
                        </span>
                    </div>


                </div>
                <div className="flex flex-col relative justify-center ">
                    <span className="w-full justify-center items-center inline-block opacity-60 ">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11px" width="11px" className="  justify-center items-center outline-none stroke-2" viewBox="0 0 185.343 185.343">
                            <g>
                                <g>
                                    <path className=" fill-[#ffdf78] stroke-[#ffdf78] stroke-2 " d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175    l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934    c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
                                </g>
                            </g>
                        </svg>
                    </span>
                </div>

            </motion.div>
            <hr className="border-x-2 opacity-20 rounded-full " />

            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className=" flex flex-row flex-shrink-0 justify-between relative pt-6 pb-4 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">
                    <div className="flex pr-4 relative bottom-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" viewBox="0 0 285.5 285.5">
                            <g id="XMLID_470_">
                                <path className=" fill-white stroke-white" id="XMLID_472_" d="M79.999,62.75c0,34.601,28.149,62.75,62.751,62.75s62.751-28.149,62.751-62.75S177.352,0,142.75,0   S79.999,28.149,79.999,62.75z" />
                                <path className=" fill-white stroke-white" id="XMLID_473_" d="M42.75,285.5h200c8.284,0,15-6.716,15-15c0-63.411-51.589-115-115-115s-115,51.589-115,115   C27.75,278.784,34.466,285.5,42.75,285.5z" />
                            </g>
                        </svg>
                    </div>
                    <span className="font-normal select-none text-[14px]">
                        Informations du compte
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

            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className="flex flex-row flex-shrink-0 justify-between relative py-4 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">
                    <div className="flex pr-3.5 relative bottom-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" viewBox="0 0 330 330" >
                            <g id="XMLID_486_">
                                <path className=" fill-white stroke-white" id="XMLID_487_" d="M165,330c63.411,0,115-51.589,115-115c0-29.771-11.373-56.936-30-77.379V85c0-46.869-38.131-85-85-85   S80.001,38.131,80.001,85v52.619C61.373,158.064,50,185.229,50,215C50,278.411,101.589,330,165,330z M180,219.986V240   c0,8.284-6.716,15-15,15s-15-6.716-15-15v-20.014c-6.068-4.565-10-11.824-10-19.986c0-13.785,11.215-25,25-25s25,11.215,25,25   C190,208.162,186.068,215.421,180,219.986z M110.001,85c0-30.327,24.673-55,54.999-55c30.327,0,55,24.673,55,55v29.029   C203.652,105.088,184.91,100,165,100c-19.909,0-38.651,5.088-54.999,14.028V85z" />
                            </g>
                        </svg>
                    </div>

                    <span className=" font-normal select-none text-[14px]">
                        Changez de mot de passe
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
                    <div className="flex pr-4 relative bottom-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" viewBox="0 0 285.5 285.5">
                            <g id="XMLID_222_">
                                <path className=" fill-white stroke-white" id="XMLID_223_" d="M40.186,62.75c0,23.666,18.367,43.109,41.594,44.857C74.397,94.306,70.186,79.012,70.186,62.75   s4.212-31.556,11.594-44.857C58.553,19.641,40.186,39.084,40.186,62.75z" />
                                <path className=" fill-white stroke-white" id="XMLID_224_" d="M101.053,139.389c-5.17-1.077-10.482-1.639-15.867-1.639c-42.801,0-77.622,34.821-77.622,77.623   c0,8.284,6.716,15,15,15h1.025C35.19,190.145,63.781,157.051,101.053,139.389z" />
                                <path className=" fill-white stroke-white" id="XMLID_225_" d="M162.936,125.5c34.601,0,62.75-28.149,62.75-62.75S197.537,0,162.936,0   c-21.093,0-39.774,10.473-51.157,26.479c-7.289,10.25-11.594,22.764-11.594,36.271s4.305,26.021,11.594,36.271   C123.162,115.027,141.844,125.5,162.936,125.5z" />
                                <path className=" fill-white stroke-white" id="XMLID_226_" d="M277.936,270.5c0-63.411-51.589-115-115-115c-8.643,0-17.063,0.965-25.165,2.781   c-38.121,8.543-69.149,36.066-82.606,72.092c-4.669,12.5-7.229,26.02-7.229,40.127c0,8.284,6.716,15,15,15h200   C271.221,285.5,277.936,278.784,277.936,270.5z" />
                            </g>
                        </svg>


                    </div>
                    <span className=" font-normal select-none text-[14px]">
                        Comptes
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
            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className="flex flex-row flex-shrink-0 justify-between relative pt-6 pb-4 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">
                    <span className=" font-normal text-[14px] select-none text-red-700">
                        Désactiver le compte
                    </span>
                </div>
                <div className="flex flex-col relative justify-center ">
                    <span className="w-full justify-center items-center inline-block opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" height="11px" width="11px" className=" fill-red-700 stroke-red-700 justify-center items-center outline-none stroke-2" viewBox="0 0 185.343 185.343">
                            <g>
                                <g>
                                    <path className=" fill-red-700 stroke-red-700 stroke-2" d="M51.707,185.343c-2.741,0-5.493-1.044-7.593-3.149c-4.194-4.194-4.194-10.981,0-15.175    l74.352-74.347L44.114,18.32c-4.194-4.194-4.194-10.987,0-15.175c4.194-4.194,10.987-4.194,15.18,0l81.934,81.934    c4.194,4.194,4.194,10.987,0,15.175l-81.934,81.939C57.201,184.293,54.454,185.343,51.707,185.343z" />
                                </g>
                            </g>
                        </svg>

                    </span>
                </div>
            </motion.div>
        </div>
    )
}