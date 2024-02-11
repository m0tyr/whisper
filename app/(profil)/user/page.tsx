/* import { UserButton } from "@clerk/nextjs"; */
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    icons: {
        icon: "/icon.png",
    },
    title: "m0tyr • Whisper",
    description: "a social app concept"
}

export default function User() {
    return (
        <div >
            <div className=" my-10">

                    <Image src="./svgs/user.svg" alt="logo" width=
                        {85} height={85} className="opacity-85 hover:opacity-100  float-right gap-3  mb-10 " />


                <h2 className="text-white text-heading3-bold mt-2 ">www</h2>
                <p className=" text-slate-200 text-body1-normal ">m0tyr</p>
                <button className=" text-white opacity-50 text-small-semibold my-6 mx-2 hover:opacity-100 transition-all duration-175 ">2 K followers</button>
                <button className=" w-full outline-solid rounded-xl py-1 px-2 hover:bg-stone-900 transition-all duration-150 text-gray-2 border-2 border-zinc-600 mb-3">Modifier le profil</button>
                <div className=" text-center text-gray-2 h-16 flex items-center text-base-regular  ">
                <div className="w-48 border-b  border-solid border-white pb-4">
                <a href="./user" className="hover:text-white transition-all duration-150 text-white ">Whispers</a>
                </div>
                <div className="w-48 border-b  border-solid border-gray-2 pb-4">
                <a href="./replies" className="hover:text-gray transition-all duration-150">Réponses</a>
                </div>
                <div className="w-48 border-b  border-solid border-gray-2 pb-4">
                <a href="./reposts" className="hover:text-gray transition-all duration-150">Republications</a>
                </div>
                </div>
            </div>

            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
                <p className="text-white py-8 px-3">Yo les gars</p>
                <img src="./test.jpg" alt="" className="rounded-3xl" />
            </div>
            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
                < hr className="border-x-2" />
                <p className="text-white py-8 px-3">Yo les gars</p>

                <img src="./test.jpg" alt="" className="rounded-3xl" />
            </div>
            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
                <hr className="border-x-2" />
                <p className="text-white py-8 px-3">Yo les gars</p>

                <img src="./test.jpg" alt="" className="rounded-3xl" />
            </div>
            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
                < hr className="border-x-2" />
                <p className="text-white py-8 px-3">Yo les gars</p>

                <img src="./test.jpg" alt="" className="rounded-3xl" />
            </div>
            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-12">
                < hr className="border-x-2" />
                <p className="text-white py-8 px-3">Yo les gars</p>

                <img src="./test.jpg" alt="" className="rounded-3xl" />
            </div>
        </div>
    )
}
