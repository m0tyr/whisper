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
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const WhisperCardFooter = ({ id, author, comments, isNotComment, like_count }: Props) => {
    const whisperData = {
        author: author,
        comments: comments,
        isNotComment: isNotComment,
    };
    const prevLikeCountRef = useRef<number>(like_count);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [previoustate, setprevioustate] = useState(like_count)
    const router = useRouter();
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
    useEffect(() => {
        if (like_count !== prevLikeCountRef.current) {
            setIsAnimating(true);
            setprevioustate(prevLikeCountRef.current)
            const animationTimeout = setTimeout(() => {
                setIsAnimating(false);
            }, 550);

            prevLikeCountRef.current = like_count;

            return () => clearTimeout(animationTimeout);
        }

    }, [like_count]);
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
                                
                                    <div className="w-[20px] h-[20px] flex absolute bottom-2 right-2.5">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-[20px] h-[20px] flex absolute bottom-2 right-2.5">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={16} height={16} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-[20px] h-[20px] flex absolute bottom-2 right-2.5">
                                        <Image src={comments[0].childrens[2].author.image} alt="logo" width={12} height={12} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                </>
                            ) : comments[0].childrens.length >= 2 ? (
                                <>

                                    <div className="w-[20px] h-[20px] flex absolute left-0.5 top-0">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-[20px] h-[20px] flex absolute top-0 right-3 ">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-double border-[#4747477e]" />
                                    </div>
                                </>
                            ) : comments[0].childrens.length === 1 ? (
                                <>
                                    <div className="w-[20px] h-[20px] flex absolute left-[0.565rem] top-0">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                </>
                            ) : (
                                null
                            )}
                        </div>
                    </div>


                </div >
            )}

                    <div className="mb-5" onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            ping();
                        }
                    }}>

                    </div>
        </>

    )
}

export default WhisperCardFooter;