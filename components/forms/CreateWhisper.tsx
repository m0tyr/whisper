"use client"
import * as z from "zod";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState, LegacyRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from 'framer-motion';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { WhisperValidation } from "@/lib/validations/whisper";
import {  createWhisper } from "@/lib/actions/whisper.actions";
import { computeSHA256, extractElements, extractMention } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { useToast } from "../ui/use-toast";
import DisplayMedia from "../shared/ui/DisplayMedia";
import { DBImageData, ExtractedElement, PrevImageData } from "@/lib/types/whisper.types";
import { s3GenerateSignedURL } from "@/lib/s3/actions";
import { MAX_FILE_NUMBER, MAX_FILE_SIZE } from "@/lib/errors/post.errors";
import ContentPlayer  from "../plugins/ContentPlayer";

interface Props {
  _id: string;
  user: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  toclose: any;
}




const CreateWhisper = ({ user, _id, toclose }: Props) => {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [text, setText] = useState<string>('');
  const pathname = usePathname();
  const ref: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null);
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
  const form = useForm<z.infer<typeof WhisperValidation>>({
    resolver: zodResolver(WhisperValidation),
    defaultValues: {
      content: [] as ExtractedElement[],
      media: [] as DBImageData[],
      mentions: [],
      accoundId: _id,
    },
  });



  const WatchText = (node: any) => {
    var getText = document.getElementById("editable_content")?.textContent || "";
    var result = getText;
    if (result?.trim() === "" && imageDataArray.length === 0) {
      (document.getElementById('button') as HTMLButtonElement).disabled = true;
    } else {
      (document.getElementById('button') as HTMLButtonElement).disabled = false;
    }
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

    const editorStateTextString = editorRef.current.getRootElement()?.textContent;
    if (imageDataArray.length === 0 && editorStateTextString === "") {
      (document.getElementById("button") as HTMLButtonElement).disabled = true;
      console.log("in")
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
  async function onSubmit(values: z.infer<typeof WhisperValidation>) {
    (document.getElementById('button') as HTMLButtonElement).disabled = true;
    toclose()
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

    const editorStateTextString: string = editorRef.current.getRootElement()?.textContent;
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

    await createWhisper({
      content: values.content,
      author: values.accoundId,
      media: values.media,
      mentions: values.mentions,
      caption: editorStateTextString,
      path: pathname,
    });

    /*     const lastWhisper = await GetLastestWhisperfromUserId({
      author: values.accoundId,
    }) */ // MAX CALL SIZE ERROR NEED TO FIX

    toast({
      title: "Publié",
      duration: 2000,

    }
    )
    router.prefetch(pathname);
    router.push(pathname);


  }
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [editableDivHeight, setEditableDivHeight] = useState(viewportHeight);
  const editableDiv = document.getElementById('editableDiv');
  const handleResize = () => {
    const newViewportHeight = window.innerHeight;
    setViewportHeight(newViewportHeight);
    setEditableDivHeight(newViewportHeight);
  };
  window.onresize = handleResize
  const handleInput = () => {
    if (editableDiv) {

      const scrollHeight = editableDiv.scrollHeight;
      editableDiv.style.overflowY = 'scroll';
      setEditableDivHeight(viewportHeight);

      editableDiv.style.overflowY = 'hidden';
      setEditableDivHeight(viewportHeight);

    }
  };
  const editorRef: any = useRef();

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

                <div className='fixed left-1/2 top-1/2  transform -translate-x-1/2 -translate-y-1/2 drop-shadow-xl '
                  id="editableDiv" ref={ref}

                  onInput={handleInput}

                >

                  <FormField
                    control={form.control}
                    name="content"

                    render={({ field }: { field: FieldValues }) => (
                      <FormItem >

                        <div
                          className='bg-good-gray p-6 max-h-[calc(100svh - 193px)] min-h-40 w-basic  mx-auto break-words whitespace-pre-wrap 
                          select-text	overflow-y-auto overflow-x-auto   rounded-t-2xl  border-x-[0.2333333px] border-t-[0.2333333px] border-x-border
                            border-t-border  '
                          style={{ maxHeight: editableDivHeight / 1.15, textAlign: 'left', }}
                          tabIndex={0}
                          id="editableDiv"
                          onInput={handleInput}
                        >


                          <div className="grid grid-cols-[auto,1fr] ">
                            <div className="flex flex-col">
                              <Image src={user?.image} alt="logo" width={38} height={38} className="mt-1.5 rounded-full bg-good-gray align-self-start" />
                              <div className="thread-card_bar" />
                            </div>
                            <FormControl className="outline-none">
                              <div className="grid grid-cols-[auto,0.5fr]">
                                <div className='col-span-2 ml-2 '>
                                  <span className="text-white text-small-semibold mb-1">{user?.username}</span>
                                  <div className="relative">
                                    <ContentPlayer ref={editorRef} watchtext={WatchText} placeholder={"Commencer un whisper..."} />
                                  </div>
                                  <FormField
                                    control={form.control}
                                    name="media"
                                    render={({ field }: { field: FieldValues }) => (
                                      <FormItem className=" space-y-[10px] ">
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

                      </FormItem>

                    )}
                  />


                  <div id="editableDiv"
                    className='items-center justify-center rounded-b-2xl 
                  bg-good-gray  border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-b-border  w-basic h-20 mx-auto p-4'>

                    <motion.button whileTap={{ scale: 0.95 }} transition={{ duration: .01 }}
                      id="button"
                      type="submit"
                      className="absolute right-6 bottom-6 bg-white rounded-full py-1 w-[79.5px] h-9 px-4 mt-2 hover:bg-slate-200 disabled:opacity-20
                 transition-all duration-150 !text-small-semibold text-black " disabled>

                      Publier
                    </motion.button>

                  </div>

                </div>
              </form>
              <div>
                <div id="parent" className=" fixed top-0  z-[51]"></div>
              </div>
            </div>
          </motion.div>

        </AnimatePresence>
      </Form >



    </>
  )

}


export default CreateWhisper;