
interface Props {
    id: string;
    author: {
        username: string;
        image: string;
        id: string;
    };

    isNotComment?: boolean;
    loadingstate?: boolean;
    isReply?: boolean;
}
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"

const WhisperCardLeft = ({
    id,
    author,
    isNotComment,
    loadingstate,
    isReply
}: Props) => {
    const router = useRouter();

    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
    if (loadingstate) return (
        <div className="flex flex-col items-center space-x-4 ">
            <Skeleton className="h-[37px] w-[37px] rounded-full" />

        </div>
    )
    return (<>
        {!isNotComment && (
            <div className={` ${isReply ? "" : "mt-2 pb-2 relative"} flex flex-col  w-10`}>

                <div className=" col-start-1 row-start-1 row-span-2 w-10  mt-[3px]   justify-center items-center" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        ping();
                    }
                }}>
                    <Link href={`${author.username}`}>
                        <Image src={author.image} alt="logo" width={37} height={37} className="cursor-pointer rounded-full" />

                    </Link>
                </div>
                <div className={` ${isReply ? "" : "relative left-[18px]"} thread-card_bar `} />
            </div>
        )}
        {isNotComment && (
            <div className="mt-2 flex flex-col w-10">
                <div className=" flex-grow  col-start-1 row-start-1 row-span-2 w-10 justify-center mt-[1px] relative" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        ping();
                    }
                }}>
                    <Link href={`${author.username}`} className="absolute top-0.5">
                        <Image src={author.image} alt="logo" width={37} height={37} className=" cursor-pointer rounded-full" />

                    </Link>





                </div>
            </div>
        )}
    </>
    )

}
export default WhisperCardLeft;