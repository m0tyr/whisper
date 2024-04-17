"use client"
import * as z from "zod";
import Image from "next/image";
import { motion } from "framer-motion"
import { image } from "@nextui-org/react";
import { ToastAction } from "../ui/toast";
import { useToast } from "../ui/use-toast";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button";
import { useUploadThing } from "@/lib/uploadthing";
import { computeSHA256, getMeta, isBase64Image } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/whisper";
import ReplyWhisperCardMain from "../shared/ReplyWhisperCardMain";
import { ContentPlayer, extractElements, extractMention } from "../plugins/Main";
import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler } from "react";
import { GetLastestWhisperfromUserId, createComment } from "@/lib/actions/whisper.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { $getRoot } from "lexical";
import { DBImageData, ExtractedElement, PrevImageData } from "@/lib/types/whisper.types";
import DisplayMedia from "../shared/ui/DisplayMedia";
import { MAX_FILE_NUMBER, MAX_FILE_SIZE } from "@/lib/errors/post.errors";
import { s3GenerateSignedURL } from "@/lib/s3/actions";
interface Props {
  _id: string;
  user: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  whisper_to_reply: {
    id: string;
    currentUserId: string;
    parentId: string | null;
    content: ExtractedElement[];
    medias: DBImageData[];
    mentions: {
      link: string,
      text: string,
      version: number
    }[];
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
    }[]
    isComment?: boolean;
  }
  toclose: any;
  togglePopup: any;
  aspectRatio: any;
}

