"use client"

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useRef, useState } from "react";
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

const formSchema = z.object({
  whisper: z.string().min(0, {
    message: "",
  }),
})

interface WhisperProps {
  id: string;
  author: {
    name: string;
    username: string;
    image: string;
  };
  content: string;
  date: string;
  likes?: number;
  retweets?: number;
  replies?: number;
  media?: string[];

}
import { WhisperValidation } from "@/lib/validations/whisper";
import { useUploadThing } from "@/lib/uploadthing";
import { image } from "@nextui-org/react";


const CreateWhisper = ({ userId }: { userId: string }) => {
  const [files, setFiles] = useState<File[]>([]);


  const { startUpload } = useUploadThing('imageUploader')

  const router = useRouter();

  const pathname = usePathname();

  const form
    = useForm({
      resolver: zodResolver(WhisperValidation),
      defaultValues: {
        whisper: "",
        image: "",
        accoundId: userId,
      },
    })
  const { register, handleSubmit, formState: { errors }, watch } = form;

  const watchImage = watch("image");
  let linkimage: any;
  if (watchImage) { linkimage = watchImage; }


  function onSubmit(values: z.infer<typeof formSchema>) {
    const spanText = document.getElementById('editable-span')?.textContent || '';
    values.whisper = spanText;
    console.log(values)
  }
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
    console.log("caca")
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };




  return (

    <>
    
        <Form {...form} >
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="pt-8"
          >
            <div id='upper-div'
              className="fixed top-0 left-0 inset-0 
            w-basic min-h-[169px] h-[229px] flex-wrap z-50 overflow-auto  
            mx-auto bg-good-gray rounded-t-2xl  border-x border-t border-x-border border-t-border  mt-[160px] justify-center items-center">

              <FormField
                control={form.control}
                name="whisper"
                render={({ field }) => (
                  <FormItem >

                    <FormLabel>
                      <span className="absolute left-16 top-7 text-white text-small-semibold tracking-wide  ">m0tyr</span>
                      <Image src="./svgs/user.svg" alt="logo" width={34} height={34} className="absolute left-4 top-8 float-left gap-3   " />
                    </FormLabel>
                    <FormControl className="outline-none">

                      <div className="relative w-full">
                        <div className="absolute left-16 top-11 w-10/12">
                          <span
                            {...field}
                            onKeyUp={handleKeyboardEvent}
                            id="editable-span"
                            className=" bg-good-gray h-auto resize-none w-10/12  text-small-regular  pr-px text-white outline-none   
                           rounded-md ring-offset-background cursor-text placeholder:text-neutral-400  disabled:cursor-not-allowed disabled:opacity-50"
                            contentEditable></span>
                          {watchImage ? (
                            <div className=" mt-2 w-full h-full " >
                              <img src={linkimage} className="rounded-xl" />

                            </div>

                          ) : (
                            <div></div>
                          )}
                        </div>
                      </div>
                    </FormControl>

                  </FormItem>

                )}
              />


            </div >
            <div id='lower-div' className="fixed top-0 left-0 inset-0 flex-wrap z-50  w-basic h-20 mx-auto mt-[24.3333333rem] rounded-b-2xl justify-center items-center
       bg-good-gray  border-x border-b border-x-border border-b-border">
              <p
                className=" text-small-medium  ml-4 mt-4 absolute bottom-4 text-cyan-500  drop-shadow-glow 
          ">
                Nouveau Whisper
              </p>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem >
                    <FormLabel>

                    </FormLabel>

                    <FormControl className="outline-none">

                      <div className="absolute top-0 left-16 w-6 h-3 mt-5" role="button">
                        <Input type="file"
                          className="absolute bottom-0 top-0 cursor-pointer w-6 h-6 bg-good-gray bg-contain bg-no-repeat !outline-none border-opacity-0 bg-add-image "
                          aria-label="Joindre un fichier"
                          {...register("image")}
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