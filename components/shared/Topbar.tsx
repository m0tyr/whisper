'use client'
import Image from "next/image";
import Link from "next/link";
import { Dropdown, DropdownTrigger, DropdownSection, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

import { SignedIn, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
import CreateWhisper from "../forms/CreateWhisper";
import { AnimatePresence } from 'framer-motion'
import { motion } from "framer-motion"
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";





const TopBar = ({ user, _id }: any) => {
    const isUserLoggedIn = true;
    function handleConfirm() {
        location.href = "/settings";
    }
    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);

    };
    const username = user ? user.username : '';
    const router = useRouter();


    return (
        <>

            <header className="backdrop-blur-3xl topbar top-0 left-0 right-0 w-full h-[74px] grid-cols-[1fr_50vw_1fr] mobile:grid-cols-[1fr_max-content_1fr] grid max-w-[1230px] mx-auto">
                   <div className="mobile:block mobile:col-start-1 hidden"></div>
              
                <div className="flex flex-col w-18 h-18  col-start-2 mx-auto mmy-auto  mobile:ml-4 mobile:col-start-1 mobile:mr-auto ">
                    <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-all duration-300 ">
                            <Image src="/logo_resize.png" alt="logo" width={45} height={45} className="opacity-85 hover:opacity-100 " />

                    </Link>
                </div>
            

                    <div className="md:w-[620px] xs:w-[550px]  max-w-[620px] w-[620px] px-16 h-full mobile:col-start-2 col-start-1 mobile:block hidden">
                        <nav className="h-full grid grid-cols-[repeat(5,20%)] ">
                            <motion.div
                                whileTap={{ scale: 0.9 }}

                            >
                                <div className="relative">
                                    <Link href="/"  className="py-5 px-5 my-1 mx-1 flex justify-center">
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
                                    <div onClick={togglePopup} className=" cursor-pointer py-5 px-5 my-1 mx-1 flex justify-center">
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
                                    <Link href="/likes" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                        <div className="h-full justify-center items-center">


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
                    <Dropdown>

                        <DropdownTrigger>

                            <button
                            >
                                <Image
                                    src="/svgs/threedot.svg"
                                    alt="logo"
                                    width={45}
                                    height={45}
                                    className="flex" />

                            </button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Custom item styles"

                            variant="faded"
                            className="flex-col bg-glassmorphism mx-0 my-0 pt-4 px-4 rounded-3xl float-right right-0 outline-none w-auto gap-3"
                            disabledKeys={["edit", "delete"]}

                        >
                            <DropdownSection showDivider className="bg-insanedark">
                                <DropdownItem className="py-2" textValue="look">

                                    <Button className="text-white"
                                    >

                                        Apparence


                                    </Button>



                                </DropdownItem>


                                <DropdownItem className="py-2" textValue="settings">


                                    <Button className="text-white" onClick={handleConfirm}>
                                        Paramètres

                                    </Button>



                                </DropdownItem>
                            </DropdownSection>
                            <DropdownItem className="py-2 text-red-600" showDivider={true} color="danger" textValue="disconnect">


                                <SignedIn>
                                    <SignOutButton>
                                        Déconnexion
                                    </SignOutButton>
                                </SignedIn>




                            </DropdownItem>


                        </DropdownMenu>
                    </Dropdown>
                </div>
            </header>


                <nav className="z-[1] w-full backdrop-blur-3xl bg-[rgba(16,16,16,.90)]  fixed bottom-0 my-auto  mobile:hidden grid grid-cols-[repeat(5,20%)] ">
                    <motion.div
                        whileTap={{ scale: 0.9 }}

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
                            <div onClick={togglePopup} className=" cursor-pointer py-5 px-5 my-1 mx-1 flex justify-center">
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
                            <Link href="/likes" className="py-5 px-5 my-1 mx-1 flex justify-center">
                                <div className="h-full justify-center items-center">


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
            {showPopup && (
                <>
                    <motion.div
                        initial={{ opacity: 0, zIndex: 0 }}
                        animate={{ opacity: 1, zIndex: 51 }}
                        exit={{ opacity: 0 }}
                        transition={{}}
                        id='top'
                        className="fixed top-0 left-0 inset-0 bg-black bg-opacity-75 w-full " onClick={togglePopup}></motion.div>

                    <CreateWhisper user={user} _id={_id} toclose={togglePopup} />

                </>


            )}
        </>




    )
}
export default TopBar;

