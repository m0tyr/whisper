"use client"

import * as z from "zod";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState } from "react";
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



interface Props {
  _id: string;
  user: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  toclose:any;
}
import { WhisperValidation } from "@/lib/validations/whisper";
import { useUploadThing } from "@/lib/uploadthing";
import { image } from "@nextui-org/react";
import { createWhisper } from "@/lib/actions/whisper.actions";
import { isBase64Image } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { motion } from "framer-motion"


const CreateWhisper = ({ user, _id, toclose }: Props) => {
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing('imageUploader')


  const router = useRouter();

  const [imageDataURL, setImageDataURL] = useState<string | null>(null);

  const pathname = usePathname();

  const form = useForm<z.infer<typeof WhisperValidation>>({
    resolver: zodResolver(WhisperValidation),
    defaultValues: {
      content: "",
      media: "",
      accoundId: _id,
    },
  });

  const handleKeyboardEvent = (e: any) => {
    var getText = document.getElementById("editable-span")?.textContent;
    var result = getText;
    if (result?.trim() === "") {
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
        setImageDataURL(imageDataUrl);
        (document.getElementById('button') as HTMLButtonElement).disabled = false;
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };
  useEffect(() => {
    document.body.classList.add('stop-scrolling');

    return () => {
      document.body.classList.remove('stop-scrolling');
    };
  }, []);


  const [spanClientHeight, setSpanClientHeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [margintopTWO, setMargintopTWO] = useState(0);
  const [hasConditionMet, setHasConditionMet] = useState(false);
  const [margintop, setMargintop] = useState(0);


  const spanRef = useRef(null);


  useLayoutEffect(() => {
    if (spanRef.current) {
      setSpanClientHeight(spanRef.current['clientHeight']);
      setHeight(205 + spanRef.current['clientHeight']);
      setMargintop(136 + spanRef.current['clientHeight']);
    }
  }, []);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { height } = entry.contentRect;
        if (height >= window.innerHeight / 2 && !hasConditionMet) {
          setHeight(185 + (window.innerHeight / 2));
          setMargintopTWO(85.333 + (window.innerHeight / 5))
          setMargintop(-130 - (window.innerHeight / 4));
          setHasConditionMet(true); // Set the condition as met
        }
        else if (height < window.innerHeight / 2) {
          setHeight(185 + (height));
          setMargintopTWO(45.333 + (height / 2))
          setMargintop(-130 - (height / 2));
          setHasConditionMet(false);
        }
      }
    });

    if (spanRef.current) {
      resizeObserver.observe(spanRef.current);
    }

    return () => {
      if (spanRef.current) {
        resizeObserver.unobserve(spanRef.current);
        resizeObserver.disconnect();

      }
    };

  }, [hasConditionMet]);
  function abortimage() {

    setImageDataURL(null);
  }
  const [isSent, setIsSent] = useState(true);


  async function onSubmit(values: z.infer<typeof WhisperValidation>) {
    setIsSent(!isSent);
    (document.getElementById('button') as HTMLButtonElement).disabled = true;
    (document.getElementById('button') as HTMLButtonElement).innerHTML = "";

    const spanText = document.getElementById('editable-span')?.textContent || '';
    values.content = spanText;
    console.log(values);

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
      path: pathname,
    });
    toclose();
    router.prefetch("/");
    router.push("/");

  }


  return (
    <>
      <Form {...form} >
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
          >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className=" mx-10">

                <div id='upper-div'
                  style={{ height: `${height}px`, marginTop: `${margintop}px` }}
                  className="fixed top-1/2 left-0 inset-0 
            w-basic  flex-wrap z-50 overflow-auto  
            mx-auto bg-good-gray rounded-t-2xl  border-x-[0.2333333px] border-t-[0.2333333px] border-x-border border-t-border  justify-center items-center">

                  <FormField
                    control={form.control}
                    name="content"

                    render={({ field }: { field: FieldValues }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="absolute left-16 top-7 text-white text-small-semibold tracking-wide  ">{user?.username}</span>
                          <Image src={user?.image} alt="logo" width={40} height={40} className=" absolute left-4 top-8 float-left gap-3 rounded-full  " />
                        </FormLabel>
                        <FormControl className="outline-none">
                          <div className="relative w-full">
                            <div className="absolute left-16 top-11 w-10/12" ref={spanRef}>
                              <span
                                {...field}
                                onKeyUp={handleKeyboardEvent}
                                id="editable-span"
                                className=" bg-good-gray h-auto resize-none w-10/12  text-small-regular  pr-px text-white outline-none   
                           rounded-md ring-offset-background cursor-text placeholder:text-neutral-400  disabled:cursor-not-allowed disabled:opacity-50"
                                contentEditable
                              ></span>
                              {imageDataURL && (

                                <>
                                  <div className="min-w-sm max-w-md relative">
                                    <Image src="svgs/close.svg" width={20} height={20} alt="" className=" absolute top-2 ml-2 invert-0 bg-dark-4 bg-opacity-55 rounded-full cursor-pointer" onClick={abortimage} />
                                    <img src={imageDataURL} className="rounded-xl max-w-md" />
                                  </div>
                                </>


                              )}
                            </div>

                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />


                </div>
              </div>
              <div id='lower-div'
                style={{ marginTop: `${margintopTWO}px` }}
                className="fixed top-1/2 left-0  inset-0 flex flex-wrap z-50  w-basic h-20 mx-auto  rounded-b-2xl  items-center
       bg-good-gray  border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-b-border">
                <p
                  className=" text-small-medium  ml-4 mt-4 absolute bottom-4 text-cyan-500  drop-shadow-glow 
          ">
                  Nouveau Whisper
                </p>
                <FormField
                  control={form.control}
                  name="media"
                  render={({ field }: { field: FieldValues }) => (
                    <FormItem >
                      <FormLabel>

                      </FormLabel>

                      <FormControl className="outline-none">

                        <div className="absolute top-0 left-16 w-6 h-3 mt-5" role="button">
                          <Input type="file"
                            className="absolute bottom-0 top-0 cursor-pointer w-6 h-6 bg-good-gray bg-contain bg-no-repeat !outline-none border-opacity-0 bg-add-image "
                            aria-label="Joindre un fichier"
                            onChange={(e) => handleImage(e, field.onChange)}

                          />
                        </div>

                      </FormControl>

                    </FormItem>

                  )}
                />

                <Button id="button" type="submit" className="absolute right-6 bottom-6 bg-white rounded-full py-1 w-[79.5px] h-9 px-4 hover:bg-slate-200 transition-all duration-150 !text-small-semibold text-black mt-0.5" disabled>
                  Publier
                </Button>
                {isSent ? (
                 null
                ) :  <div id="top" role="status" className="absolute right-14 bottom-[2.13333rem]">
                <svg aria-hidden="true" className="w-3.5 h-3.5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="white" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="black" />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
                }



              </div>
            </form>
          </motion.div>

        </AnimatePresence>
      </Form >

    </>
  )

}


export default CreateWhisper;