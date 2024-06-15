import ContentPlayer from "@/components/plugins/ContentPlayer"
import { FormControl, FormField, FormItem } from "@/components/ui/form"
import DisplayMedia from "../ui/DisplayMedia"
import { motion } from "framer-motion"
import { FieldValues } from "react-hook-form"
import { PrevImageData } from "@/lib/types/whisper.types"
import { ChangeEvent, MutableRefObject } from "react"
import Image from "next/image";
import ReplyLayoutCell from "@/components/forms/ReplyWhisper/ReplyLayoutCell"
import { WhisperProvider } from "@/contexts/WhisperPostContext"
interface PostComposerProps {
    whisper_to_reply?: any;
    user: {
        username: string;
        image: string;
        id?: string;
    };
    form: any;
    editorRef: MutableRefObject<any>;
    editableDivHeight: number;
    WatchText: (node: any) => void;
    handleInput: () => void;
    imageDataArray: PrevImageData[];
    addImageData: (file: File, s3url: string | undefined, url: string, aspectRatio: string, width: string, height: string, isVideo: boolean) => void;
    abortimage: (src: string) => void;
    addImage: () => void;
    onInputClick: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void;
    inputRef: MutableRefObject<HTMLInputElement | null>;
    handleImage: (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void, addImageData: (file: File, s3url: string | undefined, url: string, aspectRatio: string, witdh: string, height: string, isVideo: boolean) => void) => void;
}

