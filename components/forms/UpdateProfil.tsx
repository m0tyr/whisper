"use client"

import * as z from "zod";
import Image from "next/image";
import { FieldValues, useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useLayoutEffect, useState, MouseEventHandler } from "react";
import { zodResolver } from "@hookform/resolvers/zod";


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
    toclose: any;
}

import { computeSHA256 } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import DataReacher from "../shared/DataReacher";
import { ModificationValidation } from "@/lib/validations/user";
import { updateAccountUser } from "@/lib/actions/user.actions";
import { ProfileImageData } from "@/lib/types/whisper.types";
import { toast } from "../ui/use-toast";
import { MAX_FILE_SIZE } from "@/lib/errors/post.errors";
import { s3GenerateSignedURL } from "@/lib/s3/actions";
import useUpdateProfil from "@/hooks/useUpdateProfil";



const UpdateProfile = ({ user, _id, toclose }: Props) => {
    const {
        inputRef,
        imageData,
        pathname,
        handleImage,
        Processing,
        isProcessing,
        editableDivHeight,
        handleInput,
        openPopup,
        currentModification,
        currentLimit,
        cachedData,
        DoopenPopup,
        closepopup,
        namecachedata,
        biocachedata,
        biostatus,
        handleDataReacher,
        EnableImage,
        onInputClick
    } = useUpdateProfil({user})

    async function onSubmit(values: z.infer<typeof ModificationValidation>) {
        isProcessing(true)

        if (!imageData[0]) {
            values.profile_photo = user?.image
        } else {
            let allFilesAuthorized = true;
            if (imageData[0].file.size > 1048576 * 25) {
                allFilesAuthorized = false;
            }
            if (allFilesAuthorized) {
                const result = await s3GenerateSignedURL({
                    userId: _id,
                    fileType: imageData[0].file.type,
                    fileSize: imageData[0].file.size,
                    checksum: await computeSHA256(imageData[0].file),
                });

                if (result.failure !== undefined) {
                    toast({
                        title: result.failure,
                        duration: 3000,
                    });
                    (document.getElementById('button') as HTMLButtonElement).disabled = false;
                }

                if (result.success) {
                    const url = result.success.url;
                    values.profile_photo = url.split("?")[0]
                    await fetch(url, {
                        method: "PUT",
                        headers: {
                            "Content-Type": imageData[0].file.type,
                        },
                        body: imageData[0].file,
                    });

                }

            } else {
                toast({
                    title: MAX_FILE_SIZE,
                    duration: 3000,
                });
                (document.getElementById('button') as HTMLButtonElement).disabled = false;
                return
            }
        }

        if (namecachedata.trim() === "") {
            values.name = user?.name
        }
        else {
            values.name = namecachedata
        }
        values.bio = biocachedata
        await updateAccountUser(
            values.accoundId, //userID
            user?.username, //username 
            values.name, // name
            values.bio, // bio
            values.profile_photo, //profil picture
            pathname // pathname
        )
        toclose()
        console.log(values)
    }
    const form = useForm<z.infer<typeof ModificationValidation>>({
        resolver: zodResolver(ModificationValidation),
        defaultValues: {
            profile_photo: user?.image,
            name: "",
            bio: "",
            accoundId: user?.id,
        },
    });
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

                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        scale: 0.98,
                                        x: "-50%",
                                        y: "-50%"
                                    }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        x: "-50%",
                                        y: "-50%",
                                        transition: {
                                            ease: "easeOut",
                                            duration: 0.05,
                                            delay: 0.1
                                        },
                                    }}
                                    exit={{
                                        opacity: 0,
                                        scale: 0.95,
                                        transition: {
                                            ease: "easeIn",
                                            duration: 0.05,
                                            delay: 0.1
                                        },
                                    }}
                                    className='fixed left-1/2 top-1/2 shadow-[0_12px_24px_0_rgba(0,0,0,0.08)]  '
                                    id="editableDiv"

                                    onInput={handleInput}

                                >
                                    <div
                                        className='bg-good-gray pt-6 px-6 max-h-[calc(100svh - 193px)] min-h-40 w-[500px]  mx-auto break-words whitespace-pre-wrap 
                                                        select-text	overflow-y-auto overflow-x-auto   rounded-t-2xl  border-x-[0.2333333px] border-t-[0.2333333px] border-x-border
                                                     border-t-border grid grid-row-[1fr,1fr,1fr] gap-5 '
                                        role="textbox"
                                        style={{ maxHeight: editableDivHeight / 1.15, textAlign: 'left', }}
                                        tabIndex={0}
                                        id="editableDiv"
                                        onInput={handleInput}
                                    >
                                        <div className="grid grid-cols-[1fr] ">
                                            <FormField
                                                control={form.control}
                                                name="profile_photo"

                                                render={({ field }: { field: FieldValues }) => (
                                                    <FormItem >


                                                        <FormControl>

                                                            <div className="flex flex-col gap-0.5">
                                                                <FormLabel>
                                                                    <p className="text-[13px] font-semibold opacity-70">
                                                                        Nom d'utilisateur
                                                                    </p>
                                                                </FormLabel>

                                                                <div className="flex flex-row py-1.5">
                                                                    <div className="text-white inline cursor-not-allowed select-none opacity-50" aria-disabled="true">
                                                                        @{user?.username}
                                                                    </div>
                                                                    <div className="">
                                                                        <span className=" text-sky-600 text-[11px] rounded-xl p-2">
                                                                            <a href="/settings">
                                                                                Aller dans les paramètres
                                                                            </a>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <hr className="border-x-2 opacity-20 rounded-full" />
                                                            </div>

                                                        </FormControl>


                                                    </FormItem>

                                                )}
                                            />
                                            <motion.div whileTap={{ scale: 0.98 }} className="col-start-3 ml-auto">
                                                <div className="w-[52px] h-[52px] flex">
                                                    <Image
                                                        src={imageData[0] ? imageData[0].url : (user?.image)}
                                                        alt="logo"
                                                        width={52}
                                                        height={52}
                                                        className="rounded-full bg-good-gray  w-[52px] h-[52px] cursor-pointer border-border border"
                                                        style={{ aspectRatio: "auto 52/52" }}
                                                        onClick={EnableImage}
                                                    />
                                                    <input onChange={(e) => handleImage(e)} onClick={onInputClick} ref={inputRef} type="file" accept="image/png, image/jpeg, image/jpg, image/tiff" style={{ display: 'none' }} />
                                                </div>
                                            </motion.div>
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="name"

                                                render={({ field }: { field: FieldValues }) => (
                                                    <FormItem >


                                                        <FormControl>

                                                            <div className="flex flex-col gap-0.5">
                                                                <FormLabel>
                                                                    <p className="text-[13px] font-semibold opacity-70">
                                                                        Nom
                                                                    </p>
                                                                </FormLabel>

                                                                <div className="mr-auto py-1.5 cursor-pointer">
                                                                    <span
                                                                        className="text-white text-wrap whitespace-pre-line break-words overflow-x-visible overflow-y-visible"
                                                                        style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
                                                                        onClick={() => DoopenPopup("Nom", 30, namecachedata)}>
                                                                        {namecachedata === "" ? user?.name : namecachedata}
                                                                    </span>

                                                                </div>
                                                                <hr className="border-x-2 opacity-20 rounded-full" />
                                                            </div>

                                                        </FormControl>


                                                    </FormItem>

                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name="bio"

                                                render={({ field }: { field: FieldValues }) => (
                                                    <FormItem >


                                                        <FormControl>

                                                            <div className="flex flex-col gap-0.5">
                                                                <FormLabel>
                                                                    <p className="text-[13px] font-semibold opacity-70">
                                                                        Bio
                                                                    </p>
                                                                </FormLabel>

                                                                <div className="mr-auto py-1.5  cursor-pointer">
                                                                    <span
                                                                        data-placeholder="+ Ajouter une bio"
                                                                        className="text-white text-wrap whitespace-pre-line break-words overflow-x-visible overflow-y-visibl placeholder:text-[12px]"
                                                                        style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}
                                                                        onClick={() => DoopenPopup("Bio", 200, biocachedata)}>
                                                                        {biostatus ? biocachedata : user?.bio}
                                                                    </span>

                                                                </div>
                                                                <hr className="border-x-2 opacity-20 rounded-full" />
                                                            </div>

                                                        </FormControl>


                                                    </FormItem>

                                                )}
                                            />
                                        </div>
                                        <div>


                                            <div className="flex flex-row ">
                                                <div className=" my-auto justify-center items-center">
                                                    <p className="text-[15px] font-light ">
                                                        Profil Privée
                                                    </p>
                                                </div>
                                                <div className="ml-auto py-1.5">
                                                    <Switch
                                                    />

                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                    <div id="editableDiv"
                                        className='items-center justify-center rounded-b-2xl 
                  bg-good-gray  border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-b-border  w-[500px] h-[87px] mx-auto  p-4 '>
                                        <motion.div whileTap={{ scale: 0.97 }} className="w-full h-full">
                                            <Button id="button"
                                                type="submit"
                                                className="w-full h-full bg-white rounded-xl py-1 px-4 hover:bg-slate-100
                 transition-all duration-150 !text-small-semibold text-black ">
                                                {Processing ? (
                                                    <motion.svg
                                                        aria-label="Chargement…"
                                                        className="text-black opacity-60"
                                                        role="img"
                                                        viewBox="0 0 100 100"
                                                        width={16}
                                                        height={16}
                                                        animate={{ rotate: 3600 }}
                                                        transition={{ duration: 10, repeat: Infinity, delay: 0.01 }}
                                                    >
                                                        <rect fill="black" height="10" opacity="0" rx="5" ry="5" transform="rotate(-90 50 50)" width="28" x="67" y="45"></rect>
                                                        <rect fill="black" height="10" opacity="0.125" rx="5" ry="5" transform="rotate(-45 50 50)" width="28" x="67" y="45"></rect>
                                                        <rect fill="black" height="10" opacity="0.25" rx="5" ry="5" transform="rotate(0 50 50)" width="28" x="67" y="45"></rect>
                                                        <rect fill="black" height="10" opacity="0.375" rx="5" ry="5" transform="rotate(45 50 50)" width="28" x="67" y="45"></rect>
                                                        <rect fill="black" height="10" opacity="0.5" rx="5" ry="5" transform="rotate(90 50 50)" width="28" x="67" y="45"></rect>
                                                        <rect fill="black" height="10" opacity="0.625" rx="5" ry="5" transform="rotate(135 50 50)" width="28" x="67" y="45"></rect>
                                                        <rect fill="black" height="10" opacity="0.75" rx="5" ry="5" transform="rotate(180 50 50)" width="28" x="67" y="45"></rect>
                                                        <rect fill="black" height="10" opacity="0.875" rx="5" ry="5" transform="rotate(225 50 50)" width="28" x="67" y="45"></rect>
                                                    </motion.svg>
                                                ) : ("Terminé")}
                                            </Button>
                                        </motion.div>
                                    </div>

                                </motion.div>
                            </form>
                        </div>
                    </motion.div>

                </AnimatePresence >
            </Form >
            {openPopup && (
                <>
                    <motion.div
                        initial={{ opacity: 0, zIndex: 0 }}
                        animate={{ opacity: 1, zIndex: 51 }}
                        exit={{ opacity: 0 }}
                        transition={{}}
                        id='top'
                        className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full " onClick={() => DoopenPopup("", 0, "")}></motion.div>
                    <DataReacher editableDivHeight={editableDivHeight} data={currentModification} data_limit={currentLimit} onUpdateData={handleDataReacher} toclose={closepopup} cache={cachedData} />
                </>

            )}


        </>
    )

}


export default UpdateProfile;