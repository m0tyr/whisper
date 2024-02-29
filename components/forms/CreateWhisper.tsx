"use client"

import * as z from "zod";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { CalendarIcon } from "@radix-ui/react-icons"

import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import Link from "next/link";



interface Props {
  user: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
}
import { WhisperValidation } from "@/lib/validations/whisper";
import { useUploadThing } from "@/lib/uploadthing";
import { image } from "@nextui-org/react";


const CreateWhisper = ({ user }: Props) => {
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
        else if (height < window.innerHeight/2) {
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
  function onSubmit(values: z.infer<typeof WhisperValidation>) {
    const spanText = document.getElementById('editable-span')?.textContent || '';
    values.content = spanText;
    console.log(values)

  }
  return (
    <>
      <Form {...form} >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="pt-8"
        >
          <div className=" mx-10">
            <div id='upper-div'
              style={{ height: `${height}px`, marginTop: `${margintop}px` }}
              className="fixed top-1/2 left-0 inset-0 
            w-basic  flex-wrap z-50 overflow-auto  
            mx-auto bg-good-gray rounded-t-2xl  border-x border-t border-x-border border-t-border  justify-center items-center">

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
                              <img src={imageDataURL} className="rounded-xl" />


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
       bg-good-gray  border-x border-b border-x-border border-b-border">
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

            <Button id="button" type="submit" className="absolute right-6 bottom-6 bg-white rounded-full py-1 h-9 px-4 hover:bg-slate-200 transition-all duration-150 !text-small-semibold text-black mt-0.5" disabled>
              Publier
            </Button>
          </div>

        </form>
      </Form>
    </>
  )

}


export default CreateWhisper;