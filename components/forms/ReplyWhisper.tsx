"use client"
import { CommentValidation } from "@/lib/validations/whisper";
import { useUploadThing } from "@/lib/uploadthing";
import { image } from "@nextui-org/react";
import { GetLastestWhisperfromUserId, createComment, createWhisper } from "@/lib/actions/whisper.actions";
import { getMeta, isBase64Image } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { motion } from "framer-motion"
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import * as z from "zod";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import WhisperCardLeft from "../shared/WhisperCardLeft";
import ReplyWhisperCardMain from "../shared/ReplyWhisperCardMain";


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
    }[]
    isComment?: boolean;
  }
  toclose: any;
  togglePopup:any;
  aspectRatio:any;
}


const ReplyWhisper = ({ user, whisper_to_reply, _id, toclose, togglePopup,aspectRatio }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing('imageUploader')


  const router = useRouter();

  const [imageDataURL, setImageDataURL] = useState<string | null>(null);
  const [aspectratio, setAspectRatio] = useState("revert"); 

  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      content: "",
      media: "",
      accoundId: _id,
    },
  });

  const WatchText = () => {
    var getText = document.getElementById("editable-span")?.textContent;
    var result = getText;
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
        setImageDataURL(imageDataUrl);
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
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




  const abortimage = (
    fieldChange: (value: string) => void
  ) => {
    fieldChange("");
    setAspectRatio("revert");
    setImageDataURL("");
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    WatchText();
  }
  const [isSent, setIsSent] = useState(true);
  const { toast } = useToast()

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
    var contenteditable = document.querySelector('[contenteditable]')

    var innerText: string | undefined = (contenteditable as HTMLElement)?.innerText;
    values.content = innerText;

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
    await createComment({
      content: values.content,
      author: values.accoundId,
      media: values.media,
      aspectRatio: aspectratio,
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
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  const [editableDivHeight, setEditableDivHeight] = useState(viewportHeight);
  const editableDiv = document.getElementById('editableDiv');

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
  if (editableDiv) editableDiv.scrollTop = editableDiv.scrollHeight;

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
                      <FormItem className=" [overflow-anchor:none;]" >

                        <div
                          className='bg-good-gray p-6 max-h-[calc(100svh - 193px)] min-h-40 w-basic  mx-auto break-words whitespace-pre-wrap 
                          select-text	overflow-y-auto overflow-x-auto   rounded-t-2xl  border-x-[0.2333333px] border-t-[0.2333333px] border-x-border
                            border-t-border [overflow-anchor:auto;]  '
                          role="textbox"
                          style={{ maxHeight: editableDivHeight / 1.15, textAlign: 'left', }}
                          tabIndex={0}
                          id="scroll"
                          onInput={handleInput}
                        >
                          <div className='flex w-full flex-1 flex-col mt-1.5 gap-1 mb-1 '>
                            <div className="flex flex-row flex-1  gap-3 ">
                              <WhisperCardLeft author={whisper_to_reply.author} id={user.id} />
                              
                              <ReplyWhisperCardMain id={whisper_to_reply.id} content={whisper_to_reply.content} media={whisper_to_reply.media} author={whisper_to_reply.author}
                                createdAt={whisper_to_reply.createdAt} togglePopup={undefined} aspectRatio={aspectRatio} />
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
                                  <div
                                    {...field}
                                    onKeyUp={WatchText}
                                    data-placeholder={`Répondre à ${whisper_to_reply.author.username}...`}
                                    className="bg-good-gray text-small-regular  text-white outline-none rounded-md ring-offset-background cursor-text placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:opacity-50"
                                    contentEditable
                                  ></div>

                                  <FormField
                                    control={form.control}
                                    name="media"
                                    render={({ field }: { field: FieldValues }) => (
                                      <FormItem className=" space-y-4 ">
                                        {imageDataURL && (

                                          <>
                                            <div id="picture" className="max-h-[430px] mb-2 grid-rows-1 grid-cols-1 grid">
                                              <picture style={{ aspectRatio: aspectratio, maxHeight: "430px" }}>
                                                <Image src="/svgs/close.svg" width={20} height={20} alt="" className="relative top-8 ml-2 invert-0 bg-dark-4 bg-opacity-90 rounded-full cursor-pointer"
                                                  onClick={(e) => abortimage(field.onChange)} />
                                                <img src={imageDataURL}
                                                  className='object-contain  rounded-xl border-x-[.15px] border-y-[.15px] border-x-[rgba(243,245,247,.13333)] border-y-[rgba(243,245,247,.13333)]'
                                                />
                                              </picture>

                                            </div>

                                          </>


                                        )}
                                        <FormControl className="outline-none">

                                          <div className=" w-6 h-3 mt-3 mb-8" role="button">
                                            <Input type="file"
                                              id='file'
                                              className="cursor-pointer w-6 h-6  text-good-gray placeholder:bg-good-gray bg-good-gray bg-contain bg-no-repeat !outline-none border-opacity-0 bg-add-image "
                                              title="Joindre un contenu Multimédia"
                                              onChange={(e) => handleImage(e, field.onChange)}

                                            />
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

