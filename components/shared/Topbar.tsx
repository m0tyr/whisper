"use client"
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Dropdown, DropdownTrigger, DropdownSection, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

import { SignedIn, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
function TopBar() {
    const isUserLoggedIn = true;

    function handleConfirm() {
        location.href = "/settings";
    }
    return (
        <nav className="topbar backdrop-blur-3xl">
            <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-all duration-300 ">

                <Image src="./svgs/logo.svg" alt="logo" width=
                    {45} height={45} className="opacity-85 hover:opacity-100" />


            </Link>
            <div className="flex justify-center items-center gap-20">
                <Link href="/" className="hover:scale-105 transition-all duration-200 ">

                    <Image src="./svgs/home.svg" alt="logo" width=
                        {30} height={30} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                </Link>
                <Link href="/search" className="hover:scale-105 transition-all duration-200 ">

                    <Image src="./svgs/search.svg" alt="logo" width=
                        {35} height={35} className="opacity-45 hover:opacity-100 transition-all duration-150 " />


                </Link>
                <Link href="/create" className="hover:scale-105 transition-all duration-200 ">

                    <Image src="./svgs/create.svg" alt="logo" width=
                        {30} height={30} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                </Link>
                <Link href="/activity" className="hover:scale-105 transition-all duration-200 ">

                    <Image src="./svgs/favorite.svg" alt="logo" width=
                        {30} height={30} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                </Link>

                <Link href="/user" className="hover:scale-105 transition-all duration-200 ">

                    <Image src="./svgs/profil.svg" alt="logo" width=
                        {30} height={30} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                </Link>
            </div>

            <Dropdown>

                <DropdownTrigger>

                    <Button
                        variant="bordered"
                    >
                        <Image
                            src="./svgs/threedot.svg"
                            alt="logo"
                            width={45}
                            height={45}
                            className="pt-1"
                        />

                    </Button>
                </DropdownTrigger>
                <DropdownMenu
                    aria-label="Custom item styles"

                    variant="faded"
                    className="flex-col bg-glassmorphism mx-0 my-0 pt-4 px-4 rounded-3xl float-right right-0 outline-none w-auto gap-3"
                    disabledKeys={["edit", "delete"]}

                >
                    <DropdownSection showDivider className="bg-insanedark"  >
                        <DropdownItem className="py-2" textValue="look" >

                            <Button className="text-white"
                            >

                                Apparence


                            </Button>



                        </DropdownItem>


                        <DropdownItem className="py-2"  textValue="settings" >


                            <Button className="text-white" onClick={handleConfirm}>
                                Paramètres

                            </Button>



                        </DropdownItem>
                    </DropdownSection>
                    <DropdownItem className="py-2 text-red-600" showDivider={true} color="danger"  textValue="disconnect">


                        <SignedIn >
                            <SignOutButton >
                                Déconnexion
                            </SignOutButton>
                        </SignedIn>




                    </DropdownItem>


                </DropdownMenu>
            </Dropdown>
        </nav >
    )
}
export default TopBar;