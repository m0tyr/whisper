"use client"
import Image from "next/image";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion"
import { MouseEventHandler, useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useNotificationsCountQuery } from "@/hooks/NotificationQuery";
import { requestNewFeed } from "@/lib/actions/feed.actions";
import { useModal } from "@/hooks/useModal";
import { Modal } from "./Modal";
import { useSessionUser } from "@/hooks/useSessionUser";

const TopBar = ({ _id }: any) => {
    
    const [user] = useSessionUser();
    console.log(user)
    const pathname = usePathname();
    function handleConfirm() {
        location.href = "/settings";
    }
    const {
        togglePopup,
        openPopOver,
        showPopOver,
        showPopup,
    } = useModal()
    const SignOutUser = async () => {
        toast({
            title: "Déconnexion...",
            duration: 20000,
        });

        await signOut({
            redirect: true
        });
    };
    const { data: notificationCount } = useNotificationsCountQuery(user?.id);

    const refreshFeed = async () => {
        if (window.scrollY > 0) {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            return;
        }
        await requestNewFeed(user.id, pathname)
        if (pathname !== "/") {
            return;
        }
        window.location.reload()
    }
    /*     const notificationCount = 0
        const data = 0 */
    const username = user ? user.username : '';
    return (
        <>
                   <Modal type="create" _id={_id} user={user} togglePopup={togglePopup} openPopOver={openPopOver} showPopOver={showPopOver} showPopup={showPopup} />
            <header className="backdrop-blur-3xl topbar top-0 left-0 right-0 w-full h-[74px] grid-cols-[1fr_50vw_1fr] mobile:grid-cols-[1fr_max-content_1fr] grid max-w-[1230px] mx-auto">
                <div className="mobile:block mobile:col-start-1 hidden"></div>

                <motion.div whileTap={{ scale: 0.92 }} onClick={() => { refreshFeed() }} className="flex flex-col w-18 h-18  col-start-2 mx-auto mmy-auto  mobile:ml-4 mobile:col-start-1 mobile:mr-auto ">
                    <div className="flex items-center gap-3 hover:scale-105 transition-all duration-300 cursor-pointer ">
                        <Image src="/logo_resize.png" alt="logo" width={45} height={45} priority />

                    </div>
                </motion.div>


                <div className="md:w-[620px] xs:w-[550px]  max-w-[620px] w-[620px] px-16 h-full mobile:col-start-2 col-start-1 mobile:block hidden">
                    <nav className="h-full grid grid-cols-[repeat(5,20%)] ">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            onClick={() => { refreshFeed() }}
                        >
                            <div className="relative">
                                <Link href="/" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">


                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={26} height={26} className=" opacity-20">
                                            <path fill="#706f6f" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                                        </svg>

                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <Link href="/search" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">


                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="26px" height="26px" className=" opacity-20">
                                            <path fill="#706f6f" d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" />
                                        </svg>

                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <div onClick={togglePopup(false)} className=" cursor-pointer py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">


                                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#706f6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=" opacity-20">
                                            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
                                        </svg>

                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full  hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <Link href="/activity" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">
                                        {notificationCount && notificationCount !== 0 ? (
                                            <div className=" justify-center items-center w-full h-full flex">
                                                 <svg xmlns="http://www.w3.org/2000/svg" className=" absolute top-1.5 fill-[#FF0034] stroke-[#FF0034] drop-shadow-2xl" width={6} height={6} viewBox="0 0 122.88 122.88">
                                                    <g>
                                                        <path d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44s-27.51,61.44-61.44,61.44S0,95.37,0,61.44S27.51,0,61.44,0L61.44,0z" />
                                                    </g>
                                                </svg>
                                                <svg xmlns="http://www.w3.org/2000/svg" className=" absolute top-1.5 fill-[#FF0034] animate-ping stroke-[#FF0034] drop-shadow-2xl" width={6} height={6} viewBox="0 0 122.88 122.88">
                                                    <g>
                                                        <path d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44s-27.51,61.44-61.44,61.44S0,95.37,0,61.44S27.51,0,61.44,0L61.44,0z" />
                                                    </g>
                                                </svg>
                                            </div>
                                        ) : (
                                            null
                                        )
                                        }



                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="opacity-20">
                                            <path d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z" fill="white" />
                                        </svg>
                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                        <motion.div
                            whileTap={{ scale: 0.9 }}

                        >
                            <div className="relative">
                                <Link href={`/${username}`} className="py-5 px-5 my-1 mx-1 flex justify-center">
                                    <div className="h-full justify-center items-center">


                                        <svg aria-label="Profil" role="img" viewBox="0 0 26 26" width={26} height={26} className="opacity-20">
                                            <title>Profil</title>
                                            <circle cx="13" cy="7.25" r="4" stroke="currentColor" strokeWidth="2.5">
                                            </circle>
                                            <path d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z" stroke="currentColor" strokeWidth="2.5"></path>
                                        </svg>
                                    </div>
                                    <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                                </Link>
                            </div>
                        </motion.div>
                    </nav>
                </div>

                <div className="flex flex-col w-18 h-18 mr-4 col-start-3 ml-auto">
                    <DropdownMenu modal={false} >
                        <DropdownMenuTrigger className=" cursor-pointer  outline-none ">

                            <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: .001 }} className=" outline-none" >
                                <Image
                                    src="/svgs/threedot.svg"
                                    alt="logo"
                                    width={45}
                                    height={45}
                                    className="flex outline-none" />


                            </motion.div>
                        </DropdownMenuTrigger>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, delay: .1 }}
                        >
                            <DropdownMenuContent className="w-[170px] mr-3 drop-shadow-xl rounded-2xl bg-[#181818] border-x-[0.2333333px] border-b-[0.2333333px]  border-x-border border-y-border  text-small-semibold !text-[15px]">
                                <DropdownMenuGroup className="text-white text-[14px]">
                                    <DropdownMenuItem >
                                        Apparence
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem  onClick={handleConfirm}>
                                            Paramètres
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem >
                                        Vos J'aime
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem  onClick={SignOutUser} className="!text-[rgb(255,48,64)]">
                                            Déconnexion
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </motion.div>
                    </DropdownMenu>

                </div>
            </header>
            <nav className="z-[1] w-full backdrop-blur-3xl bg-[rgba(16,16,16,.90)]  fixed bottom-0 my-auto  mobile:hidden grid grid-cols-[repeat(5,20%)] ">
                <motion.div
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { refreshFeed() }}
                >
                    <div className="relative">
                        <Link href="/" className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width={26} height={26} className=" opacity-20">
                                    <path fill="#706f6f" d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
                                </svg>

                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <Link href="/search" className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="26px" height="26px" className=" opacity-20">
                                    <path fill="#706f6f" d="M 20.5 6 C 12.515556 6 6 12.515562 6 20.5 C 6 28.484438 12.515556 35 20.5 35 C 23.773158 35 26.788919 33.893018 29.220703 32.050781 L 38.585938 41.414062 A 2.0002 2.0002 0 1 0 41.414062 38.585938 L 32.050781 29.220703 C 33.893017 26.788918 35 23.773156 35 20.5 C 35 12.515562 28.484444 6 20.5 6 z M 20.5 10 C 26.322685 10 31 14.677319 31 20.5 C 31 23.295711 29.914065 25.820601 28.148438 27.697266 A 2.0002 2.0002 0 0 0 27.701172 28.144531 C 25.824103 29.912403 23.29771 31 20.5 31 C 14.677315 31 10 26.322681 10 20.5 C 10 14.677319 14.677315 10 20.5 10 z" />
                                </svg>

                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <div onClick={togglePopup(false)} className=" cursor-pointer py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#706f6f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className=" opacity-20">
                                    <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 8l-5-5-5 5M12 4.2v10.3" />
                                </svg>

                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full  hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <Link href="/activity" className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">
                                {notificationCount && notificationCount !== 0 ? (
                                    <div className=" justify-center items-center w-full h-full flex">
                                        <svg xmlns="http://www.w3.org/2000/svg" className=" absolute top-3 fill-red-800 stroke-red-800 drop-shadow-2xl" width={6} height={6} viewBox="0 0 122.88 122.88">
                                            <g>
                                                <path d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44s-27.51,61.44-61.44,61.44S0,95.37,0,61.44S27.51,0,61.44,0L61.44,0z" />
                                            </g>
                                        </svg>
                                    </div>
                                ) : (
                                    null
                                )
                                }

                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="opacity-20">
                                    <path d="M12 9.229c.234-1.12 1.547-6.229 5.382-6.229 2.22 0 4.618 1.551 4.618 5.003 0 3.907-3.627 8.47-10 12.629-6.373-4.159-10-8.722-10-12.629 0-3.484 2.369-5.005 4.577-5.005 3.923 0 5.145 5.126 5.423 6.231zm-12-1.226c0 4.068 3.06 9.481 12 14.997 8.94-5.516 12-10.929 12-14.997 0-7.962-9.648-9.028-12-3.737-2.338-5.262-12-4.27-12 3.737z" fill="white" />
                                </svg>
                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
                <motion.div
                    whileTap={{ scale: 0.9 }}

                >
                    <div className="relative">
                        <Link href={`/${username}`} className="py-5 px-5 my-1 mx-1 flex justify-center">
                            <div className="h-full justify-center items-center">


                                <svg aria-label="Profil" role="img" viewBox="0 0 26 26" width={26} height={26} className="opacity-20">
                                    <title>Profil</title>
                                    <circle cx="13" cy="7.25" r="4" stroke="currentColor" strokeWidth="2.5">
                                    </circle>
                                    <path d="M6.26678 23.75H19.744C21.603 23.75 22.5 23.2186 22.5 22.0673C22.5 19.3712 18.8038 15.75 13 15.75C7.19625 15.75 3.5 19.3712 3.5 22.0673C3.5 23.2186 4.39704 23.75 6.26678 23.75Z" stroke="currentColor" strokeWidth="2.5"></path>
                                </svg>
                            </div>
                            <div className="z-0 absolute top-0 w-[95%] h-full hover:bg-[rgba(243,245,247,.06)] opacity-60 duration-150 rounded-lg"></div>
                        </Link>
                    </div>
                </motion.div>
            </nav>
        </>




    )
}
export default TopBar;

