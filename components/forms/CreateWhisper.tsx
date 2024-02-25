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

const CreateWhisper = ({ author }: WhisperProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whisper: "",
    },
  })
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


  return (

    <>
      <Form {...form} >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
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
                      <span
                        {...field}
                        onKeyUp={handleKeyboardEvent}
                        id="editable-span"
                        className=" bg-good-gray block h-auto resize-none absolute left-16 top-12 w-10/12  text-small-regular  pr-px text-white outline-none   
                           rounded-md ring-offset-background placeholder:text-neutral-400  disabled:cursor-not-allowed disabled:opacity-50"
                        contentEditable></span>
                    </div>
                  </FormControl>

                  <FormMessage />
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