'use client'
import { calculateTimeAgo } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Props {
    username: string;
    image: string;
    _id: string;
    caption: string;
    createdAt: string;
}

function ActivityCard({
    username,
    image,
    _id,
    caption,
    createdAt,
}: Props) {
    const router = useRouter();

    const ping = () => {
        router.push(`/${username}/post/${_id}`)
    }
    return (
        <>
            <div className="w-full mobile:max-w-[580px]"  >
                <div className="mt-1">
                    <div className="grid grid-cols-[48px_minmax(0,1fr)] gap-1.5">
                        <div className="relative block mx-auto mt-3 w-[34px] h-[34px] justify-center items-center">
                            <img src={image} alt="" className="rounded-full " />
                        </div>

                        <div className="flex py-1 max-w-full cursor-pointer ">
                            <div key={_id} className="flex-grow min-w-0 " onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    ping();
                                }
                            }}  >
                                <div className="flex-grow" onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        ping();
                                    }
                                }}>
                                    <span className=" max-w-full text-[15px] font-semibold">{username}</span>
                                    <span className="max-w-full ml-2 text-[14px] font-extralight opacity-65">{calculateTimeAgo(createdAt.toString())}</span>
                                </div>
                                <div className="flex-grow max-w-full cursor-text inline-block" >
                                    <span className="text-[15px]  font-light" onClick={(e) => {
                                        if (e.target === e.currentTarget) {
                                            ping();
                                        }
                                    }}>{caption}</span>
                                </div>
                                <hr className="border-x-2 opacity-20 rounded-full mt-[0.66rem] " />

                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </>
    )
}
export default ActivityCard