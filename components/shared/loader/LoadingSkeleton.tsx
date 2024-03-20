"use client"


export default function LoadingSkeleton() {
    return (

            <div className="flex flex-col justify-center items-center w-screen h-screen bg-insanedark relative">

                <div
                    className="mx-auto"
                >
                    <img src="logo_resize.png" className=" w-28 h-28" />
                </div>
                <div
                   
                    className="absolute bottom-7"
                >
                <p className=" text-[#7c7c7c] text-body-bold  !text-[12px] !font-normal">Copyright © 2024 Whisper Inc. Tous droits réservés.</p>
                </div>

            </div>

    )
}