const ReplyWhisper = ({ user, whisper_to_reply, _id, toclose, togglePopup, aspectRatio }: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const [imageDataURL, setImageDataURL] = useState<string | null>(null);
  const [aspectratio, setAspectRatio] = useState("revert");
  const { startUpload } = useUploadThing('imageUploader')
  const [isSent, setIsSent] = useState(true);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [editableDivHeight, setEditableDivHeight] = useState(viewportHeight);
  const editableDiv = document.getElementById('editableDiv');
  const { toast } = useToast()
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const editorRef: any = useRef();
  if (editableDiv) editableDiv.scrollTop = editableDiv.scrollHeight;
  const [imageDataArray, setImageDataArray] = useState<PrevImageData[]>([]);

  const addImageData = (file: File, s3url: string | undefined, url: string, aspectRatio: string, width: string, isVideo: boolean) => {
    setImageDataArray([...imageDataArray, { file, url, aspectRatio, width, isVideo, s3url }]);
  };
  const removeImageData = (urlToRemove: string) => {
    console.log("URL to remove:", urlToRemove);
    setImageDataArray(prevImageDataArray => {
      const newArray = prevImageDataArray.filter(imageData => imageData.url !== urlToRemove);
      console.log("New array after filtering:", newArray);
      return newArray;
    });
  };
  useEffect(() => {
    const offsetY = window.scrollY;
    document.body.style.top = `-${offsetY}px`;
    document.body.classList.add('stop-scrolling');
    return () => {
      document.body.style.top = '';
      document.body.classList.remove('stop-scrolling');
      window.scrollTo(0, offsetY);
    };
  }, []);
  const WatchText = () => {
    var getText = document.getElementById("editable-span")?.textContent;
    var result = getText;
    if (result?.trim() === "" && !imageDataURL) {
      (document.getElementById('button') as HTMLButtonElement).disabled = true;
    } else {
      (document.getElementById('button') as HTMLButtonElement).disabled = false;
    }
  }
  const addImage = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement
    element.value = ''
  }
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
    addImageData: (file: File, s3url: string | undefined, url: string, aspectRatio: string, witdh: string, isVideo: boolean) => void
  ) => {
    e.preventDefault();


    const fileread = e.target.files?.[0] as File
    const CACHEDBLOBURL = URL.createObjectURL(fileread)
    const mimeType = fileread.type;
    console.log(mimeType)
    if (mimeType.includes('image')) {
      const img = new window.Image();
      img.src = CACHEDBLOBURL;
      img.onload = () => {
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        const aspectRatio = (width / height).toString();
        addImageData(fileread, undefined, CACHEDBLOBURL, aspectRatio, width.toString(), false);
      };
    } else if (mimeType.includes('video')) {
      const video = document.createElement('video');
      video.src = CACHEDBLOBURL;
      video.addEventListener('loadedmetadata', () => {
        const width = video.videoWidth;
        const height = video.videoHeight;
        const aspectRatio = (width / height).toString();
        addImageData(fileread, undefined, CACHEDBLOBURL, aspectRatio, width.toString(), true);
      });
    } else {
      console.error('Unsupported file type');
    }
    (document.getElementById('button') as HTMLButtonElement).disabled = false;
    console.log(imageDataArray)

  };



  const abortimage = (
    src: string,
  ) => {
    removeImageData(src)
    URL.revokeObjectURL(src)
    const stringifiedEditorState = JSON.stringify(
      editorRef.current.getEditorState().toJSON(),
    );
    const parsedEditorState = editorRef.current.parseEditorState(stringifiedEditorState);

    const editorStateTextString = parsedEditorState.read(() => $getRoot().getTextContent())
    if (imageDataArray.length === 0 && editorStateTextString === "") {
      (document.getElementById("button") as HTMLButtonElement).disabled = true;
      console.log("in")
    } else {
      (document.getElementById('button') as HTMLButtonElement).disabled = false;
    }
  }
  const handleResize = () => {
    const newViewportHeight = window.innerHeight;
    setViewportHeight(newViewportHeight);
    setEditableDivHeight(newViewportHeight);
  };
  window.onresize = handleResize
  var elem = document.getElementById('scroll');
  let isscrolled = false;
  if (elem && !isscrolled)
    elem.scrollTo({
      top: elem.scrollHeight,
      behavior: 'instant'
    });
  isscrolled = true;

  const handleInput = () => {
    if (editableDiv) {

      const scrollHeight = editableDiv.scrollHeight;
      editableDiv.style.overflowY = 'scroll';
      setEditableDivHeight(viewportHeight);

      editableDiv.style.overflowY = 'hidden';
      setEditableDivHeight(viewportHeight);

    }
  };

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      content: [] as ExtractedElement[],
      media: [] as DBImageData[],
      mentions: [],
      accoundId: _id,
    },
  });
  async function onSubmit(values: z.infer<typeof CommentValidation>) {
    setIsSent(!isSent);
    (document.getElementById('button') as HTMLButtonElement).disabled = true;
    (document.getElementById('button') as HTMLButtonElement).innerHTML = "";
    toclose();
    toast({
      title: "Publication...",
      duration: 20000,
    }
    )
    const temp = JSON.stringify(editorRef.current.getEditorState());
    const datas = JSON.parse(temp);

    const stringifiedEditorState = JSON.stringify(
      editorRef.current.getEditorState().toJSON(),
    );
    const parsedEditorState = editorRef.current.parseEditorState(stringifiedEditorState);

    const editorStateTextString = parsedEditorState.read(() => $getRoot().getTextContent())
    const extractedData = extractMention(datas);
    const extractedstuff = extractElements(datas)
    values.mentions = extractedData.mentions;
    values.content = extractedstuff
    if (imageDataArray.length >= 1) {
      if (imageDataArray.length > 4) {
        toast({
          title: MAX_FILE_NUMBER,
          duration: 3000,
        });
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
        return
      }
      let allFilesAuthorized = true;
      for (const imageData of imageDataArray) {
        if (imageData.file.size > 1048576 * 25) {
          allFilesAuthorized = false;
          break;
        }
      }
      if (allFilesAuthorized) {
        for (const imageData of imageDataArray) {
          const result = await s3GenerateSignedURL({
            userId: _id,
            fileType: imageData.file.type,
            fileSize: imageData.file.size,
            checksum: await computeSHA256(imageData.file),
          });

          if (result.failure !== undefined) {
            toast({
              title: result.failure,
              duration: 3000,
            });
            (document.getElementById('button') as HTMLButtonElement).disabled = false;
            break;
          }

          if (result.success) {
            const url = result.success.url;
            imageData.s3url = url.split("?")[0];
            await fetch(url, {
              method: "PUT",
              headers: {
                "Content-Type": imageData.file.type,
              },
              body: imageData.file,
            });
          }
        }
      } else {
        toast({
          title: MAX_FILE_SIZE,
          duration: 3000,
        });
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
        return
      }
    }
    const mongo_db_media_object = imageDataArray.map(obj => {
      const { url, file, ...rest } = obj;
      return rest;
    });

    values.media = mongo_db_media_object;

    await createComment({
      content: values.content,
      author: values.accoundId,
      media: values.media,
      mentions: values.mentions,
      caption: editorStateTextString,
      path: pathname,
    }, whisper_to_reply.id);


    toast({
      title: "Publié",
      duration: 2000,

    }
    )

    router.prefetch(pathname);
    router.push(pathname);

  }
  return (
    <>
      <Form {...form} >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01, delay: .1 }}
          >
            <div className="relative">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
              >

                <div className='fixed left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2 '
                  id="editableDiv"
                  onInput={handleInput}
                >

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }: { field: FieldValues }) => (
                      <FormItem className="[overflow-anchor:none;]" >

                        <div
                          className='bg-good-gray p-6 max-h-[calc(100svh - 133px)] min-h-40 w-basic  mx-auto break-words whitespace-pre-wrap 
                          select-text	overflow-y-auto overflow-x-hidden   rounded-t-2xl  border-x-[0.2333333px] border-t-[0.2333333px] border-x-border
                            border-t-border [overflow-anchor:auto;]  '
                          role="textbox"
                          style={{ maxHeight: editableDivHeight / 1.15, textAlign: 'left', }}
                          tabIndex={0}
                          id="scroll"
                          onInput={handleInput}
                        >
                          <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 '>
                            <div className="grid grid-cols-[48px_minmax(0,1fr)] grid-rows-[max-content] flex-1  ">
                              <WhisperCardLeft author={whisper_to_reply.author} id={user.id} isReply={true} />

                              <ReplyWhisperCardMain id={whisper_to_reply.id} content={whisper_to_reply.content} medias={whisper_to_reply.medias} author={whisper_to_reply.author}
                                createdAt={whisper_to_reply.createdAt} togglePopup={undefined} mentions={whisper_to_reply.mentions.map((mention: any) => ({
                                  link: mention.link,
                                  text: mention.text,
                                  version: mention.version
                                }))} />
                            </div>
                          </div>
                          <div className="grid grid-cols-[auto,1fr] ">

                            <div className="flex flex-col">
                              <Image src={user?.image} alt="logo" width={37} height={37} className="mt-1.5 rounded-full bg-good-gray align-self-start" />
                              <div className="thread-card_bar" />
                            </div>
                            <FormControl className="outline-none">
                              <div className="grid grid-cols-[auto,0.5fr]">
                                <div className='col-span-2 ml-2 '>
                                  <span className="text-white text-small-semibold mb-1">{user?.username}</span>
                                  <div className="relative">
                                    <ContentPlayer ref={editorRef} watchtext={WatchText} placeholder={"Répondre à " + whisper_to_reply.author.username + "..."} />
                                  </div>


                                  <FormField
                                    control={form.control}
                                    name="media"
                                    render={({ field }: { field: FieldValues }) => (
                                      <FormItem className=" space-y-4 ">
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
                                                      <svg width="21" height="21" aria-label="J’aime" role="img" viewBox="0 0 24 22" >
                                                        <title>J’aime</title>
                                                        <path className={'fill-transparent stroke-2 stroke-white'} d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z" >
                                                        </path>
                                                      </svg>
                                                    </div>
                                                  </motion.div>
                                                </div>
                                              </div>
                                              <div
                                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                                  <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }}
                                                    className="justify-center flex items-center scale-100 transition-transform duration-150 select-none list-none">


                                                    <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                                      <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        whileHover={{
                                                          backgroundColor: "#6262624c",
                                                          scale: 1,
                                                          transition: { duration: 0.01 },
                                                        }}
                                                        transition={{ duration: 0.01, ease: "easeOut" }}
                                                        className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                                      />
                                                    </div>
                                                    <div className="z-10 inset-0 pointer-events-none">

                                                      <svg aria-label="Répondre" role="img" viewBox="0 0 24 24" width={20} height={20} ><title>Répondre</title><path className=" fill-transparent stroke-2 stroke-white" d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"></path></svg>
                                                    </div>
                                                  </motion.div>
                                                </div>
                                              </div>
                                              <div
                                                className=" w-[36px] h-[36px] flex justify-center items-center" >
                                                <div className="relative w-full h-full no-underline flex justify-center items-center select-none mx-0 my-0 min-h-0 min-w-0 px-0 flex-row z-0 touch-manipulation box-border flex-shrink-0" tabIndex={0}>
                                                  <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: 0.02, ease: "easeOut" }}
                                                    className="justify-center flex items-center scale-100 transition-transform duration-150 select-none list-none">
                                                    <div className="w-full h-full absolute top-[-1px] left-[-0.25px]">
                                                      <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        whileHover={{
                                                          backgroundColor: "#6262624c",
                                                          scale: 1,
                                                          transition: { duration: 0.01 },
                                                        }}
                                                        transition={{ duration: 0.01, ease: "easeOut" }}
                                                        className="rounded-full w-[36px] h-[36px] absolute top-[calc(-1_*_(36px_-_100%)_/_2)] block left-[calc(-1_*_(36px_-_100%)_/_2)] select-none list-none"
                                                      />
                                                    </div>
                                                    <div className="z-10 inset-0 pointer-events-none">
                                                      <svg width="25" height="25" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                                                        <g className="stroke-1" fill="none" fillRule="evenodd" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" transform="translate(1 2.5)">
                                                          <path d="m12.5 9.5 3 3 3-3" />
                                                          <path d="m8.5.5h3c2.209139 0 4 1.790861 4 4v8" />
                                                          <path d="m6.5 3.5-3-3-3 3" />
                                                          <path d="m10.5 12.5h-3c-2.209139 0-4-1.790861-4-4v-8" />
                                                        </g>
                                                      </svg>
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

                      </FormItem>

                    )}
                  />


                  <div id="editableDiv"
                    className='items-center justify-center rounded-b-2xl flex
                  bg-good-gray  border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-b-border  w-basic h-20 mx-auto p-4'>

                    <Button id="button"
                      type="submit"
                      className="absolute right-6 bottom-6 bg-white rounded-full py-1 w-[79.5px] h-9 px-4 mt-2 hover:bg-slate-200
                 transition-all duration-150 !text-small-semibold text-black " disabled>
                      Publier
                    </Button>

                  </div>

                </div>
              </form>
            </div>
          </motion.div>

        </AnimatePresence>
      </Form >



    </>
  )


}


export default ReplyWhisper;