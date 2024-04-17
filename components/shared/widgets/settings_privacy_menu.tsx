'use client'
import { motion } from "framer-motion";

export default function SettingsPrivacyMenu() {
    return (
        <div className=" pt-5">
            <motion.div whileTap={{ scale: 0.995 }} transition={{ duration: 0.01 }} className=" flex flex-row flex-shrink-0 justify-between relative py-4 cursor-pointer">
                <div className="flex max-w-full flex-shrink-0 flex-grow">
                    <div className="flex pr-4 relative bottom-0.5">
                        <svg aria-label="" fill="currentColor" height="24px" role="img" viewBox="0 0 24 24" width="24px"><title></title>
                            <path d="M2.667 22v-1.355a5.271 5.271 0 0 1 5.271-5.271h8.124a5.271 5.271 0 0 1 5.271 5.271V22" fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></path>
                            <circle cx="12" cy="7.268" fill="none" r="5" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2"></circle>
                        </svg>
                    </div>
                    <span className="font-normal select-none text-[14px]">
                        Statut du profil
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
                    <div className="flex pr-2 pl-0.5 relative bottom-0.5 right-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className=" fill-white stroke-white stroke-[0.01]" viewBox="0 0 33 42.5" width={30} height={30}>
                            <path className=" fill-white stroke-white stroke-[0.01]" d="M16.3915385,23.4867692 C13.4746154,23.4867692 11.1115385,21.1236923 11.1115385,18.2090769 C11.1115385,15.2921538 13.4746154,12.9290769 16.3915385,12.9290769 C19.3061538,12.9290769 21.6692308,15.2921538 21.6692308,18.2090769 C21.6692308,21.1236923 19.3061538,23.4867692 16.3915385,23.4867692 M16.3938462,1.81753846 L16.3915385,1.81753846 C14.7807692,1.81753846 12.21,2.05523077 9.40846154,3.37292308 C8.19,3.94523077 5.84307692,5.23523077 3.77307692,7.74138462 C0.0807692308,12.2113846 0,17.2490769 0,18.2090769 C0.00461538462,25.0813846 4.36384615,29.3806154 5.07923077,30.0636923 C5.27307692,30.2483077 9.90692308,34.5452308 16.3915385,34.596 L16.5092308,34.596 C19.08,34.596 21.1453846,33.936 21.51,33.816 C23.4253846,33.186 24.8630769,32.2998462 25.8,31.6213846 C26.4253846,31.1921538 26.5846154,30.3221538 26.1530769,29.6967692 C25.8876923,29.3090769 25.4515385,29.1013846 25.0084615,29.1013846 C24.7384615,29.1013846 24.4661538,29.1798462 24.2284615,29.3436923 C23.3630769,29.9690769 21.9415385,30.8436923 20.0053846,31.3698462 C19.7353846,31.4436923 18.2930769,31.8267692 16.5207692,31.8267692 L16.3915385,31.8267692 C10.7861538,31.7690769 6.88384615,27.9636923 6.88384615,27.9636923 C2.85,24.036 2.77153846,19.056 2.77153846,18.2090769 C2.77153846,17.6067692 2.84769231,12.7952308 6.44307692,8.916 C7.87153846,7.37446154 9.39230769,6.48138462 10.3315385,6.01523077 C12.8353846,4.76676923 15.1361538,4.59138462 16.3915385,4.58907692 L16.4123077,4.58907692 C19.3223077,4.58907692 21.48,5.51676923 22.3846154,5.95753846 C22.9523077,6.23446154 25.3915385,7.47830769 27.4776923,10.2913846 C28.6384615,11.8536923 30.0115385,14.946 30.0115385,18.2067692 C30.0115385,19.7367692 28.7538462,20.9944615 27.2238462,20.9944615 C25.6961538,20.9944615 24.4384615,19.7367692 24.4384615,18.2067692 C24.4384615,16.5152308 24.2330769,15.5829231 23.2038462,13.9075385 C22.9015385,13.4136923 22.5969231,13.0698462 22.4146154,12.8667692 C21.2376923,11.5490769 19.9430769,10.9606154 19.4976923,10.776 C19.0292308,10.5798462 17.8984615,10.1621538 16.3915385,10.1598462 L16.3846154,10.1598462 C14.9861538,10.1598462 13.9407692,10.5198462 13.53,10.6744615 C13.1469231,10.8221538 12.2792308,11.1867692 11.3538462,11.9321538 C9.77769231,13.2083077 9.11307692,14.7290769 8.91461538,15.2252308 C8.7,15.7606154 8.34461538,16.8221538 8.34230769,18.2067692 C8.34230769,19.6998462 8.75307692,20.8306154 8.97692308,21.3544615 C9.23307692,21.966 9.89076923,23.2998462 11.2961538,24.4444615 C13.4423077,26.1890769 15.8076923,26.256 16.3846154,26.256 L16.3915385,26.256 C17.1138462,26.2536923 18.7384615,26.1567692 20.4507692,25.1552308 C22.1353846,24.1721538 23.0146154,22.8383077 23.3746154,22.2106154 C23.6976923,22.5198462 24.24,22.9675385 25.02,23.3067692 C25.35,23.4498462 26.1623077,23.7613846 27.2076923,23.7613846 L27.2238462,23.7613846 C29.4992308,23.7544615 31.0061538,22.2683077 31.1792308,22.0929231 C32.7207692,20.5213846 32.7784615,18.6036923 32.7807692,18.2067692 C32.8223077,13.0098462 29.8638462,8.75676923 29.1184615,7.85446154 C28.2646154,6.81830769 25.7515385,4.02830769 21.5030769,2.63215385 C20.5223077,2.30907692 18.7084615,1.81753846 16.3938462,1.81753846" />
                        </svg>
                    </div>
                    <span className=" font-normal select-none text-[14px]">
                        Mentions
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
                        Notifications
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
                        Compte Privée
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