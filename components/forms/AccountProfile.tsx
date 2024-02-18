"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { Calendar } from "@/components/ui/calendar"
import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"

const AccountProfile = ({ user, btnTitle }: Props) => {


  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    console.log(values)
  }
  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    }
  
  return (
    <Form {...form}>
      <form 
      onSubmit={form.handleSubmit(onSubmit)} 
      className="space-y-8"
      >
      <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center gap-4 justify-center mx-20'>
              <FormLabel className='justify-center '>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={96}
                    height={96}
                    priority
                    className='rounded-full justify-center '
                  />
                ) : (
                  <Image
                    src='/profil.png'
                    alt='profile_icon'
                    width={95}
                    height={95}
                    className=''
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
              <Input
                  type='file'
                  accept='image/*'
                  placeholder='Photo de profil'
                  className='py-1.5 cursor-pointer bg-zinc-900  text-white  file:text-blue file:cursor-pointer'
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>

              <FormLabel className="text-white">Nom</FormLabel>
              <FormControl>
                <Input placeholder="user" {...field} />
              </FormControl>
            
              <FormMessage />
            </FormItem>

          )}
        />
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
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Bio</FormLabel>
              <FormControl >
                <Textarea
                  placeholder="Dis-nous en plus sur toi !"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
           
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className=" bg-neutral-900 hover:bg-neutral-800">Commencer</Button>
      </form>
    </Form>
  );
};

export default AccountProfile;