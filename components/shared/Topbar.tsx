'use client'
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Dropdown, DropdownTrigger, DropdownSection, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import CreateWhisper from "@/components/forms/CreateWhisper";
import { currentUser } from "@clerk/nextjs";

import { SignedIn, SignOutButton, OrganizationSwitcher } from "@clerk/nextjs";
 function TopBar() {
    const isUserLoggedIn = true;
    function handleConfirm() {
        location.href = "/settings";
    }
    const [showCreateWhisper, setShowCreateWhisper] = useState(false);

 
    const whisperData = {
        id: "1",
        author: {
          name: "John Doe",
          username: "@johndoe",
          image: "https://example.com/avatar.jpg"
        },
        content: "This is a test whisper!",
        date: "2024-02-20T12:00:00Z",
        likes: 10,
        retweets: 5,
        replies: 3,
        media: ["https://example.com/media1.jpg", "https://example.com/media2.jpg"]
      };
    return (
       
        <><nav className="topbar backdrop-blur-xl my-0">
            <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-all duration-300 ">

                <Image src="./svgs/logo.svg" alt="logo" width={45} height={45} className="opacity-85 hover:opacity-100 " />


            </Link>
            <div className="flex justify-center items-center gap-12 md:gap-16">
                <Link href="/" className=" transition-all duration-200 md: ">

                    <Image src="./svgs/home.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                </Link>
                <Link href="/search" className=" transition-all duration-200 ">

                    <Image src="./svgs/search.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150 " />


                </Link>
                <Button onClick={() => setShowCreateWhisper(!showCreateWhisper)} className=" transition-all duration-200 ">

                    <Image src="./svgs/create.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                </Button>
                <Link href="/activity" className=" transition-all duration-200 ">

                    <Image src="./svgs/favorite.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />


                </Link>

                <Link href="/user" className=" transition-all duration-200 ">

                    <Image src="./svgs/profil.svg" alt="logo" width={29} height={29} className="opacity-45 hover:opacity-100 transition-all duration-150" />


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
        <><div>
            {showCreateWhisper ? <CreateWhisper {...whisperData} /> : ''}
        </div></></>

    )
}
export default TopBar;