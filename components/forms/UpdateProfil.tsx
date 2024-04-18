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

import { WhisperValidation } from "@/lib/validations/whisper";
import { useUploadThing } from "@/lib/uploadthing";
import { image } from "@nextui-org/react";
import { GetLastestWhisperfromUserId, createWhisper } from "@/lib/actions/whisper.actions";
import { getMeta, isBase64Image } from "@/lib/utils";
import { AnimatePresence } from 'framer-motion'
import { motion } from "framer-motion"
import { Switch } from "@/components/ui/switch"
import DataReacher from "../shared/DataReacher";
import { ModificationValidation } from "@/lib/validations/user";
import { updateAccountUser } from "@/lib/actions/user.actions";



const UpdateProfile = ({ user, _id, toclose }: Props) => {
    const [files, setFiles] = useState<File[]>([]);

    const { startUpload } = useUploadThing('imageUploader')


    const router = useRouter();

    const [imageDataURL, setImageDataURL] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState("revert");

    const pathname = usePathname();

    const form = useForm<z.infer<typeof ModificationValidation>>({
        resolver: zodResolver(ModificationValidation),
        defaultValues: {
            profile_photo: user?.image,
            name: "",
            bio: "",
            accoundId: user?.id,
        },
    });


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





    async function onSubmit(values: z.infer<typeof ModificationValidation>) {
        isProcessing(true)
        if (namecachedata === "") {
            values.name = user?.name
        }
        else {
            values.name = namecachedata
        }
        values.bio = biocachedata
        await updateAccountUser({
            userId: values.accoundId,
            username: user?.username,
            name: values.name,
            bio: values.bio,
            image: user?.image,
            path: pathname
        })
        toclose()
        console.log(values)

    }
    const [Processing, isProcessing] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
    const [editableDivHeight, setEditableDivHeight] = useState(viewportHeight);
    const editableDiv = document.getElementById('editableDiv');

    const handleResize = () => {
        const newViewportHeight = window.innerHeight;
        setViewportHeight(newViewportHeight);
        setEditableDivHeight(newViewportHeight);
    };
    window.onresize = handleResize


    const handleInput = () => {
        if (editableDiv) {

            const scrollHeight = editableDiv.scrollHeight;
            editableDiv.style.overflowY = 'scroll';
            setEditableDivHeight(viewportHeight);

            editableDiv.style.overflowY = 'hidden';
            setEditableDivHeight(viewportHeight);

        }
    };
    const [openPopup, setopenPopup] = useState(false);
    const [currentModification, setCurrentModification] = useState('');
    const [currentLimit, setcurrentLimit] = useState(0);
    const [cachedData, setcachedData] = useState("");
    const DoopenPopup = (from: string, limit: number, cache: string) => {
        if (cache === "") {
            setopenPopup(!openPopup)
            setCurrentModification(from);

            if (from == "Nom") {
                setcachedData(user?.name);
                setcurrentLimit(limit);
            } else {
                setcachedData(cache)
                setcurrentLimit(limit);

            }
        }
        else {
            setopenPopup(!openPopup)
            setCurrentModification(from);
            setcachedData(cache);
            setcurrentLimit(limit);

        }

    };
    const closepopup = () => {
        setopenPopup(!openPopup)
    };
    const [namecachedata, setNamecachedata] = useState("");
    const [biocachedata, setBiocachedata] = useState(user?.bio);
    const [biostatus, setbiostatus] = useState(false);
    const handleDataReacher = (value: string, type: string) => {
        if (type === "nom") {
            setNamecachedata(value);
        }
        if (type === "bio") {
            setbiostatus(true)
            setBiocachedata(value);
        }
    };


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
                                            <div className="col-start-3 ml-auto">
                                                <Image src={user?.image} alt="logo" width={47} height={47} className="rounded-full bg-good-gray" />
                                                <div className="thread-card_bar" />
                                            </div>
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
                  bg-good-gray  border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-b-border  w-[500px] h-[80px] mx-auto  p-4 '>
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

                                </div>
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