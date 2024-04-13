"use client"

import * as z from "zod";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler, LegacyRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from 'usehooks-ts'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { $generateHtmlFromNodes } from '@lexical/html';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";



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
import { WhisperValidation } from "@/lib/validations/whisper";
import { useUploadThing } from "@/lib/uploadthing";
import { image } from "@nextui-org/react";
import { GetLastestWhisperfromUserId, createWhisper } from "@/lib/actions/whisper.actions";
import { getMeta, isBase64Image } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { motion } from "framer-motion"
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { $createMentionNode, MentionNode } from "../plugins/MentionsPlugin/MentionNode";
import { ContentPlayer, ExtractedElement, extractElements, extractMention } from "../plugins/Main";
import { $createTextNode, $getRoot, $getSelection, TextNode } from "lexical";





const CreateWhisper = ({ user, _id, toclose }: Props) => {

  const [files, setFiles] = useState<File[]>([]);
  const [isSent, setIsSent] = useState(true);
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null);
  const { startUpload } = useUploadThing('imageUploader')
  const filesTracker = useRef<File[]>([]);
  const router = useRouter();
  const [imageDataURL, setImageDataURL] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState("revert");
  const [text, setText] = useState<string>('');
  const debouncedText = useDebounceCallback(setText, 500);
  const pathname = usePathname();
  const ref: LegacyRef<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const addImageDataURL = (newImageDataUrl: string) => {
    setImageDataURL([...imageDataURL, newImageDataUrl]);
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
      media: "",
      mentions: [],
      accoundId: _id,
    },
  });



  const WatchText = (node: any) => {
    var getText = document.getElementById("editable_content")?.textContent || "";
    var result = getText;
    setvalues(result);
    if (result?.trim() === "" && !imageDataURL) {
      (document.getElementById('button') as HTMLButtonElement).disabled = true;
    } else {
      (document.getElementById('button') as HTMLButtonElement).disabled = false;
    }
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles).slice(0, 4);
      filesTracker.current = newFiles;
      console.log(filesTracker.current);
      fieldChange(JSON.stringify(newFiles));
    }
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        getMeta(imageDataUrl, (err: any, img: any) => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          const arvalue = width / height;
          const ar = arvalue.toString();
          setAspectRatio(ar);
        });
        addImageDataURL(imageDataUrl);
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };


  const abortimage = (
    src: string,
    fieldChange: (value: string) => void
  ) => {
    fieldChange("");
    setAspectRatio("revert");
    addImageDataURL(src);
    console.log(filesTracker)
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    const stringifiedEditorState = JSON.stringify(
      editorRef.current.getEditorState().toJSON(),
    );
    const parsedEditorState = editorRef.current.parseEditorState(stringifiedEditorState);

    const editorStateTextString = parsedEditorState.read(() => $getRoot().getTextContent())
    setvalues(editorStateTextString);
    console.log(editorStateTextString)
    if (imageDataURL === null) {
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

  async function onSubmit(values: z.infer<typeof WhisperValidation>) {
    setIsSent(!isSent);
    (document.getElementById('button') as HTMLButtonElement).disabled = true;
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
    let hasimageChanged = false;
    let blob: string | undefined;

    if (values.media) {
      blob = values.media;
      hasimageChanged = isBase64Image(blob);
    }
    if (hasimageChanged) {

      const imgRes = await startUpload(files)

      if (imgRes && imgRes[0].url) {
        values.media = imgRes[0].url;
      }
    }

    await createWhisper({
      content: values.content,
      author: values.accoundId,
      media: values.media,
      aspectRatio: aspectRatio,
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
  const [values, setvalues] = useState('');
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
                              <Image src={user?.image} alt="logo" width={37} height={37} className="mt-1.5 rounded-full bg-good-gray align-self-start" />
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
                                      <FormItem className=" space-y-4 ">
                                        {imageDataURL && imageDataURL.map((url, index) => (
                                          <div key={index} id={`picture-${index}`} className="max-h-[430px] py-4 grid-rows-1 grid-cols-1 grid">
                                            <div style={{ aspectRatio: aspectRatio, maxHeight: "430px" }}>
                                              <div className="block relative h-full">
                                                <picture>
                                                  <img
                                                    src={url}
                                                    className='w-full max-w-full object-cover absolute top-0 bottom-0 left-0 right-0 h-full rounded-xl border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                                    alt={`Image ${index}`}
                                                  />
                                                </picture>
                                                <div className="absolute top-2 right-2">
                                                  <Image
                                                    src="/svgs/close.svg"
                                                    width={20}
                                                    height={20}
                                                    alt=""
                                                    className="invert-0 bg-dark-4 bg-opacity-90 rounded-full cursor-pointer"
                                                    onClick={(e) => abortimage(url, field.onChange)}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                        <FormControl className="outline-none">
                                          <div className="relative right-1.5 mt-1">
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
                                                onChange={(e) => handleImage(e, field.onChange)}
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