const PostComposer: React.FC<PostComposerProps> = ({ whisper_to_reply, user, handleInput, editableDivHeight, form, editorRef, WatchText, imageDataArray, addImageData, abortimage, addImage, onInputClick, inputRef, handleImage }) => {

    return (
        <>
            {whisper_to_reply ? (
                <div
                    className='bg-good-gray p-6 max-h-[calc(100svh - 133px)] min-h-40 w-basic  mx-auto break-words whitespace-pre-wrap 
   select-text	overflow-y-auto overflow-x-hidden   rounded-t-2xl  border-x-[0.2333333px] border-t-[0.2333333px] border-x-border
     border-t-border [overflow-anchor:auto;]  '
                    role="textbox"
                    style={{ maxHeight: editableDivHeight - 193 / 1.15, textAlign: 'left', }}
                    tabIndex={0}
                    id="scroll"
                    onInput={handleInput}
                >
                    <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 '>
                        <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1 ">

                            <WhisperProvider
                                value={{
                                    id: '', // No data needed here
                                    parentId: '', // No data needed here
                                    content: whisper_to_reply.content.map((content: any) => ({
                                        text: content.text,
                                        type: content.type
                                    })),
                                    medias: whisper_to_reply.medias.map((media: any) => ({
                                        s3url: media.s3url,
                                        aspectRatio: media.aspectRatio,
                                        width: media.width,
                                        height: media.height,
                                        isVideo: media.isVideo
                                    })),
                                    author: {
                                        image: whisper_to_reply.author.image,
                                        username: whisper_to_reply.author.username,
                                        id: whisper_to_reply.author.id
                                    },
                                    createdAt: whisper_to_reply.createdAt,
                                    like_info: { // No data needed here
                                        like_count: 0,
                                        liketracker: []
                                    },
                                    comments: [{ // No data needed here
                                        posts: {
                                            number: 0
                                        },
                                        childrens: { // No data needed here
                                            author: {
                                                image: '',
                                                username: '',
                                                id: ''
                                            },
                                            content: [],
                                            createdAt: ''
                                        }
                                    }],
                                    isNotComment: false,
                                    mentions: whisper_to_reply.mentions.map((mention: any) => ({
                                        link: mention.link,
                                        text: mention.text,
                                        version: mention.version
                                    })),
                                    isInReplyContext: true,
                                    isInViewingView: false,
                                    isOnlyMediaPost: whisper_to_reply.content && whisper_to_reply.content.length === 0,
                                    ViewportIndicator: "reply_modal",
                                    likewhisper: () => { },
                                    currentUserId: user.id as string
                                }}
                            >
                                <ReplyLayoutCell />
                            </WhisperProvider>
                        </div>
                    </div>
                    <div className="grid grid-cols-[auto,1fr] ">

                        <div className="flex flex-col">
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className=" mt-1 col-start-3 ml-auto">
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={user?.image} alt="logo" width={40} height={40} className=" rounded-full bg-good-gray align-self-start" />
                                </div>
                            </motion.div>
                            <div className="thread-card_bar" />
                        </div>
                        <FormControl className="outline-none">

                            <div className="grid grid-cols-[auto,0.5fr]">
                                <div className='col-span-2 ml-2 '>
                                    <span className="text-white text-small-semibold !text-[15px] mb-1">{user?.username}</span>
                                    <div className="relative">
                                        <ContentPlayer ref={editorRef} watchtext={WatchText} placeholder={"Répondre à " + whisper_to_reply.author.username + "..."} />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="media"
                                        render={({ field }: { field: FieldValues }) => (
                                            <FormItem className=" space-y-[10px]  ">
                                                {imageDataArray && (
                                                    <DisplayMedia medias={imageDataArray} abortimage={abortimage} />
                                                )}
                                                <FormControl className="outline-none">
                                                    <div className="relative right-1.5">
                                                        <div className="flex w-full">
                                                            <div
                                                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }} onClick={addImage}
                                                                        className="justify-center outline-none flex items-center scale-100 transition-transform duration-150 select-none list-none cursor-pointer">
                                                                        <div className="z-10 inset-0 pointer-events-none">
                                                                            <svg aria-label="Joindre un contenu multimédia" role="img" viewBox="0 0 24 24" className=" opacity-80" width={20} height={20}><title>Joindre un contenu multimédia</title><g>
                                                                                <path className=" opacity-60" clip-rule="evenodd" d="M2.00207 9.4959C1.65132 7.00019 1.47595 5.75234 1.82768 4.73084C2.13707 3.83231 2.72297 3.05479 3.50142 2.50971C4.38639 1.89005 5.63425 1.71467 8.12996 1.36392L10.7047 1.00207C13.2004 0.651325 14.4482 0.47595 15.4697 0.827679C16.3682 1.13707 17.1458 1.72297 17.6908 2.50142C17.9171 2.82454 18.0841 3.19605 18.2221 3.65901C17.7476 3.64611 17.2197 3.64192 16.6269 3.64055C16.5775 3.5411 16.5231 3.44881 16.4621 3.36178C16.0987 2.84282 15.5804 2.45222 14.9814 2.24596C14.3004 2.01147 13.4685 2.12839 11.8047 2.36222L7.44748 2.97458C5.78367 3.20841 4.95177 3.32533 4.36178 3.73844C3.84282 4.10182 3.45222 4.62017 3.24596 5.21919C3.01147 5.90019 3.12839 6.73209 3.36222 8.3959L3.97458 12.7531C4.15588 14.0431 4.26689 14.833 4.50015 15.3978C4.50083 16.3151 4.50509 17.0849 4.53201 17.7448C4.13891 17.4561 3.79293 17.1036 3.50971 16.6991C2.89005 15.8142 2.71467 14.5663 2.36392 12.0706L2.00207 9.4959Z" fill="currentColor" fill-rule="evenodd"></path>
                                                                                <g><g clip-path="url(#:r2:)">
                                                                                    <rect className=" opacity-60" fill="none" height="15.5" rx="3.75" stroke="currentColor" stroke-width="1.5" width="15.5" x="6.75" y="5.8894"></rect>
                                                                                    <path className=" opacity-60" d="M6.6546 17.8894L8.59043 15.9536C9.1583 15.3857 10.0727 15.3658 10.6647 15.9085L12.5062 17.5966C12.9009 17.9584 13.5105 17.9451 13.8891 17.5665L17.8181 13.6376C18.4038 13.0518 19.3536 13.0518 19.9394 13.6375L22.0663 15.7644" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path>
                                                                                    <circle className=" opacity-60" cx="10.75" cy="9.8894" fill="currentColor" r="1.25"></circle></g></g></g><defs><clipPath id=":r2:">
                                                                                        <rect fill="white" height="17" rx="4.5" width="17" x="6" y="5.1394"></rect>
                                                                                    </clipPath></defs></svg>
                                                                        </div>
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                            <input
                                                                id="file"
                                                                onChange={(e) => handleImage(e, field.onChange, addImageData)}
                                                                onClick={onInputClick}
                                                                ref={inputRef}
                                                                style={{ display: 'none' }}
                                                                accept="image/jpeg,image/png,video/mp4,video/quicktime"
                                                                multiple
                                                                type="file"
                                                            />
                                                        </div>
                                                    </div>


                                                </FormControl>

                                            </FormItem>

                                        )}
                                    />
                                </div>
                            </div>
                        </FormControl>
                    </div>
                </div>
            ) : (
                <div
                    className='bg-good-gray px-6 pt-6 pb-4 min-h-40 w-basic  mx-auto break-words whitespace-pre-wrap 
                select-text	overflow-y-auto overflow-x-auto rounded-t-2xl  border-x-[0.2333333px] border-t-[0.2333333px] border-x-border
                  border-t-border  '
                    style={{ maxHeight: editableDivHeight - 193 / 1.15, textAlign: 'left', }}
                    tabIndex={0}
                    id="editableDiv"
                    onInput={handleInput}
                >
                    <div className="grid grid-cols-[auto,1fr] ">
                        <div className="flex flex-col">
                            <motion.div whileTap={{ scale: 0.9 }} transition={{ duration: 0.01 }} className=" mt-1 col-start-3 ml-auto">
                                <div className="w-[40px] h-[40px] flex">
                                    <Image src={user?.image} alt="logo" width={40} height={40} className=" rounded-full bg-good-gray align-self-start" />
                                </div>
                            </motion.div>
                            <div className="thread-card_bar" />
                        </div>
                        <FormControl className="outline-none">

                            <div className="grid grid-cols-[auto,0.5fr]">
                                <div className='col-span-2 ml-2 '>
                                    <span className="text-white text-small-semibold !text-[15px] mb-1">{user?.username}</span>
                                    <div className="relative">
                                        <ContentPlayer ref={editorRef} watchtext={WatchText} placeholder={"Commencer un whisper..."} />
                                    </div>
                                    <FormField
                                        control={form.control}
                                        name="media"
                                        render={({ field }: { field: FieldValues }) => (
                                            <FormItem className=" space-y-[10px]  ">
                                                {imageDataArray && (
                                                    <DisplayMedia medias={imageDataArray} abortimage={abortimage} />
                                                )}
                                                <FormControl className="outline-none">
                                                    <div className="relative right-1.5">
                                                        <div className="flex w-full">
                                                            <div
                                                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                                                    <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }} onClick={addImage}
                                                                        className="justify-center outline-none flex items-center scale-100 transition-transform duration-150 select-none list-none cursor-pointer">
                                                                        <div className="z-10 inset-0 pointer-events-none">
                                                                            <svg aria-label="Joindre un contenu multimédia" role="img" viewBox="0 0 24 24" className=" opacity-80" width={20} height={20}><title>Joindre un contenu multimédia</title><g>
                                                                                <path className=" opacity-60" clip-rule="evenodd" d="M2.00207 9.4959C1.65132 7.00019 1.47595 5.75234 1.82768 4.73084C2.13707 3.83231 2.72297 3.05479 3.50142 2.50971C4.38639 1.89005 5.63425 1.71467 8.12996 1.36392L10.7047 1.00207C13.2004 0.651325 14.4482 0.47595 15.4697 0.827679C16.3682 1.13707 17.1458 1.72297 17.6908 2.50142C17.9171 2.82454 18.0841 3.19605 18.2221 3.65901C17.7476 3.64611 17.2197 3.64192 16.6269 3.64055C16.5775 3.5411 16.5231 3.44881 16.4621 3.36178C16.0987 2.84282 15.5804 2.45222 14.9814 2.24596C14.3004 2.01147 13.4685 2.12839 11.8047 2.36222L7.44748 2.97458C5.78367 3.20841 4.95177 3.32533 4.36178 3.73844C3.84282 4.10182 3.45222 4.62017 3.24596 5.21919C3.01147 5.90019 3.12839 6.73209 3.36222 8.3959L3.97458 12.7531C4.15588 14.0431 4.26689 14.833 4.50015 15.3978C4.50083 16.3151 4.50509 17.0849 4.53201 17.7448C4.13891 17.4561 3.79293 17.1036 3.50971 16.6991C2.89005 15.8142 2.71467 14.5663 2.36392 12.0706L2.00207 9.4959Z" fill="currentColor" fill-rule="evenodd"></path>
                                                                                <g><g clip-path="url(#:r2:)">
                                                                                    <rect className=" opacity-60" fill="none" height="15.5" rx="3.75" stroke="currentColor" stroke-width="1.5" width="15.5" x="6.75" y="5.8894"></rect>
                                                                                    <path className=" opacity-60" d="M6.6546 17.8894L8.59043 15.9536C9.1583 15.3857 10.0727 15.3658 10.6647 15.9085L12.5062 17.5966C12.9009 17.9584 13.5105 17.9451 13.8891 17.5665L17.8181 13.6376C18.4038 13.0518 19.3536 13.0518 19.9394 13.6375L22.0663 15.7644" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"></path>
                                                                                    <circle className=" opacity-60" cx="10.75" cy="9.8894" fill="currentColor" r="1.25"></circle></g></g></g><defs><clipPath id=":r2:">
                                                                                        <rect fill="white" height="17" rx="4.5" width="17" x="6" y="5.1394"></rect>
                                                                                    </clipPath></defs></svg>
                                                                        </div>
                                                                    </motion.div>
                                                                </div>
                                                            </div>
                                                            <input
                                                                id="file"
                                                                onChange={(e) => handleImage(e, field.onChange, addImageData)}
                                                                onClick={onInputClick}
                                                                ref={inputRef}
                                                                style={{ display: 'none' }}
                                                                accept="image/jpeg,image/png,video/mp4,video/quicktime"
                                                                multiple
                                                                type="file"
                                                            />
                                                        </div>
                                                    </div>


                                                </FormControl>

                                            </FormItem>

                                        )}
                                    />
                                </div>
                            </div>
                        </FormControl>
                    </div>
                </div>
            )}
        </>
    )
}

export default PostComposer;
