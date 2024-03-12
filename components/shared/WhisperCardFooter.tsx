import Image from "next/image";
interface Props {
    author: {
        username: string;
        image: string;
        id: string;
    };
    comments: {
        posts: {
            number: number;
        }
        author: {
            image: string;
        };
    }[];
    isNotComment?: boolean;
}

const WhisperCardFooter = ({ author, comments, isNotComment }: Props) => {
    const whisperData = {
        author: author,
        comments: comments,
        isNotComment: isNotComment,
    };
    return (
        <>
            {!isNotComment && (
                <div className="w-full h-full flex flex-row ">
                    <div className="w-12 h-10 flex">
                        <div className=" justify-center flex w-full relative">
                            <div className="w-5 absolute top-0 right-2.5">
                                <Image src={author.image} alt="logo" width={20} height={20} className="rounded-full" />
                            </div>
                            <div className="w-4 absolute left-0.5 top-2">
                                <Image src={author.image} alt="logo" width={16} height={16} className="rounded-full" />
                            </div>
                            <div className="w-3  absolute left-4 bottom-2">
                                <Image src={author.image} alt="logo" width={12} height={12} className="rounded-full" />
                            </div>
                        </div>

                    </div>
                    <div className="flex flex-row gap-3 mb-0.5">
                        <div className="flex justify-center items-center">
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
                        <div className="flex justify-center items-center">
                            <span className="text-gray-2 !text-[13.5px]">
                                ·
                            </span>
                        </div>
                        <div className="flex justify-center items-center">
                            <span className="text-gray-2 !text-[13.5px]">
                                456 mentions J'aime
                            </span>
                        </div>
                    </div>
                </div>
            )}
            {isNotComment && (
                <div className="mb-2">
                </div>
            )}
        </>

    )
}

export default WhisperCardFooter;