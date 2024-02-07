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
                <button className=" w-full outline-solid rounded-xl py-1 px-2 hover:bg-stone-900 transition-all duration-150 text-white border-2 border-zinc-600">Modifier le profil</button>
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
