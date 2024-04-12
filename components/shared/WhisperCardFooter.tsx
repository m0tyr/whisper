import Image from "next/image";

interface Props {
    id: string;
    author: {
        username: string;
        image: string;
        id: string;
    };
    comments: {
        posts: {
            number: number;
        }
        childrens: any;
    }[];
    isNotComment?: boolean;
    like_count: number;
}
import router, { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

const WhisperCardFooter = ({ id, author, comments, isNotComment, like_count }: Props) => {
    const whisperData = {
        author: author,
        comments: comments,
        isNotComment: isNotComment,
    };
    const router = useRouter();

    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
   


    return (
        <>
            {!isNotComment && (
                <div className="w-full h-full flex flex-row" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        ping();
                    }
                }}>
                    <div className="w-12 flex">
                        <div className="justify-center flex w-full relative">
                            {comments[0].childrens.length >= 10 ? (
                                <>
                                    <div className="w-5 absolute bottom-2 right-2.5">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-4 absolute left-1 top-1">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={16} height={16} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-3 absolute left-[1.125rem] top-3.5">
                                        <Image src={comments[0].childrens[2].author.image} alt="logo" width={12} height={12} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                </>
                            ) : comments[0].childrens.length >= 2 ? (
                                <>

                                    <div className="w-5 absolute left-0.5 top-0">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={18} height={18} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-5 absolute top-0 right-3 ">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={18} height={18} className="rounded-full border border-double border-[#4747477e]" />
                                    </div>
                                </>
                            ) : comments[0].childrens.length === 1 ? (
                                <>
                                <div className="w-5 absolute left-[0.565rem] top-0">
                                    <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                </div>
                                </>
                            ): (
                                null
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row gap-3 mb-0.5">
                        <div className="flex ">
                            {whisperData.comments[0]?.posts?.number > 1 ? (
                                <span className="text-gray-2 !text-[13.5px]">
                                    {whisperData.comments[0]?.posts?.number} réponses
                                </span>
                            ) : whisperData.comments[0]?.posts?.number === 1 ? (
                                <span className="text-gray-2 !text-[13.5px]">
                                    {whisperData.comments[0]?.posts?.number} réponse
                                </span>
                            ) : null}
                        </div>
                        <div className="flex ">
                            <span className="text-gray-2 !text-[13.5px]">
                                ·
                            </span>
                        </div>
                        <div className="flex ">
                            <span className="text-gray-2 !text-[13.5px]">
                            {like_count} mentions J'aime
                            </span>
                        </div>
                    </div>

                </div>
            )}
            {isNotComment && (
                <div className="mb-2" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        ping();
                    }
                }}>

                </div>
            )}
        </>

    )
}

export default WhisperCardFooter;