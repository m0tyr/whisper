
interface Props {
    id: string;
    author: {
        username: string;
        image: string;
        id: string;
    };

    isNotComment?: boolean;
    loadingstate?: boolean;
}
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"

const WhisperCardLeft = ({
    id,
    author,
    isNotComment,
    loadingstate
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
            <div className=" flex flex-col w-10  justify-center" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }}>
                <Link href={`${author.username}`}>
                            <Image src={author.image} alt="logo" width={36} height={36} className="cursor-pointer rounded-full" />

                        </Link>
               



                <div className="thread-card_bar" />


            </div>
        )}
        {isNotComment && (
            <div className=" flex flex-col w-10  justify-center relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }}>
                <Link href={`${author.username}`} className="absolute top-0.5">
                    <Image src={author.image} alt="logo" width={36} height={36} className=" cursor-pointer rounded-full" />

                </Link>




            </div>
        )}
    </>
    )

}
export default WhisperCardLeft;