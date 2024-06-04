
interface Props {
    isReply?: boolean;
    isEmbedded?: boolean;
}
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useWhisper } from "@/contexts/WhisperPostContext";

const WhisperCardLeft = ({
    isReply,
    isEmbedded
}: Props) => {
    const {
        author,
        isNotComment,
        ping,
        comments,
    } = useWhisper();
    return (
        <>
            {!isNotComment && (
                <div className={`${isReply ? "" : "mt-2 relative"} flex flex-col w-10`}>
                    <div className="flex w-10 mt-[3px] justify-center items-center" onClick={(e) => ping(e)}>
                        <Link href={`/${author.username}`}>
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={author.image} alt="logo" width={40} height={40} className="cursor-pointer rounded-full border-border border" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                    <div className={`${isReply ? "" : "relative left-[18px]"} thread-card_bar`} />
                    <div className=" relative bottom-[29px] mt-8 w-12 flex">
                        <div className="justify-center flex w-full relative">
                            {comments[0].childrens.length >= 10 ? (
                                <>
                                    <div className="w-[21px] h-[21px] flex absolute top-[-0.165rem] left-[0.265rem] ">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={21} height={21} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-[17px] h-[17px] flex absolute top-3 right-[0.675rem]">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={17} height={17} className="rounded-full border border-[#4747476e]" />
                                    </div>

                                    <div className="w-[13px] h-[13px] flex absolute top-[1.125rem] left-2">
                                        <Image src={comments[0].childrens[2].author.image} alt="logo" width={13} height={13} className="rounded-full border border-[#4747476e]" />
                                    </div> 
                                </>
                            ) : comments[0].childrens.length >= 2 ? (
                                <>
                                    <div className="w-[20px] h-[20px] flex absolute left-0.5 top-0">
                                        <Image src={comments[0].childrens[1].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                    </div>
                                    <div className="w-[20px] h-[20px] flex absolute top-0 right-3">
                                        <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-double border-[#4747477e]" />
                                    </div>
                                </>
                            ) : comments[0].childrens.length === 1 ? (
                                <div className="w-[20px] h-[20px] flex absolute left-[0.565rem] top-0">
                                    <Image src={comments[0].childrens[0].author.image} alt="logo" width={20} height={20} className="rounded-full border border-[#4747476e]" />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
            {isNotComment && (
                <div className="mt-2 flex flex-col w-10">
                    <div className="flex-grow col-start-1 row-start-1 row-span-2 w-10 justify-center mt-[1px] relative" onClick={(e) => ping(e)}>
                        <Link href={`/${author.username}`} className="absolute top-0.5">
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className="col-start-3 ml-auto">
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={author.image} alt="logo" width={40} height={40} className="border-border border cursor-pointer rounded-full" />
                                </div>
                            </motion.div>
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default WhisperCardLeft;