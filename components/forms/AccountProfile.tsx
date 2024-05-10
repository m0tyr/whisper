"use client";

import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
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

import { fetchUserbyUsername, updateUser, usernameCheck } from "@/lib/actions/user.actions";


interface Props {
  user: {
    id: string | undefined;
    username: string;
    name: string;
    bio: string;
    image: string;
    email: string;
  };
}


import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { isBase64Image } from "@/lib/utils";
import { motion } from "framer-motion";


const AccountProfile = ({ user }: Props) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const router = useRouter();
  const pathname = usePathname();



  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleFormChange = () => {
    const { name, username } = form.getValues();
    setIsFormValid(name.trim() !== "" && username.trim() !== "");
  };

  useEffect(() => {
    handleFormChange();
  }, [form]);

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    toast({
      title: "Inscription...",
      duration: 20000,
    }
    )
    const isUsernameTaken = await usernameCheck(values.username)
    if (isUsernameTaken) {
      toast({
        title: "Le nom d'utilisateur est déjà pris",
        duration: 20000,
      }
      )
    } else {
      await updateUser({
        email: user.email,
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo ? values.profile_photo : user?.image,
        path: pathname,
      });
      toast({
        title: "Inscrit !",
        duration: 2000,

      })
      if (pathname === '/profil/edit') {
        router.back();
      } else {
        router.push('/');
      }
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
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };


  return (
    <>
    <Form {...form} >
      <form
        onChange={handleFormChange}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name='profile_photo'
          render={({ field }) => (
            <FormItem className='flex items-center max-w-[80%] gap-4'>
              <FormLabel className='justify-center '>
                {field.value ? (
                  <Image
                    src={field.value}
                    alt='profile_icon'
                    width={85}
                    height={85}
                    priority
                    className='rounded-full justify-center '
                  />
                ) : (
                  <Image
                    src='/profil.png'
                    alt='profile_icon'
                    width={85}
                    height={85}
                    className=''
                  />
                )}
              </FormLabel>
              <FormControl className='flex-1 text-base-semibold text-gray-200'>
                <div className="bg-[rgb(30,30,30)] rounded-xl w-full mb-2 ">
                  <input onChange={(e) => handleImage(e, field.onChange)} type='file' accept="image/jpeg,image/png,video/mp4,video/quicktime" placeholder='Photo de profil' autoComplete="off" style={{ outline: 'none' }}
                   className="bg-[rgb(30,30,30)] focus:bg-[rgb(42,42,42)] file:rounded-sm file:bg-[rgb(197,197,197)] file:outline-none file:border-0 file:text-white file:cursor-pointer  w-full px-4 py-5 rounded-2xl opacity-70 focus:border-none border-none focus:ring-0 duration-100" />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className=" space-y-0">
              <FormControl>
                <div className="bg-[rgb(30,30,30)] rounded-xl w-full mb-2">
                  <input {...field} autoComplete="off" style={{ outline: 'none' }} maxLength={30} className="bg-[rgb(30,30,30)] focus:bg-[rgb(42,42,42)] placeholder:text-[14px] placeholder:font-light w-full px-4 py-4 rounded-xl opacity-70 focus:border-none border-none focus:ring-0 duration-100" type="text" placeholder="Nom" />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>

          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className=" space-y-0">
              <FormControl>
                <div>
                  <div className="bg-[rgb(30,30,30)] rounded-xl w-full">
                    <input {...field} autoComplete="off" style={{ outline: 'none' }} maxLength={20} className="bg-[rgb(30,30,30)] focus:bg-[rgb(42,42,42)] placeholder:text-[14px] placeholder:font-light w-full px-4 py-4 rounded-xl opacity-70 focus:border-none border-none focus:ring-0 duration-100" type="text" placeholder="Nom d'utilisateur" />
                  </div>
                  <span className=" font-extralight text-[12px] ">Le nom d'utilisateur doit être unique et d'au moins 3 caractères.</span>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>

          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className=" space-y-0">
              <FormControl >
                <textarea placeholder="Ecrivez-nous une bio..."  {...field} maxLength={150} autoComplete="off" style={{ outline: 'none' }} className="bg-[rgb(30,30,30)] focus:bg-[rgb(42,42,42)] placeholder:text-[14px] placeholder:font-light w-full px-4 py-4 mt-1 rounded-xl opacity-70 focus:border-none border-none focus:ring-0 duration-100" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mb-2 w-full h-full">
          <div className="w-full h-full">
            <div className="flex w-full">
              <motion.button whileTap={{ scale: 0.99, scaleX: 0.98 }}
                id="button"
                type="submit"
                className={`w-full px-4 py-4 rounded-xl ${isFormValid ? 'bg-white hover:bg-slate-100' : 'bg-border hover:bg-border cursor-not-allowed'
                  } transition-all duration-150 !text-small-semibold text-black`}
                disabled={!isFormValid}
                style={{ cursor: isFormValid ? 'pointer' : 'not-allowed' }}
              >
                Continuer
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    
    </Form>

    </>
  );
};

export default AccountProfile;