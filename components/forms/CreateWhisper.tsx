
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
      <div className="flex flex-col items-center w-1/2">

        <p className="text-white my-2 text-base-semibold">Nouveau Whisper</p>

        <div className="w-full px-12 py-12 bg-good-gray rounded-2xl border-x border-y border-x-border border-y-border flex justify-center items-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel className="text-white">Pseudo</FormLabel>
                    <FormControl>
                      <Input placeholder="user124151253" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>

                )}
              />
              <Button type="submit" className=" bg-neutral-900 hover:bg-neutral-800 rounded-full text-small-semibold "><p className="text-white">Commencer</p></Button>
            </form>
          </Form>
        </div>
      </div>

    </div>
  )
}


export default CreateWhisper;