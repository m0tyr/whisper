'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownSection, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

import { SignedIn, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
import CreateWhisper from "../forms/CreateWhisper";
import { AnimatePresence } from 'framer-motion'
import { motion } from "framer-motion"
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";


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

    const handleBackButtonClick = () => {
        router.refresh();
    };
    return (
        <>


            <nav className="topbar backdrop-blur-2xl my-0">
                <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-all duration-300 ">
                    <Button onClick={handleBackButtonClick}>
                        <Image src="/logo_resize.png" alt="logo" width={45} height={45} className="opacity-85 hover:opacity-100 " />
                    </Button>

                </Link>
                <div className="flex justify-center items-center gap-12 md:gap-16">
                    <Link href="/" className=" transition-all duration-200 md: ">
                        <Button onClick={handleBackButtonClick}>
                            <Image src="/svgs/home.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />
                        </Button>
                    </Link>
                    <Link href="/search" className=" transition-all duration-200 ">

                        <Image src="/svgs/search.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150 " />


                    </Link>
                    <Button onClick={togglePopup} className=" transition-all duration-200 ">

                        <Image src="/svgs/create.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                    </Button>
                    <Link href="/activity" className=" transition-all duration-200 ">

                        <Image src="/svgs/favorite.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                    </Link>

                    <Link href={`/${username}`} className=" transition-all duration-200 ">

                        <Image src="/svgs/profil.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                    </Link>
                </div>

                <Dropdown>

                    <DropdownTrigger>

                        <Button
                            variant="bordered"
                        >
                            <Image
                                src="/svgs/threedot.svg"
                                alt="logo"
                                width={45}
                                height={45}
                                className="pt-1" />

                        </Button>
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