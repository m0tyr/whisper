
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
import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
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
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})

const CreateWhisper = ({ author }: WhisperProps) => {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (

    <div className="fixed inset-0 bg-black bg-opacity-65 flex justify-center items-center z-0 w-full ">
      <div className="flex flex-col items-center w-basic h-basic mb-16">

        <p className="text-white my-2 text-base-semibold">Nouveau Whisper</p>

        <div className=" flex-wrap	 relative w-full h-full py-12 bg-good-gray rounded-2xl border-x border-y border-x-border border-y-border border flex justify-center items-center">

          <Form {...form} >
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=""
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem >

                    <FormLabel>

                        <Image src="./svgs/user.svg" alt="logo" width={37} height={37} className="absolute left-6 top-6 opacity-85 hover:opacity-100  transition-all duration-300  float-left gap-3  mt-1.5 " />
                    </FormLabel>
                    <FormControl className="outline-none">
                    {/* NOT GOOD CHANGE THAT !!! */}
                      <textarea  {...field} placeholder="Commencer un Whisper.."     className="grow absolute left-16 top-7 w-10/12 bg-good-gray text-small-regular pl-3 pr-px  outline-none font text-gray-300 opacity-65"></textarea>
                    </FormControl>

                    <FormMessage />
                  </FormItem>

                )}
              />
              <Button type="submit" className="absolute right-6 bottom-6 bg-white rounded-full py-1 h-9 px-4 hover:bg-slate-200 transition-all duration-150 !text-small-semibold text-black mt-0.5">Publier</Button>
            </form>
          </Form>
        </div>
      </div>

    </div>
  )
}


export default CreateWhisper;