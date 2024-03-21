"use client"
import WhisperCardMain from "../shared/WhisperCardMain";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import WhisperCardFooter from "../shared/WhisperCardFooter";
import { useEffect, useState } from "react";
import ReplyWhisper from "../forms/ReplyWhisper";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { calculateTimeAgo, getMeta } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import ImageClickAnim from "../animations/ImageClickAnim";
interface Props {
    user: any;
    _id: string;
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: string;
    media: string;
    author: {
        username: string;
        image: string;
        id: string;
    };

    createdAt: string;
    comments: {
        posts: {
            number: number;
        }
        childrens: any;
    }[];
    isNotComment?: boolean;
    aspectRatio:string;
}

const ParentWhisperCard = ({
    user,
    _id,
    id,
    currentUserId,
    parentId,
    content,
    author,
    media,
    createdAt,
    comments,
    isNotComment,
    aspectRatio
}: Props) => {
    const whisperData = {
        id: id,
        content: content,
        author: author,
        media: media,
        createdAt: createdAt,
        comments: comments,
        isNotComment: isNotComment,
    };
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();


    const togglePopup = () => {
        setShowPopup(!showPopup);

    };
    const ping = () => {
        router.push(`/${author.username}/post/${id}`)
    }
  
    return (
        <>
            {showPopup && (
                <>
                    <motion.div
                        initial={{ opacity: 0, zIndex: 0 }}
                        animate={{ opacity: 1, zIndex: 51 }}
                        exit={{ opacity: 0 }}
                        transition={{}}
                        id='top'
                        className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full " onClick={togglePopup}></motion.div>

                    <ReplyWhisper whisper_to_reply={{
                        id: id,
                        currentUserId: currentUserId,
                        parentId: parentId,
                        content: content,
                        media: media,
                        author: {
                            username: author.username,
                            image: author.image,
                            id: author.id
                        },
                        createdAt: createdAt,
                        comments: comments,
                        isComment: isNotComment
                    }} _id={_id} user={user} toclose={togglePopup} togglePopup={undefined} aspectRatio={aspectRatio} />

                </>


            )}
            <div className="opacity-95 rounded-3xl hover:opacity-100 transition-all duration-300 py-1.5 mobile:px-0 px-2.5  w-full cursor-pointer relative" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    ping();
                }
            }} >
                <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 relative' >

                    <div className="flex flex-row flex-1  gap-3 ">


                        <>
                            {!isNotComment && (
                                <div className=" flex flex-col w-10  justify-center" onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        ping();
                                    }
                                }}>
                                    <Link href={`${author.username}`}>
                                        <Image src={author.image} alt="logo" width={37} height={37} className="cursor-pointer rounded-full" />

                                    </Link>
                                    <div className="big_thread-card_bar" />
                                </div>
                            )}
                            {isNotComment && (
                                <div className=" flex flex-col w-10  justify-center relative" onClick={(e) => {
                                    if (e.target === e.currentTarget) {
                                        ping();
                                    }
                                }}>
                                    <Link href={`${author.username}`} className="absolute top-0.5">
                                        <Image src={author.image} alt="logo" width={37} height={37} className=" cursor-pointer rounded-full" />

                                    </Link>




                                </div>
                            )}
                        </>

                        <div className="w-full relative pb-1.5" onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                ping();
                            }
                        }} >
                            <div className="float-right  text-white text-small-regular font-light opacity-50 flex h-5">

                                <p className="opacity-50">{calculateTimeAgo(createdAt.toString())}</p>
                                <DropdownMenu modal={false} >
                                    <DropdownMenuTrigger asChild className=" cursor-pointer ">

                                        <div className="ml-2 relative bottom-1.5 left-0  text-sm align-middle group hover:bg-[#6262624c] transition-all duration-100 rounded-full w-8 h-8  flex items-center justify-center">
                                            <svg aria-label="Plus" role="img" viewBox="0 0 24 24" className="h-5 w-5" fill="#fff">
                                                <title>Plus</title>
                                                <circle cx="12" cy="12" r="1.5"></circle>
                                                <circle cx="6" cy="12" r="1.5"></circle>
                                                <circle cx="18" cy="12" r="1.5"></circle>
                                            </svg>


                                        </div>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent className="w-48 mr-36 rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]">
                                        <DropdownMenuGroup className="text-white text-[14px]">
                                            <DropdownMenuItem >
                                                Enregistrer
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem>
                                                Bloquer
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem className="!text-[rgb(255,48,64)]">
                                                Signaler
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem className="!text-[rgb(255,48,64)]">
                                                Supprimer
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>
                            <div className="flex relative " onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    ping();
                                }
                            }}>
                                <Link href={`/${author.username}`} className="inline relative top-0">
                                    <p className="text-white text-small-semibold hover:underline inline relative bottom-0.5 ">{author.username}</p>
                                </Link>
                            </div>
                            {content && (
                                <div>
                                    <Link href={`/${author.username}/post/${id}`}>
                                        <div className=" break-words max-w-lg">


                                            <span className="text-white text-small-regular mt-1  whitespace-pre-line break-words inline">{content}</span>


                                        </div>
                                    </Link>
                                </div>

                            )}
                            {media && (
                                <ImageClickAnim src={media} aspectRatio={aspectRatio} />
                            )}



                            <div className="flex w-full justify-normal mt-2.5 gap-3" onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    ping();
                                }
                            }}>
                                <button >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24">
                                        <path fill="#fff" d="M12 4.435c-1.989-5.399-12-4.597-12 3.568 0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-8.118-10-8.999-12-3.568z" />
                                    </svg>
                                </button>
                                <button onClick={togglePopup} >
                                    <div className=" my--5 group hover:bg-[#6262624c] transition-all duration-100 rounded-full w-8 h-8  flex items-center justify-center">

                                        <svg width="21" height="21" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">

                                            <path fill="#fff" d="M1.23621 11.1034C1.23621 5.36133 6.07454 0.763672 11.9862 0.763671C14.2426 0.763671 16.3321 1.4227 18.073 2.58609C20.8865 4.4319 22.7362 7.55126 22.7362 11.1034C22.7362 14.2061 21.3193 16.9815 19.0724 18.8609C19.1676 18.9782 19.2691 19.1076 19.371 19.2448C19.5794 19.5251 19.8007 19.8529 19.9732 20.1857C20.1354 20.4987 20.3019 20.9046 20.3019 21.3173C20.3019 22.0126 19.8872 22.5507 19.4096 22.8608C18.9306 23.1718 18.303 23.3178 17.6892 23.1894C16.4767 22.9358 14.9799 22.4797 13.8035 22.0941C13.2115 21.9001 12.6936 21.7216 12.3236 21.5916C12.1385 21.5265 11.9902 21.4735 11.8878 21.4367L11.8522 21.4238C8.48271 21.3843 5.46883 19.8566 3.55066 17.4735C2.10188 15.7237 1.23621 13.5057 1.23621 11.1034ZM12.2448 19.9706L12.2538 19.9739L12.2827 19.9844L12.3959 20.0254C12.4951 20.0611 12.6398 20.1128 12.8209 20.1764C13.1834 20.3038 13.6909 20.4787 14.2706 20.6687C15.4375 21.0511 16.869 21.4854 17.9963 21.7212C18.1926 21.7623 18.4196 21.7152 18.5926 21.6028C18.767 21.4896 18.8019 21.3739 18.8019 21.3173C18.8019 21.2726 18.7727 21.1292 18.6413 20.8757C18.5202 20.6419 18.3501 20.3858 18.1671 20.1394C17.986 19.8957 17.8031 19.6762 17.6647 19.5169C17.5958 19.4376 17.5388 19.3742 17.4996 19.3313C17.48 19.3098 17.4649 19.2936 17.4551 19.283L17.4444 19.2716L17.4422 19.2693C17.2927 19.1117 17.2188 18.897 17.2397 18.6808C17.2606 18.4646 17.3742 18.2681 17.5511 18.142C19.803 16.5383 21.2362 13.9796 21.2362 11.1034C21.2362 8.08942 19.669 5.42603 17.2477 3.83866L17.242 3.8349C15.7471 2.83523 13.9468 2.26367 11.9862 2.26367C6.84332 2.26367 2.73621 6.24818 2.73621 11.1034C2.73621 13.1396 3.46909 15.0246 4.70907 16.5205L4.71623 16.5292C6.37286 18.5897 9.01179 19.9246 11.9862 19.9246C12.0744 19.9246 12.162 19.9402 12.2448 19.9706C12.2447 19.9706 12.2448 19.9706 12.2448 19.9706Z" />
                                        </svg>
                                    </div>
                                </button>
                                <button >

                                    <svg width="25" height="25" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="mt-1">

                                        <g fill="none" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" transform="translate(1 2.5)">

                                            <path d="m12.5 9.5 3 3 3-3" />

                                            <path d="m8.5.5h3c2.209139 0 4 1.790861 4 4v8" />

                                            <path d="m6.5 3.5-3-3-3 3" />

                                            <path d="m10.5 12.5h-3c-2.209139 0-4-1.790861-4-4v-8" />

                                        </g>

                                    </svg>
                                </button>


                            </div>

                            <div className="flex flex-row gap-3 mt-1.5">
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
                                        456 mentions J'aime
                                    </span>
                                </div>
                            </div>


                        </div>
                    </div>


                </div>

            </div>



        </>
    )
}


export default ParentWhisperCard;